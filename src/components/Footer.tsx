import Link from "next/link";
import {
  guidesAll,
  NEWS_HUB,
  newsCategoriesAll,
  pricingClusters,
  SITE,
} from "@/lib/manifest";

export default function Footer() {
  const guides = guidesAll();
  const pricing = pricingClusters();
  const news = newsCategoriesAll();

  const linkClass =
    "inline-block py-1 text-steel-600 transition-colors hover:text-rust-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500";

  return (
    <footer className="mt-20 border-t border-steel-200 bg-steel-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <h3 className="font-display text-base font-semibold text-navy-900">{SITE.name}</h3>
          <p className="mt-2 text-sm text-steel-600">{SITE.description}</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
            Live prices
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            {pricing.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className={linkClass}>
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
          <ul className="mt-2 space-y-1 text-sm">
            {guides.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className={linkClass}>
                  {c.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
            <Link href={NEWS_HUB.href} className="text-navy-900 hover:text-rust-700">
              {NEWS_HUB.title}
            </Link>
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            {news.map((n) => (
              <li key={n.slug}>
                <Link href={n.href} className={linkClass}>
                  {n.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
            Site
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/about" className={linkClass}>
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={linkClass}>
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-6 text-sm leading-relaxed text-steel-600">
        Pricing is indicative — sourced from public futures data with typical scrap discounts
        applied. Not a buy or sell quote.
      </div>

      <div className="border-t border-steel-200 px-6 py-5 text-center text-xs text-steel-500">
        © {new Date().getFullYear()} {SITE.name}. Confirm rates with your local yard before
        transacting.
      </div>
    </footer>
  );
}
