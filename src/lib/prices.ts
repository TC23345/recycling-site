export type Metal = "copper" | "aluminum" | "brass" | "steel-stainless" | "steel-prepared";

export interface PriceSnapshot {
  metal: Metal;
  label: string;
  usdPerLb: number;
  asOf: string;
  source: string;
  changePct?: number;
}

export const STUB_PRICES: Record<Metal, PriceSnapshot> = {
  copper: {
    metal: "copper",
    label: "Copper (bare bright)",
    usdPerLb: 4.12,
    asOf: "2026-05-05",
    source: "fixture",
    changePct: 0.8,
  },
  aluminum: {
    metal: "aluminum",
    label: "Aluminum (sheet)",
    usdPerLb: 0.78,
    asOf: "2026-05-05",
    source: "fixture",
    changePct: -0.3,
  },
  brass: {
    metal: "brass",
    label: "Brass (yellow)",
    usdPerLb: 2.65,
    asOf: "2026-05-05",
    source: "fixture",
    changePct: 1.2,
  },
  "steel-stainless": {
    metal: "steel-stainless",
    label: "Stainless steel (304)",
    usdPerLb: 0.45,
    asOf: "2026-05-05",
    source: "fixture",
    changePct: 0.0,
  },
  "steel-prepared": {
    metal: "steel-prepared",
    label: "Prepared steel (#1 HMS)",
    usdPerLb: 0.12,
    asOf: "2026-05-05",
    source: "fixture",
    changePct: -0.5,
  },
};

export function getPrice(metal: Metal): PriceSnapshot {
  return STUB_PRICES[metal];
}

export function getAllPrices(): PriceSnapshot[] {
  return Object.values(STUB_PRICES);
}

export function formatUsd(n: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}
