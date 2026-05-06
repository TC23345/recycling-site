"use client";

import { useEffect, useRef, useState } from "react";
import { formatUsd, type Metal, type PriceMap, type PriceSnapshot } from "@/lib/prices";

interface LivePriceTickerClientProps {
  initial: PriceSnapshot;
  metal: Metal;
  pollMs?: number;
}

export default function LivePriceTickerClient({
  initial,
  metal,
  pollMs = 30_000,
}: LivePriceTickerClientProps) {
  const [snapshot, setSnapshot] = useState<PriceSnapshot>(initial);
  const [direction, setDirection] = useState<"up" | "down" | "flat">("flat");
  const prevPriceRef = useRef<number>(initial.usdPerLb);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/prices", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as PriceMap;
        if (!cancelled) setSnapshot(next[metal]);
      } catch {
        /* keep last good */
      }
    };
    const id = setInterval(tick, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [metal, pollMs]);

  useEffect(() => {
    if (snapshot.usdPerLb === prevPriceRef.current) return;
    const dir: "up" | "down" =
      snapshot.usdPerLb > prevPriceRef.current ? "up" : "down";
    prevPriceRef.current = snapshot.usdPerLb;
    setDirection(dir);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDirection("flat"), 1200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [snapshot.usdPerLb]);

  const change = snapshot.changePct;
  const trendColor =
    change > 0 ? "text-emerald-700" : change < 0 ? "text-rust-700" : "text-steel-500";
  const flashClass =
    direction === "up"
      ? "animate-price-flash-up"
      : direction === "down"
        ? "animate-price-flash-down"
        : "";

  return (
    <div
      className={`my-6 flex items-baseline justify-between gap-4 rounded-card border border-steel-200 bg-white p-5 shadow-steel transition-colors duration-300 ${flashClass}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-rust-600">
          {snapshot.label}
        </p>
        <p className="mt-1 font-display text-3xl font-bold tabular-nums text-navy-900">
          {formatUsd(snapshot.usdPerLb)}
          <span className="ml-1 text-sm font-normal text-steel-500">/ lb</span>
        </p>
      </div>
      <div className="text-right">
        <p className={`font-mono text-sm tabular-nums ${trendColor}`}>
          {change > 0 ? "+" : ""}
          {change.toFixed(2)}%
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-steel-500">{snapshot.source}</p>
      </div>
    </div>
  );
}
