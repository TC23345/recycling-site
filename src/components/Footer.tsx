import Link from "next/link";
import { guideClusters, pricingClusters, SITE } from "@/lib/manifest";

export default function Footer() {
  const guides = guideClusters();
  const pricing = pricingClusters();

  return (
    <footer className="mt-20 border-t border-steel-200 bg-steel-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-base font-semibold text-navy-900">{SITE.name}</h3>
          <p className="mt-2 text-sm text-steel-600">{SITE.description}</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
            Live prices
          </h4>
          <ul className="mt-2 space-y-1.5 text-sm">
            {pricing.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className="text-steel-600 hover:text-rust-700">
                  {c.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
            Guides
          </h4>
          <ul className="mt-2 space-y-1.5 text-sm">
            {guides.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className="text-steel-600 hover:text-rust-700">
                  {c.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
            About
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-steel-600">
            Pricing is indicative — sourced from public futures data with typical scrap
            discounts applied. Not a buy or sell quote.
          </p>
        </div>
      </div>
      <div className="border-t border-steel-200 px-6 py-5 text-center text-xs text-steel-500">
        © {new Date().getFullYear()} {SITE.name}. Confirm rates with your local yard before
        transacting.
      </div>
    </footer>
  );
}
