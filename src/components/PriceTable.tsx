import { getAllPrices, formatUsd } from "@/lib/prices";

export default function PriceTable() {
  const prices = getAllPrices();

  return (
    <div className="my-8 overflow-hidden rounded-card border border-steel-200 bg-white shadow-steel">
      <table className="w-full text-left text-sm">
        <thead className="bg-steel-100 text-xs uppercase tracking-widest text-steel-700">
          <tr>
            <th className="px-5 py-3 font-semibold">Metal / Grade</th>
            <th className="px-5 py-3 text-right font-semibold">USD / lb</th>
            <th className="px-5 py-3 text-right font-semibold">24h</th>
            <th className="px-5 py-3 text-right font-semibold">As of</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-steel-200">
          {prices.map((p) => {
            const change = p.changePct ?? 0;
            const trendColor =
              change > 0 ? "text-emerald-700" : change < 0 ? "text-rust-700" : "text-steel-500";
            return (
              <tr key={p.metal} className="hover:bg-steel-50">
                <td className="px-5 py-3 font-medium text-navy-900">{p.label}</td>
                <td className="px-5 py-3 text-right font-mono text-navy-900">
                  {formatUsd(p.usdPerLb)}
                </td>
                <td className={`px-5 py-3 text-right font-mono ${trendColor}`}>
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </td>
                <td className="px-5 py-3 text-right text-xs text-steel-500">{p.asOf}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-steel-200 bg-steel-50 px-5 py-3 text-xs text-steel-500">
        Indicative pricing only — confirm rates with your local yard before transacting.
      </p>
    </div>
  );
}
