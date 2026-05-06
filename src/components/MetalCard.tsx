import Link from "next/link";
import {
  fetchLivePrices,
  fetchTimeseries,
  formatMetalPrice,
  metalShortLabel,
} from "@/lib/prices";
import type { Metal } from "@/lib/prices";
import { pricingClusters } from "@/lib/manifest";
import Sparkline from "@/components/Sparkline";

// Pull a per-metal numeric series out of the timeseries response, dropping
// null gaps. Returns undefined when the metal isn't in the response (e.g.
// stainless / prepared steel).
function seriesFor(
  data: Awaited<ReturnType<typeof fetchTimeseries>>,
  metal: Metal,
): number[] | undefined {
  if (!data) return undefined;
  if (
    metal === "copper" ||
    metal === "aluminum" ||
    metal === "brass" ||
    metal === "gold" ||
    metal === "silver"
  ) {
    const values = data
      .map((p) => p[metal])
      .filter((n): n is number => typeof n === "number");
    return values.length >= 2 ? values : undefined;
  }
  return undefined;
}

export default async function MetalCardsGrid() {
  const [all, timeseries] = await Promise.all([
    fetchLivePrices(),
    fetchTimeseries(30),
  ]);
  const clusters = pricingClusters();

  return (
    <div className="relative">
      {/* Horizontal-scroll carousel: cards live in a scrollable flex row with
          CSS scroll-snapping. Each card is `shrink-0` with a fixed min-width so
          they don't collapse to fit the viewport — overflow scrolls instead. */}
      <ul
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-steel-300 [&::-webkit-scrollbar-track]:bg-transparent"
        aria-label="Live metal price cards"
      >
        {clusters.map((c) => {
          if (!c.metal) return null;
          const snapshot = all[c.metal];
          const change = snapshot.changePct;
          const trendColor =
            change > 0 ? "text-emerald-700" : change < 0 ? "text-rust-700" : "text-steel-500";
          return (
            <li
              key={c.slug}
              className="w-[18rem] shrink-0 snap-start sm:w-[20rem]"
            >
              <Link
                href={c.href}
                className="block h-full rounded-card border border-steel-200 bg-white p-5 shadow-steel transition-[colors,box-shadow] duration-200 hover:border-rust-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
              >
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-rust-600">
                {metalShortLabel(c.metal)}
              </p>
              {(() => {
                const { value, unit } = formatMetalPrice(snapshot);
                return (
                  <p className="mt-2 font-display text-3xl font-bold tabular-nums text-navy-900">
                    {value}
                    <span className="ml-1 text-xs font-normal text-steel-500">{unit}</span>
                  </p>
                );
              })()}
              <p className={`mt-1 font-mono text-xs tabular-nums ${trendColor}`}>
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%{" "}
                <span className="text-steel-400">· {snapshot.source}</span>
              </p>
              {(() => {
                const series = seriesFor(timeseries, c.metal);
                return series ? (
                  <Sparkline
                    data={series}
                    className="mt-3 block w-full"
                    width={220}
                    height={32}
                    ariaLabel={`${metalShortLabel(c.metal)} price, last 30 days`}
                  />
                ) : null;
              })()}
              <p className="mt-3 text-sm leading-relaxed text-steel-600">{c.description}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rust-600">
                Open price page →
              </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-1 text-xs text-steel-500 sm:hidden" aria-hidden>
        Swipe →
      </p>
    </div>
  );
}
