import { z } from "zod";

export type Metal = "copper" | "aluminum" | "brass" | "steel-stainless" | "steel-prepared";

export interface PriceSnapshot {
  metal: Metal;
  label: string;
  usdPerLb: number;
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
          "Mozilla/5.0 (compatible; recycling-site/1.0; +https://recycling-site.example)",
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
  copper?: number; // already USD/lb (we passed unit=lb)
  aluminum?: number;
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
    const finite = (n: number | undefined): number | undefined =>
      typeof n === "number" && Number.isFinite(n) && n > 0 ? n : undefined;
    return {
      copper: finite(copperRaw),
      aluminum: finite(aluminumRaw),
      asOf: parsed.data.timestamps.metal,
    };
  } catch {
    return null;
  }
}

// ── Stub baselines + deterministic jitter ────────────────────────────────
// Used when Yahoo is unreachable or returns unparseable data. The jitter
// makes prices appear "live" so the UI animation has something to react to;
// it is *not* market data — clearly labeled `source: "stub"`.

const STUB_BASELINES: Record<Metal, { label: string; usdPerLb: number }> = {
  copper: { label: "Copper (bare bright)", usdPerLb: 4.12 },
  aluminum: { label: "Aluminum (sheet)", usdPerLb: 0.78 },
  brass: { label: "Brass (yellow)", usdPerLb: 2.65 },
  "steel-stainless": { label: "Stainless steel (304)", usdPerLb: 0.45 },
  "steel-prepared": { label: "Prepared steel (#1 HMS)", usdPerLb: 0.12 },
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
  return {
    metal,
    label: base.label,
    usdPerLb: roundTo(price, 4),
    asOf,
    source: "stub",
    changePct: roundTo(changePct, 2),
  };
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
  }
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
