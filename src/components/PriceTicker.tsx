import { getPrice, formatUsd, type Metal } from "@/lib/prices";

interface PriceTickerProps {
  metal: Metal;
}

export default function PriceTicker({ metal }: PriceTickerProps) {
  const snapshot = getPrice(metal);
  const change = snapshot.changePct ?? 0;
  const trendColor =
    change > 0 ? "text-emerald-700" : change < 0 ? "text-rust-700" : "text-steel-500";
  const trendSign = change > 0 ? "+" : "";

  return (
    <div className="my-6 flex items-baseline justify-between gap-4 rounded-card border border-steel-200 bg-white p-5 shadow-steel">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-rust-600">
          {snapshot.label}
        </p>
        <p className="mt-1 font-display text-3xl font-bold text-navy-900">
          {formatUsd(snapshot.usdPerLb)}
          <span className="ml-1 text-sm font-normal text-steel-500">/ lb</span>
        </p>
      </div>
      <div className="text-right">
        <p className={`font-mono text-sm ${trendColor}`}>
          {trendSign}
          {change.toFixed(1)}%
        </p>
        <p className="mt-1 text-xs text-steel-500">as of {snapshot.asOf}</p>
      </div>
    </div>
  );
}
