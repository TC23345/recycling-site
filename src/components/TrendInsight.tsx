import type { TimeseriesArray } from "@/lib/prices";
import { computeTrend } from "@/lib/prices";

interface TrendInsightProps {
  data: TimeseriesArray;
  metal: "copper" | "aluminum" | "brass";
  metalLabel: string;
  className?: string;
}

/**
 * Editorial trend bar — sits above the live price on pillar pages. Generates
 * a single human-readable sentence + a small headline phrase from a 30-day
 * timeseries window. Returns null if insufficient data.
 *
 * Examples of generated text:
 *   "Copper is +5.4% this week and near a 30-day high."
 *   "Aluminum is -2.1% this month, sitting just above the 30-day low."
 *   "Brass has held flat — within 1% of last week."
 */
export default function TrendInsight({
  data,
  metal,
  metalLabel,
  className,
}: TrendInsightProps) {
  const stats = computeTrend(data, metal);
  if (!stats) return null;

  const { weekChangePct, monthChangePct, nearHigh, nearLow, current } = stats;
  const fmtPct = (n: number) =>
    `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

  // Pick the dominant time window: prefer week if movement is meaningful,
  // fall back to month otherwise.
  const dominantWindow =
    Math.abs(weekChangePct) >= 1 ? "week" : "month";
  const dominantPct =
    dominantWindow === "week" ? weekChangePct : monthChangePct;

  // Compose the headline phrase
  let headline: string;
  if (Math.abs(dominantPct) < 0.5) {
    headline = `${metalLabel} has held flat`;
  } else if (dominantPct > 0) {
    headline = `${metalLabel} is up ${fmtPct(dominantPct)} this ${dominantWindow}`;
  } else {
    headline = `${metalLabel} is down ${fmtPct(dominantPct)} this ${dominantWindow}`;
  }

  // Composer for the trailing context
  let context = "";
  if (nearHigh) {
    context =
      dominantPct > 0
        ? ", near a 30-day high"
        : ", but still near a 30-day high";
  } else if (nearLow) {
    context =
      dominantPct < 0
        ? ", sitting at a 30-day low"
        : ", but still near a 30-day low";
  }

  // Tone color matches direction
  const direction =
    Math.abs(dominantPct) < 0.5
      ? "neutral"
      : dominantPct > 0
        ? "up"
        : "down";

  const accentClass =
    direction === "up"
      ? "text-emerald-700 dark:text-emerald-500"
      : direction === "down"
        ? "text-rust-700 dark:text-rust-500"
        : "text-steel-700";

  return (
    <aside
      className={`rounded-card border border-steel-200 bg-steel-50 px-4 py-3 dark:bg-steel-100 ${className ?? ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-steel-500">
        Trend
      </p>
      <p className="mt-1 text-sm leading-snug text-steel-700">
        <span className={`font-semibold ${accentClass}`}>{headline}</span>
        {context}. Currently <span className="font-semibold">${current.toFixed(current >= 1 ? 2 : 3)}/lb</span> at
        the yard.
      </p>
    </aside>
  );
}
