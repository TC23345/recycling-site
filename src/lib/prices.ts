import { z } from "zod";

export type Metal = "copper" | "aluminum" | "brass" | "steel-stainless" | "steel-prepared";

export interface PriceSnapshot {
  metal: Metal;
  label: string;
  usdPerLb: number;
  asOf: string;
  source: "yahoo" | "derived" | "stub";
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

  const [copperRaw, aluminumRaw] = await Promise.all([
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

  if (copperRaw) {
    const price = copperRaw.price * SCRAP_DISCOUNT.copper;
    const prev = copperRaw.prevClose * SCRAP_DISCOUNT.copper;
    map.copper = {
      metal: "copper",
      label: "Copper (bare bright)",
      usdPerLb: roundTo(price, 4),
      asOf,
      source: "yahoo",
      changePct: prev > 0 ? roundTo(((price - prev) / prev) * 100, 2) : 0,
    };
    // Brass is ~62% of copper price by mass-blend with zinc; derive.
    const brassPrice = price * 0.62;
    const brassPrev = prev * 0.62;
    map.brass = {
      metal: "brass",
      label: "Brass (yellow)",
      usdPerLb: roundTo(brassPrice, 4),
      asOf,
      source: "derived",
      changePct: brassPrev > 0 ? roundTo(((brassPrice - brassPrev) / brassPrev) * 100, 2) : 0,
    };
  }

  if (aluminumRaw) {
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
