import { fetchLivePrices, formatUsd, type Metal } from "@/lib/prices";
import LivePriceTickerClient from "@/components/LivePriceTicker";

interface PriceTickerProps {
  metal: Metal;
}

export default async function PriceTicker({ metal }: PriceTickerProps) {
  const all = await fetchLivePrices();
  const snapshot = all[metal];
  return <LivePriceTickerClient initial={snapshot} metal={metal} />;
}

export { formatUsd };
