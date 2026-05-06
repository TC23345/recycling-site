import Link from "next/link";
import { CLUSTERS, SITE } from "@/lib/manifest";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-steel-200 bg-steel-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-base font-semibold text-navy-900">{SITE.name}</h3>
          <p className="mt-2 text-sm text-steel-600">{SITE.description}</p>
        </div>
        {CLUSTERS.map((c) => (
          <div key={c.slug}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
              <Link href={c.href} className="hover:text-rust-700">
                {c.shortTitle}
              </Link>
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-steel-600">{c.description}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-steel-200 px-6 py-5 text-center text-xs text-steel-500">
        © {new Date().getFullYear()} {SITE.name}. Pricing is indicative — not a buy or sell quote.
      </div>
    </footer>
  );
}
