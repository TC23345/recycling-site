import PriceChart from "@/components/PriceChart";
import TrendInsight from "@/components/TrendInsight";
import { fetchTimeseries } from "@/lib/prices";

interface PricingHeaderExtrasProps {
  /** Which series to render. Brass is supported (derived from copper). */
  metal: "copper" | "aluminum" | "brass";
  metalLabel: string;
}

/**
 * Server-component slot that mounts at the top of each pricing pillar page.
 * Fetches the 30-day timeseries once and renders both the trend-insight bar
 * and the 30-day chart from the same payload — no marginal API call between
 * the two surfaces.
 *
 * Returns null when the timeseries is unavailable (no API key, quota, etc.)
 * so the pillar page falls back to its existing live-only layout.
 */
export default async function PricingHeaderExtras({
  metal,
  metalLabel,
}: PricingHeaderExtrasProps) {
  const data = await fetchTimeseries(30);
  if (!data) return null;

  return (
    <>
      <TrendInsight data={data} metal={metal} metalLabel={metalLabel} />
      <PriceChart data={data} metal={metal} metalLabel={metalLabel} />
    </>
  );
}
