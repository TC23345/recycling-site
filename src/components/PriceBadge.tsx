import Link from "next/link";
import { fetchLivePrices, formatUsd, metalShortLabel, type Metal } from "@/lib/prices";
import { CLUSTERS } from "@/lib/manifest";

interface PriceBadgeProps {
  metal: Metal;
}

export default async function PriceBadge({ metal }: PriceBadgeProps) {
  const all = await fetchLivePrices();
  const snapshot = all[metal];
  const cluster = CLUSTERS.find((c) => c.metal === metal);
  if (!cluster) return null;

  const change = snapshot.changePct;
  const trendColor =
    change > 0 ? "text-emerald-700" : change < 0 ? "text-rust-700" : "text-steel-500";

  return (
    <Link
      href={cluster.href}
      className="group inline-flex items-baseline gap-2 rounded-md border border-steel-200 bg-white px-3 py-1.5 text-sm shadow-sm transition hover:border-rust-300 hover:shadow-steel"
    >
      <span className="font-display text-xs font-semibold uppercase tracking-widest text-steel-500 group-hover:text-rust-600">
        {metalShortLabel(metal)}
      </span>
      <span className="font-mono tabular-nums font-semibold text-navy-900">
        {formatUsd(snapshot.usdPerLb)}
      </span>
      <span className={`font-mono text-xs tabular-nums ${trendColor}`}>
        {change > 0 ? "+" : ""}
        {change.toFixed(1)}%
      </span>
    </Link>
  );
}
