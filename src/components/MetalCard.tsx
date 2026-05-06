import Link from "next/link";
import { fetchLivePrices, formatUsd, metalShortLabel } from "@/lib/prices";
import { pricingClusters } from "@/lib/manifest";

export default async function MetalCardsGrid() {
  const all = await fetchLivePrices();
  const clusters = pricingClusters();

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {clusters.map((c) => {
        if (!c.metal) return null;
        const snapshot = all[c.metal];
        const change = snapshot.changePct;
        const trendColor =
          change > 0 ? "text-emerald-700" : change < 0 ? "text-rust-700" : "text-steel-500";
        return (
          <li key={c.slug}>
            <Link
              href={c.href}
              className="block h-full rounded-card border border-steel-200 bg-white p-5 shadow-steel transition hover:border-rust-300 hover:shadow-md"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-rust-600">
                {metalShortLabel(c.metal)}
              </p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums text-navy-900">
                {formatUsd(snapshot.usdPerLb)}
                <span className="ml-1 text-xs font-normal text-steel-500">/ lb</span>
              </p>
              <p className={`mt-1 font-mono text-xs tabular-nums ${trendColor}`}>
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%{" "}
                <span className="text-steel-400">· {snapshot.source}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-steel-600">{c.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rust-600">
                Open price page →
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
