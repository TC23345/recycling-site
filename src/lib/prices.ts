import { z } from "zod";

export type Metal =
  | "copper"
  | "aluminum"
  | "brass"
  | "steel-stainless"
  | "steel-prepared"
  | "gold"
  | "silver";

/** Metals that are conventionally quoted in USD/troy-ounce, not USD/lb. */
export const PRECIOUS_METALS: ReadonlySet<Metal> = new Set<Metal>([
  "gold",
  "silver",
]);

export function isPrecious(metal: Metal): boolean {
  return PRECIOUS_METALS.has(metal);
}

export interface PriceSnapshot {
  metal: Metal;
  label: string;
  /** Canonical price per pound. For precious metals, this is the toz price ÷ TOZ_PER_LB
   *  — kept populated so legacy consumers don't break, but the display surfaces use
   *  `usdPerToz` instead via `formatMetalPrice()`. */
  usdPerLb: number;
  /** Populated for precious metals only (gold, silver). USD per troy ounce. */
  usdPerToz?: number;
  asOf: string;
  source: "metals-dev" | "yahoo" | "derived" | "stub";
  changePct: number;
}

export type PriceMap = Record<Metal, PriceSnapshot>;

// ── Yahoo Finance unofficial chart endpoint ──────────────────────────────
// Public, no auth required. Symbols:
//   HG=F  → COMEX Copper futures, USD/lb
//   ALI=F → COMEX Aluminum futures, USD/lb (when available)
// We validate the response shape with Zod so any upstream change cleanly
// falls back to the jitter-stub instead of throwing in production.

const YahooMetaSchema = z.object({
  symbol: z.string(),
  currency: z.string().optional(),
  regularMarketPrice: z.number(),
  previousClose: z.number().optional(),
  chartPreviousClose: z.number().optional(),
});

const YahooChartSchema = z.object({
  chart: z.object({
    result: z
      .array(
        z.object({
          meta: YahooMetaSchema,
        })
      )
      .min(1),
    error: z.unknown().nullable(),
  }),
});

interface YahooFetchResult {
  price: number;
  prevClose: number;
}

async function fetchYahoo(symbol: string): Promise<YahooFetchResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
    const res = await fetch(url, {
      headers: {
        // Yahoo's edge sometimes 403s requests without a UA
        "User-Agent":
          "Mozilla/5.0 (compatible; whatsmyscrapworth/1.0; +https://www.whatsmyscrapworth.com)",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const parsed = YahooChartSchema.safeParse(json);
    if (!parsed.success) return null;
    const meta = parsed.data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? price;
    if (!Number.isFinite(price) || price <= 0) return null;
    return { price, prevClose };
  } catch {
    return null;
  }
}

// ── Metals.dev — paid provider, primary source when METALS_DEV_API_KEY is set
// API ref: .claude/research/metals-dev-api.md. We hit /v1/latest with
// `unit=lb` so industrial metals come back in USD/lb directly (no MT→lb
// conversion). The free plan is ~100 req/month, so revalidate is set high
// (1800s) and the response is request-deduped within a render pass by Next.

const MetalsDevSuccessSchema = z.object({
  status: z.literal("success"),
  currency: z.string(),
  unit: z.string(),
  metals: z.record(z.string(), z.number()),
  currencies: z.record(z.string(), z.number()),
  timestamps: z.object({
    metal: z.string(),
    currency: z.string(),
  }),
});

const MetalsDevFailureSchema = z.object({
  status: z.literal("failure"),
  error_code: z.number().int(),
  error_message: z.string(),
});

const MetalsDevResponseSchema = z.discriminatedUnion("status", [
  MetalsDevSuccessSchema,
  MetalsDevFailureSchema,
]);

interface MetalsDevFetchResult {
  // Industrial metals (USD/lb because we passed unit=lb)
  copper?: number;
  aluminum?: number;
  // Precious metals (also returned in USD/lb when unit=lb is passed; we
  // convert to USD/toz at storage time for display).
  gold?: number;
  silver?: number;
  asOf: string;
}

async function fetchMetalsDev(): Promise<MetalsDevFetchResult | null> {
  const apiKey = process.env.METALS_DEV_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://api.metals.dev/v1/latest?api_key=${encodeURIComponent(apiKey)}&currency=USD&unit=lb`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Free tier ≈ 100 req/month; 30-min revalidate keeps the budget safe
      // for low/moderate traffic. Revisit if we upgrade the plan.
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const parsed = MetalsDevResponseSchema.safeParse(json);
    if (!parsed.success) return null;
    if (parsed.data.status === "failure") {
      // Quota exceeded (1203), invalid key (1101), etc. — fall through to
      // the Yahoo path silently. Errors are visible via PriceSnapshot.source.
      return null;
    }
    const m = parsed.data.metals;
    const copperRaw = m.copper ?? m.lme_copper;
    const aluminumRaw = m.aluminum ?? m.lme_aluminum;
    const goldRaw = m.gold ?? m.lbma_gold_pm ?? m.lbma_gold_am;
    const silverRaw = m.silver ?? m.lbma_silver;
    const finite = (n: number | undefined): number | undefined =>
      typeof n === "number" && Number.isFinite(n) && n > 0 ? n : undefined;
    return {
      copper: finite(copperRaw),
      aluminum: finite(aluminumRaw),
      gold: finite(goldRaw),
      silver: finite(silverRaw),
      asOf: parsed.data.timestamps.metal,
    };
  } catch {
    return null;
  }
}

// ── Metals.dev timeseries — historical daily data for charts + trend insight
// Endpoint: /v1/timeseries?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
// Caveat from research doc: timeseries returns USD/toz regardless of `unit`
// param. We convert client-side to USD/lb here so chart points share units
// with the live spot pipeline.

const TOZ_PER_LB = 14.583_333_333; // 1 lb / 1 toz = 453.59237 g / 31.1034768 g

const TimeseriesSuccessSchema = z.object({
  status: z.literal("success"),
  currency: z.string(),
  unit: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  // Industrial metals are null on the Metals.dev free plan — only precious
  // metals return numeric values for /timeseries. Allow null per metal so the
  // schema parses; we filter nulls when extracting points below.
  rates: z.record(
    z.string(),
    z.object({
      metals: z.record(z.string(), z.number().nullable()),
      currencies: z.record(z.string(), z.number().nullable()).optional(),
    }),
  ),
});

const TimeseriesResponseSchema = z.discriminatedUnion("status", [
  TimeseriesSuccessSchema,
  MetalsDevFailureSchema,
]);

export interface TimeseriesPoint {
  date: string; // YYYY-MM-DD
  copper?: number; // USD/lb after scrap discount
  aluminum?: number; // USD/lb after scrap discount
  brass?: number; // derived: copper × 0.62
  gold?: number; // USD/toz (no scrap discount; refiners ≈ 95-99% of spot)
  silver?: number; // USD/toz
}

export type TimeseriesArray = TimeseriesPoint[];

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Convert a raw API price to USD/lb based on the response's `unit` field.
// Industrial metals can come back as USD/toz on /timeseries even when
// other endpoints respect `unit=lb`. Defensive on both sides.
function toUsdPerLb(raw: number, unit: string): number {
  if (unit === "lb") return raw;
  if (unit === "toz") return raw * TOZ_PER_LB;
  // Fallback: assume per-pound. Caller's job to verify if values look wrong.
  return raw;
}

export async function fetchMetalsDevTimeseries(
  days = 30,
): Promise<TimeseriesArray | null> {
  const apiKey = process.env.METALS_DEV_API_KEY;
  if (!apiKey) return null;

  const end = new Date();
  const start = new Date();
  // /timeseries enforces a 30-day max range. Clamp.
  const span = Math.min(Math.max(days, 1), 30);
  start.setUTCDate(start.getUTCDate() - (span - 1));

  try {
    const url =
      `https://api.metals.dev/v1/timeseries` +
      `?api_key=${encodeURIComponent(apiKey)}` +
      `&start_date=${isoDate(start)}` +
      `&end_date=${isoDate(end)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Historical data only changes once per day; cache 24h.
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const parsed = TimeseriesResponseSchema.safeParse(json);
    if (!parsed.success || parsed.data.status === "failure") return null;

    const success = parsed.data; // narrowed to the success branch
    const unit = success.unit; // "toz" or "lb"
    const dates = Object.keys(success.rates).sort(); // ascending
    const points: TimeseriesPoint[] = dates.map((date) => {
      const day = success.rates[date];
      const m = day.metals;
      const copperRaw = m.copper ?? m.lme_copper;
      const aluminumRaw = m.aluminum ?? m.lme_aluminum;
      // Precious: timeseries works on free tier for these. Pull gold from
      // the LBMA PM fix when available, fall back to spot.
      const goldRaw = m.gold ?? m.lbma_gold_pm ?? m.lbma_gold_am;
      const silverRaw = m.silver ?? m.lbma_silver;

      const usable = (n: number | null | undefined): n is number =>
        typeof n === "number" && Number.isFinite(n) && n > 0;

      const copperLb = usable(copperRaw)
        ? toUsdPerLb(copperRaw, unit) * SCRAP_DISCOUNT.copper
        : undefined;
      const aluminumLb = usable(aluminumRaw)
        ? toUsdPerLb(aluminumRaw, unit) * SCRAP_DISCOUNT.aluminum
        : undefined;
      const brassLb = copperLb !== undefined ? copperLb * 0.62 : undefined;
      // Precious metals stored in USD/toz. The timeseries endpoint defaults
      // to toz; if it ever returns lb, divide by TOZ_PER_LB to get back to toz.
      const goldToz = usable(goldRaw)
        ? unit === "lb"
          ? goldRaw / TOZ_PER_LB
          : goldRaw
        : undefined;
      const silverToz = usable(silverRaw)
        ? unit === "lb"
          ? silverRaw / TOZ_PER_LB
          : silverRaw
        : undefined;

      return {
        date,
        copper: copperLb !== undefined ? roundTo(copperLb, 4) : undefined,
        aluminum: aluminumLb !== undefined ? roundTo(aluminumLb, 4) : undefined,
        brass: brassLb !== undefined ? roundTo(brassLb, 4) : undefined,
        gold: goldToz !== undefined ? roundTo(goldToz, 2) : undefined,
        silver: silverToz !== undefined ? roundTo(silverToz, 3) : undefined,
      };
    });

    return points.length > 0 ? points : null;
  } catch {
    return null;
  }
}

// ── Yahoo historical fallback ────────────────────────────────────────────
// The Metals.dev free plan returns null for industrial metals on /timeseries
// (precious metals only). Yahoo's chart endpoint already has 30 days of daily
// closes for HG=F (copper, USD/lb) and ALI=F (aluminum, USD/MT) — same
// endpoint we already poll for live spot, just with a wider `range` param.
// One call per metal per day, edge-cached 24h.

const YahooHistoricalSchema = z.object({
  chart: z.object({
    result: z
      .array(
        z.object({
          timestamp: z.array(z.number()),
          indicators: z.object({
            quote: z
              .array(
                z.object({
                  close: z.array(z.number().nullable()),
                }),
              )
              .min(1),
          }),
        }),
      )
      .min(1),
    error: z.unknown().nullable(),
  }),
});

async function fetchYahooHistorical(
  symbol: string,
): Promise<{ date: string; close: number }[] | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol,
    )}?interval=1d&range=1mo`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; whatsmyscrapworth/1.0; +https://www.whatsmyscrapworth.com)",
        Accept: "application/json",
      },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const parsed = YahooHistoricalSchema.safeParse(json);
    if (!parsed.success) return null;

    const result = parsed.data.chart.result[0];
    const closes = result.indicators.quote[0].close;
    const out: { date: string; close: number }[] = [];
    for (let i = 0; i < result.timestamp.length; i++) {
      const close = closes[i];
      if (typeof close !== "number" || !Number.isFinite(close) || close <= 0) continue;
      const date = new Date(result.timestamp[i] * 1000).toISOString().slice(0, 10);
      out.push({ date, close });
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

/**
 * Top-level historical fetch that tries Metals.dev first, then per-metal Yahoo
 * fallback. Returns a unified TimeseriesArray with copper / aluminum / brass
 * post-discount USD/lb. Brass is always derived (Metals.dev or Yahoo path).
 *
 * The free Metals.dev plan returns null for industrial metals, so this almost
 * always falls through to Yahoo for copper + aluminum on free plans. When the
 * plan upgrades to one that includes industrial metal history, Metals.dev is
 * preferred (more authoritative LME-stamped data).
 */
export async function fetchTimeseries(
  days = 30,
): Promise<TimeseriesArray | null> {
  const [metalsDev, copperYahoo, aluminumYahoo] = await Promise.all([
    fetchMetalsDevTimeseries(days),
    fetchYahooHistorical("HG=F"),
    fetchYahooHistorical("ALI=F"),
  ]);

  const hasMetalsDevCopper =
    metalsDev?.some((p) => typeof p.copper === "number") ?? false;
  const hasMetalsDevAluminum =
    metalsDev?.some((p) => typeof p.aluminum === "number") ?? false;

  // Build a date-keyed map so we can merge multiple sources cleanly.
  const byDate = new Map<string, TimeseriesPoint>();

  if (metalsDev) {
    for (const p of metalsDev) byDate.set(p.date, { ...p });
  }

  // Helper to upsert a metal value at a given date
  const upsert = (
    date: string,
    metal: "copper" | "aluminum",
    value: number,
  ) => {
    const existing = byDate.get(date) ?? { date };
    existing[metal] = roundTo(value, 4);
    byDate.set(date, existing);
  };

  // Yahoo HG=F is already USD/lb. Apply the same scrap discount the live path
  // does so chart values match what users see on the live ticker.
  if (!hasMetalsDevCopper && copperYahoo) {
    for (const { date, close } of copperYahoo) {
      upsert(date, "copper", close * SCRAP_DISCOUNT.copper);
    }
  }

  // Yahoo ALI=F is USD/metric-ton. Convert before applying discount.
  if (!hasMetalsDevAluminum && aluminumYahoo) {
    for (const { date, close } of aluminumYahoo) {
      upsert(
        date,
        "aluminum",
        (close / LB_PER_METRIC_TON) * SCRAP_DISCOUNT.aluminum,
      );
    }
  }

  // Brass: derive from whatever copper value we landed on for each date.
  for (const point of byDate.values()) {
    if (typeof point.copper === "number") {
      point.brass = roundTo(point.copper * 0.62, 4);
    }
  }

  const all = Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  return all.length >= 2 ? all : null;
}

// ── Trend insight — editorial string from a timeseries window ────────────
// Computes the kind of phrase that goes above the live price: "Copper is
// +5.4% this week, near a 30-day high." Pure function over an array of
// points; no API calls, no I/O.

export interface TrendStats {
  current: number;
  weekAgo?: number;
  monthAgo?: number;
  weekChangePct: number;
  monthChangePct: number;
  high30d: number;
  low30d: number;
  /** True when current is within 1.5% of the 30-day high */
  nearHigh: boolean;
  /** True when current is within 1.5% of the 30-day low */
  nearLow: boolean;
}

export function computeTrend(
  points: TimeseriesArray,
  metal: "copper" | "aluminum" | "brass" | "gold" | "silver",
): TrendStats | null {
  // Most-recent value first non-null walking back from the end.
  const values = points
    .map((p) => p[metal])
    .filter((n): n is number => typeof n === "number");
  if (values.length === 0) return null;

  const current = values[values.length - 1];
  const monthAgo = values[0];
  const weekIdx = Math.max(0, values.length - 8); // ~7 days back
  const weekAgo = values[weekIdx];

  const high30d = Math.max(...values);
  const low30d = Math.min(...values);

  const pct = (a: number, b: number) => (b > 0 ? ((a - b) / b) * 100 : 0);
  const tolerance = 0.015;

  return {
    current,
    weekAgo,
    monthAgo,
    weekChangePct: roundTo(pct(current, weekAgo), 2),
    monthChangePct: roundTo(pct(current, monthAgo), 2),
    high30d,
    low30d,
    nearHigh: high30d > 0 && (high30d - current) / high30d <= tolerance,
    nearLow: low30d > 0 && (current - low30d) / low30d <= tolerance,
  };
}

// ── Stub baselines + deterministic jitter ────────────────────────────────
// Used when Yahoo is unreachable or returns unparseable data. The jitter
// makes prices appear "live" so the UI animation has something to react to;
// it is *not* market data — clearly labeled `source: "stub"`.

// usdPerLb is the canonical numeric storage. For precious metals (gold,
// silver) the lb baseline is the toz baseline ÷ TOZ_PER_LB so display
// surfaces can compute USD/toz on the fly via formatMetalPrice().
const STUB_BASELINES: Record<Metal, { label: string; usdPerLb: number }> = {
  copper: { label: "Copper (bare bright)", usdPerLb: 4.12 },
  aluminum: { label: "Aluminum (sheet)", usdPerLb: 0.78 },
  brass: { label: "Brass (yellow)", usdPerLb: 2.65 },
  "steel-stainless": { label: "Stainless steel (304)", usdPerLb: 0.45 },
  "steel-prepared": { label: "Prepared steel (#1 HMS)", usdPerLb: 0.12 },
  // 1 lb = 14.5833 toz, so usdPerLb = usdPerToz × TOZ_PER_LB.
  // Gold ~$3,500/toz × 14.58 ≈ $51,000/lb. Silver ~$30/toz × 14.58 ≈ $437/lb.
  gold: { label: "Gold (spot)", usdPerLb: 51042 },
  silver: { label: "Silver (spot)", usdPerLb: 437.5 },
};

function deterministicJitter(seed: string, range = 0.03): number {
  // Simple FNV-1a-ish hash → number in [-range, +range]
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const norm = ((h >>> 0) % 10000) / 10000; // [0, 1)
  return (norm - 0.5) * 2 * range;
}

function stubSnapshot(metal: Metal, asOf: string): PriceSnapshot {
  const base = STUB_BASELINES[metal];
  const minuteBucket = Math.floor(Date.now() / 60_000); // changes once per minute
  const jitter = deterministicJitter(`${metal}-${minuteBucket}`);
  const prevJitter = deterministicJitter(`${metal}-${minuteBucket - 1}`);
  const price = base.usdPerLb * (1 + jitter);
  const prev = base.usdPerLb * (1 + prevJitter);
  const changePct = prev > 0 ? ((price - prev) / prev) * 100 : 0;
  const snapshot: PriceSnapshot = {
    metal,
    label: base.label,
    usdPerLb: roundTo(price, 4),
    asOf,
    source: "stub",
    changePct: roundTo(changePct, 2),
  };
  if (isPrecious(metal)) {
    // usdPerToz = usdPerLb / TOZ_PER_LB (a troy ounce is smaller than a pound,
    // so its dollar price is smaller than the per-pound price).
    snapshot.usdPerToz = roundTo(price / TOZ_PER_LB, 2);
  }
  return snapshot;
}

function roundTo(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

// ── Unit conversion + scrap discount factors ─────────────────────────────
// COMEX HG=F is quoted in USD/lb directly.
// LME/COMEX ALI=F is quoted in USD/metric-ton; convert to USD/lb.
const LB_PER_METRIC_TON = 2204.622_62;

const SCRAP_DISCOUNT = {
  copper: 0.92, // bare bright ≈ 92% of COMEX
  aluminum: 0.7, // clean sheet ≈ 70% of LME aluminum
} as const;

// ── Public API ───────────────────────────────────────────────────────────

export async function fetchLivePrices(): Promise<PriceMap> {
  const asOf = new Date().toISOString();

  // Source chain per metal: Metals.dev (when key set) → Yahoo → stub.
  // All upstream fetches run in parallel; per-metal fallback is decided below.
  const [metalsDev, copperRaw, aluminumRaw] = await Promise.all([
    fetchMetalsDev(),
    fetchYahoo("HG=F"),
    fetchYahoo("ALI=F"),
  ]);

  const map: PriceMap = {
    copper: stubSnapshot("copper", asOf),
    aluminum: stubSnapshot("aluminum", asOf),
    brass: stubSnapshot("brass", asOf),
    "steel-stainless": stubSnapshot("steel-stainless", asOf),
    "steel-prepared": stubSnapshot("steel-prepared", asOf),
    gold: stubSnapshot("gold", asOf),
    silver: stubSnapshot("silver", asOf),
  };

  // Track final post-discount copper price + change so brass can mirror it.
  let copperUsdPerLb: number | null = null;
  let copperChangePct = 0;

  // ── Copper ──────────────────────────────────────────────────────────────
  if (metalsDev?.copper !== undefined) {
    // /v1/latest doesn't include change info; mark 0 until we wire /spot or
    // a previous-fetch cache. PriceSnapshot.source = "metals-dev" makes the
    // provenance visible in the UI badges.
    const price = metalsDev.copper * SCRAP_DISCOUNT.copper;
    map.copper = {
      metal: "copper",
      label: "Copper (bare bright)",
      usdPerLb: roundTo(price, 4),
      asOf,
      source: "metals-dev",
      changePct: 0,
    };
    copperUsdPerLb = price;
    copperChangePct = 0;
  } else if (copperRaw) {
    const price = copperRaw.price * SCRAP_DISCOUNT.copper;
    const prev = copperRaw.prevClose * SCRAP_DISCOUNT.copper;
    const changePct = prev > 0 ? roundTo(((price - prev) / prev) * 100, 2) : 0;
    map.copper = {
      metal: "copper",
      label: "Copper (bare bright)",
      usdPerLb: roundTo(price, 4),
      asOf,
      source: "yahoo",
      changePct,
    };
    copperUsdPerLb = price;
    copperChangePct = changePct;
  }

  // ── Aluminum ────────────────────────────────────────────────────────────
  if (metalsDev?.aluminum !== undefined) {
    // unit=lb means no MT→lb conversion needed.
    const price = metalsDev.aluminum * SCRAP_DISCOUNT.aluminum;
    map.aluminum = {
      metal: "aluminum",
      label: "Aluminum (sheet)",
      usdPerLb: roundTo(price, 4),
      asOf,
      source: "metals-dev",
      changePct: 0,
    };
  } else if (aluminumRaw) {
    // ALI=F is USD per metric ton — convert to USD/lb before applying discount.
    const lmePerLb = aluminumRaw.price / LB_PER_METRIC_TON;
    const lmePrevPerLb = aluminumRaw.prevClose / LB_PER_METRIC_TON;
    const price = lmePerLb * SCRAP_DISCOUNT.aluminum;
    const prev = lmePrevPerLb * SCRAP_DISCOUNT.aluminum;
    map.aluminum = {
      metal: "aluminum",
      label: "Aluminum (sheet)",
      usdPerLb: roundTo(price, 4),
      asOf,
      source: "yahoo",
      changePct: prev > 0 ? roundTo(((price - prev) / prev) * 100, 2) : 0,
    };
  }

  // ── Brass — derived from copper × 0.62 (alloy mass weighting) ──────────
  if (copperUsdPerLb !== null) {
    map.brass = {
      metal: "brass",
      label: "Brass (yellow)",
      usdPerLb: roundTo(copperUsdPerLb * 0.62, 4),
      asOf,
      source: "derived",
      changePct: copperChangePct,
    };
  }

  // ── Gold + silver (precious — quoted in USD/toz on display surfaces) ───
  // Metals.dev /v1/latest with unit=lb returns precious metals in USD/lb;
  // we convert to USD/toz for storage on the snapshot. No scrap discount —
  // refiners typically pay 95-99% of spot for jewelry / coin sorts; the
  // pillar MDX explains the per-grade payout context.
  if (metalsDev?.gold !== undefined) {
    const usdPerLb = metalsDev.gold;
    map.gold = {
      metal: "gold",
      label: "Gold (spot)",
      usdPerLb: roundTo(usdPerLb, 2),
      usdPerToz: roundTo(usdPerLb / TOZ_PER_LB, 2),
      asOf,
      source: "metals-dev",
      changePct: 0,
    };
  }
  if (metalsDev?.silver !== undefined) {
    const usdPerLb = metalsDev.silver;
    map.silver = {
      metal: "silver",
      label: "Silver (spot)",
      usdPerLb: roundTo(usdPerLb, 4),
      usdPerToz: roundTo(usdPerLb / TOZ_PER_LB, 3),
      asOf,
      source: "metals-dev",
      changePct: 0,
    };
  }

  return map;
}

export function formatUsd(n: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}

export function metalLabel(metal: Metal): string {
  return STUB_BASELINES[metal].label;
}

export function metalShortLabel(metal: Metal): string {
  switch (metal) {
    case "copper":
      return "Copper";
    case "aluminum":
      return "Aluminum";
    case "brass":
      return "Brass";
    case "steel-stainless":
      return "Stainless";
    case "steel-prepared":
      return "Steel";
    case "gold":
      return "Gold";
    case "silver":
      return "Silver";
  }
}

/**
 * Formats a snapshot's price using the metal's natural display unit:
 * USD/troy-ounce for precious metals (gold, silver), USD/pound otherwise.
 * Returned shape: { value: "$5.69", unit: "/lb" } so callers can style
 * the number and the unit independently.
 */
export function formatMetalPrice(snapshot: PriceSnapshot): {
  value: string;
  unit: string;
} {
  if (isPrecious(snapshot.metal) && snapshot.usdPerToz !== undefined) {
    // Gold rounds to 0 decimals (it's $2,500-ish; cents are noise),
    // silver to 2 (it's $30-ish; dimes matter).
    const digits = snapshot.metal === "gold" ? 0 : 2;
    return { value: formatUsd(snapshot.usdPerToz, digits), unit: "/ toz" };
  }
  return { value: formatUsd(snapshot.usdPerLb), unit: "/ lb" };
}

// Synchronous accessor for places that can't await (kept for backward compat;
// returns a stub snapshot). Prefer `fetchLivePrices()` server-side.
export function getStubPrice(metal: Metal): PriceSnapshot {
  return stubSnapshot(metal, new Date().toISOString());
}

// Extract HH:MM:SS (UTC) from an ISO 8601 timestamp. Deterministic across
// server and client — avoids hydration mismatch from locale-dependent
// `toLocaleTimeString()`.
export function formatLastUpdated(iso: string): string {
  return iso.length >= 19 ? iso.slice(11, 19) + " UTC" : iso;
}
