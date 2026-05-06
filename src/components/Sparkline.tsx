interface SparklineProps {
  /** Ordered numeric points (oldest → newest). 2+ values required to draw. */
  data: number[];
  width?: number;
  height?: number;
  /** Visual tone — 'auto' colors by net direction (up = emerald, down = red). */
  tone?: "auto" | "neutral" | "up" | "down";
  className?: string;
  ariaLabel?: string;
}

const TONE_STROKE: Record<"up" | "down" | "neutral", string> = {
  up: "var(--color-emerald-600, #059669)",
  down: "var(--color-rust-600, #dc2626)",
  neutral: "var(--color-steel-500, #94a3b8)",
};

const TONE_FILL: Record<"up" | "down" | "neutral", string> = {
  up: "var(--color-emerald-100, #d1fae5)",
  down: "var(--color-rust-100, #fee2e2)",
  neutral: "var(--color-steel-100, #f1f5f9)",
};

export default function Sparkline({
  data,
  width = 80,
  height = 24,
  tone = "auto",
  className,
  ariaLabel,
}: SparklineProps) {
  if (data.length < 2) {
    return (
      <span
        aria-hidden
        className={className}
        style={{ display: "inline-block", width, height }}
      />
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid /0 for flat series

  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const direction =
    tone === "auto"
      ? data[data.length - 1] > data[0]
        ? "up"
        : data[data.length - 1] < data[0]
          ? "down"
          : "neutral"
      : tone;

  // Build a closed polygon for the area fill: line, then down to baseline.
  const areaPath =
    `M 0,${height} L ${points
      .split(" ")
      .map((p) => p.replace(",", " "))
      .join(" L ")} L ${width},${height} Z`;

  return (
    <svg
      role="img"
      aria-label={ariaLabel ?? "Price trend, last 30 days"}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="none"
    >
      <path d={areaPath} fill={TONE_FILL[direction]} opacity={0.4} />
      <polyline
        points={points}
        fill="none"
        stroke={TONE_STROKE[direction]}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
