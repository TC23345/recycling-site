"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatLastUpdated,
  formatMetalPrice,
  type Metal,
  type PriceMap,
  type PriceSnapshot,
} from "@/lib/prices";

interface LivePriceTableProps {
  initial: PriceMap;
  pollMs?: number;
}

const METAL_ORDER: Metal[] = [
  "copper",
  "aluminum",
  "brass",
  "steel-stainless",
  "steel-prepared",
  "gold",
  "silver",
];

export default function LivePriceTable({ initial, pollMs = 30_000 }: LivePriceTableProps) {
  const [prices, setPrices] = useState<PriceMap>(initial);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/prices", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as PriceMap;
        if (!cancelled) setPrices(next);
      } catch {
        /* swallow — keep last good */
      }
    };
    const id = setInterval(tick, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollMs]);

  return (
    <div
      className="my-8 overflow-hidden rounded-card border border-steel-200 bg-white shadow-steel dark:bg-steel-100"
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Mobile: stacked rows (<sm). Each metal becomes a self-contained card row. */}
      <ul className="divide-y divide-steel-200 sm:hidden" aria-label="Live metal prices">
        {METAL_ORDER.map((m) => (
          <PriceCardRow key={m} snapshot={prices[m]} />
        ))}
      </ul>

      {/* sm+: traditional table */}
      <table className="hidden w-full text-left text-sm sm:table">
        <thead className="bg-steel-100 text-xs uppercase tracking-widest text-steel-700">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Metal / Grade</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Price</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">24h</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-steel-200">
          {METAL_ORDER.map((m) => (
            <PriceRow key={m} snapshot={prices[m]} />
          ))}
        </tbody>
      </table>

      <p className="border-t border-steel-200 bg-steel-50 px-5 py-3 text-xs text-steel-500">
        Indicative pricing only — confirm rates with your local yard before transacting. Sourced
        from public futures data with typical scrap discounts applied; not a buy/sell quote.
      </p>
    </div>
  );
}

function trendColorFor(change: number): string {
  return change > 0
    ? "text-emerald-700"
    : change < 0
      ? "text-rust-700"
      : "text-steel-500";
}

function flashClassFor(direction: "up" | "down" | "flat"): string {
  return direction === "up"
    ? "animate-price-flash-up"
    : direction === "down"
      ? "animate-price-flash-down"
      : "";
}

function PriceRow({ snapshot }: { snapshot: PriceSnapshot }) {
  const direction = useChangeDirection(snapshot.usdPerLb);
  const change = snapshot.changePct;
  const trendColor = trendColorFor(change);
  const flashClass = flashClassFor(direction);
  const { value, unit } = formatMetalPrice(snapshot);

  return (
    <tr className={`transition-colors duration-300 hover:bg-steel-50 ${flashClass}`}>
      <td className="px-5 py-3 font-medium text-navy-900">{snapshot.label}</td>
      <td className="px-5 py-3 text-right font-mono tabular-nums text-navy-900">
        {value}
        <span className="ml-1 text-xs font-normal text-steel-500">{unit}</span>
      </td>
      <td className={`px-5 py-3 text-right font-mono tabular-nums ${trendColor}`}>
        {change > 0 ? "+" : ""}
        {change.toFixed(2)}%
      </td>
      <td className="px-5 py-3 text-right font-mono text-xs tabular-nums text-steel-500">
        {formatLastUpdated(snapshot.asOf)}
      </td>
    </tr>
  );
}

/**
 * Mobile-only stacked layout: a two-column grid per metal so the price and 24h
 * change line up vertically across rows; the "Last Updated" timestamp sits
 * underneath as secondary info — visible at all times (no hover dependency).
 */
function PriceCardRow({ snapshot }: { snapshot: PriceSnapshot }) {
  const direction = useChangeDirection(snapshot.usdPerLb);
  const change = snapshot.changePct;
  const trendColor = trendColorFor(change);
  const flashClass = flashClassFor(direction);
  const { value, unit } = formatMetalPrice(snapshot);

  return (
    <li className={`block px-5 py-4 transition-colors duration-300 ${flashClass}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-medium text-navy-900">{snapshot.label}</p>
        <p className="font-mono tabular-nums text-navy-900">
          {value}
          <span className="ml-1 text-xs text-steel-500">{unit}</span>
        </p>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-3 text-xs">
        <p className="font-mono tabular-nums text-steel-500">
          Updated {formatLastUpdated(snapshot.asOf)}
        </p>
        <p className={`font-mono tabular-nums ${trendColor}`}>
          {change > 0 ? "+" : ""}
          {change.toFixed(2)}%
        </p>
      </div>
    </li>
  );
}

function useChangeDirection(value: number): "up" | "down" | "flat" {
  const [direction, setDirection] = useState<"up" | "down" | "flat">("flat");
  const prevRef = useRef<number>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevRef.current === value) return;
    const dir: "up" | "down" = value > prevRef.current ? "up" : "down";
    prevRef.current = value;
    setDirection(dir);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDirection("flat"), 1200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  return direction;
}
