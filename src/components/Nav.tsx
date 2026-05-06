import Link from "next/link";
import { Suspense } from "react";
import PriceBadge from "@/components/PriceBadge";
import { guideClusters, SITE } from "@/lib/manifest";

function PriceBadgeSkeleton() {
  return (
    <span className="inline-flex h-8 w-32 animate-pulse rounded-md border border-steel-200 bg-steel-100" />
  );
}

export default function Nav() {
  const guides = guideClusters();

  return (
    <header className="sticky top-0 z-40 border-b border-steel-200 bg-steel-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-baseline gap-2 font-display text-lg font-semibold text-navy-900 hover:text-navy-700"
          >
            <span className="inline-block h-3 w-3 rounded-sm bg-rust-500" aria-hidden />
            {SITE.shortName}
          </Link>

          {/* Guides dropdown — uses native <details> for zero JS, keyboard accessible */}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-steel-700 hover:bg-steel-100 hover:text-navy-900 [&::-webkit-details-marker]:hidden">
              Guides
              <svg
                className="h-3 w-3 transition-transform group-open:rotate-180"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden
              >
                <path d="M2 4l4 4 4-4z" />
              </svg>
            </summary>
            <ul className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-card border border-steel-200 bg-white shadow-steel">
              {guides.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    className="block px-4 py-3 text-sm text-steel-700 hover:bg-steel-50 hover:text-navy-900"
                  >
                    <span className="block font-display font-semibold text-navy-900">
                      {c.shortTitle}
                    </span>
                    <span className="mt-0.5 block text-xs text-steel-500">{c.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <nav aria-label="Live prices" className="flex flex-wrap items-center gap-2">
          <Suspense fallback={<PriceBadgeSkeleton />}>
            <PriceBadge metal="aluminum" />
          </Suspense>
          <Suspense fallback={<PriceBadgeSkeleton />}>
            <PriceBadge metal="brass" />
          </Suspense>
          <Suspense fallback={<PriceBadgeSkeleton />}>
            <PriceBadge metal="steel-stainless" />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
