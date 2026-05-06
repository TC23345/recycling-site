import { formatUsd } from "@/lib/prices";
import type { TimeseriesArray } from "@/lib/prices";

interface PriceChartProps {
  data: TimeseriesArray;
  metal: "copper" | "aluminum" | "brass";
  metalLabel: string;
  /** Visual height in px — width is fluid via viewBox. */
  height?: number;
  className?: string;
}

/**
 * 30-day historical price chart. Pure SVG — no client-side deps. Renders the
 * scrap-discounted USD/lb series with axis labels, gridlines, and a min/max
 * marker. Returns null if there's nothing to chart.
 */
export default function PriceChart({
  data,
  metal,
  metalLabel,
  height = 200,
  className,
}: PriceChartProps) {
  const series = data
    .map((p) => ({ date: p.date, value: p[metal] }))
    .filter(
      (p): p is { date: string; value: number } => typeof p.value === "number",
    );

  if (series.length < 2) return null;

  const VIEW_W = 800;
  const VIEW_H = height;
  const PAD_L = 56;
  const PAD_R = 16;
  const PAD_T = 12;
  const PAD_B = 28;
  const innerW = VIEW_W - PAD_L - PAD_R;
  const innerH = VIEW_H - PAD_T - PAD_B;

  const values = series.map((p) => p.value);
  const minRaw = Math.min(...values);
  const maxRaw = Math.max(...values);
  const padRange = (maxRaw - minRaw) * 0.1 || maxRaw * 0.05 || 0.01;
  const min = minRaw - padRange;
  const max = maxRaw + padRange;
  const range = max - min;

  const stepX = innerW / (series.length - 1);

  const points = series
    .map((p, i) => {
      const x = PAD_L + i * stepX;
      const y = PAD_T + innerH - ((p.value - min) / range) * innerH;
      return { x, y, date: p.date, value: p.value };
    });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(
    1,
  )} ${(PAD_T + innerH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(
    PAD_T + innerH
  ).toFixed(1)} Z`;

  // Y-axis ticks: 4 evenly spaced
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const v = min + (range * i) / tickCount;
    const y = PAD_T + innerH - (i / tickCount) * innerH;
    return { v, y };
  });

  // X-axis labels: first, middle, last
  const xLabelIdxs = [
    0,
    Math.floor(series.length / 2),
    series.length - 1,
  ];

  // Min / max markers
  const maxIdx = values.indexOf(maxRaw);
  const minIdx = values.indexOf(minRaw);

  const direction =
    series[series.length - 1].value > series[0].value ? "up" : "down";
  const stroke =
    direction === "up"
      ? "var(--color-emerald-600, #059669)"
      : "var(--color-rust-600, #dc2626)";
  const fill =
    direction === "up"
      ? "var(--color-emerald-100, #d1fae5)"
      : "var(--color-rust-100, #fee2e2)";

  const formatTick = (v: number) =>
    v >= 1 ? formatUsd(v, 2) : `$${v.toFixed(3)}`;

  return (
    <figure className={className}>
      <svg
        role="img"
        aria-label={`${metalLabel} price, last 30 days`}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="h-auto w-full"
      >
        {/* Gridlines + Y axis labels */}
        {yTicks.map((t, i) => (
          <g key={`y-${i}`}>
            <line
              x1={PAD_L}
              x2={VIEW_W - PAD_R}
              y1={t.y}
              y2={t.y}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeDasharray="2 4"
            />
            <text
              x={PAD_L - 6}
              y={t.y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={11}
              fill="currentColor"
              opacity={0.6}
            >
              {formatTick(t.v)}
            </text>
          </g>
        ))}

        {/* Area + line */}
        <path d={areaPath} fill={fill} opacity={0.4} />
        <path
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth={1.75}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Min / max marker dots */}
        <circle
          cx={points[maxIdx].x}
          cy={points[maxIdx].y}
          r={3.5}
          fill={stroke}
        />
        <circle
          cx={points[minIdx].x}
          cy={points[minIdx].y}
          r={3.5}
          fill={stroke}
          opacity={0.5}
        />

        {/* X axis labels */}
        {xLabelIdxs.map((idx) => (
          <text
            key={`x-${idx}`}
            x={points[idx].x}
            y={VIEW_H - 8}
            textAnchor={
              idx === 0 ? "start" : idx === series.length - 1 ? "end" : "middle"
            }
            fontSize={11}
            fill="currentColor"
            opacity={0.6}
          >
            {points[idx].date.slice(5)}
          </text>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs text-steel-500">
        {metalLabel} — last {series.length} days, scrap-discounted USD/lb.
        Sourced from Metals.dev (industrial metals on paid plans) with Yahoo
        Finance as fallback.
      </figcaption>
    </figure>
  );
}
