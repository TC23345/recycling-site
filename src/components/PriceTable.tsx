import LivePriceTable from "@/components/LivePriceTable";
import { fetchLivePrices } from "@/lib/prices";

export default async function PriceTable() {
  const initial = await fetchLivePrices();
  return <LivePriceTable initial={initial} />;
}
