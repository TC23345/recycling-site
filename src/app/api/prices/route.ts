import { fetchLivePrices } from "@/lib/prices";

export const revalidate = 60;

export async function GET() {
  const prices = await fetchLivePrices();
  return Response.json(prices, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
