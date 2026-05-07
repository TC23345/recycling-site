import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import { guidesAll, NEWS_HUB, newsCategoriesAll, SITE } from "@/lib/manifest";

export default function Nav() {
  const guides = guidesAll();
  const news = newsCategoriesAll();

  return (
    <header className="sticky top-0 z-40 border-b border-steel-200 bg-steel-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 md:gap-6">
          <MobileMenu guides={guides} news={news} />

          <Link
            href="/"
            className="flex shrink-0 items-baseline gap-2 whitespace-nowrap rounded-md font-display text-lg font-semibold text-navy-900 hover:text-navy-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500"
          >
            <span className="inline-block h-3 w-3 rounded-sm bg-rust-500" aria-hidden />
            {SITE.shortName}
          </Link>

          {/* Desktop-only: Guides dropdown, News dropdown, About link */}
          <details className="group relative hidden md:block">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-steel-700 hover:bg-steel-100 hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 [&::-webkit-details-marker]:hidden">
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
            <ul className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-card border border-steel-200 bg-white shadow-steel dark:bg-steel-100">
              {guides.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    className="block px-4 py-3 text-sm text-steel-700 hover:bg-steel-50 hover:text-navy-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rust-500"
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

          <details className="group relative hidden md:block">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-steel-700 hover:bg-steel-100 hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 [&::-webkit-details-marker]:hidden">
              News
              <svg
                className="h-3 w-3 transition-transform group-open:rotate-180"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden
              >
                <path d="M2 4l4 4 4-4z" />
              </svg>
            </summary>
            <ul className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-card border border-steel-200 bg-white shadow-steel dark:bg-steel-100">
              <li>
                <Link
                  href={NEWS_HUB.href}
                  className="block border-b border-steel-200 bg-steel-50 px-4 py-3 text-sm text-steel-700 hover:bg-steel-100 hover:text-navy-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100 dark:hover:bg-steel-200"
                >
                  <span className="block font-display font-semibold text-navy-900">
                    All news
                  </span>
                  <span className="mt-0.5 block text-xs text-steel-500">{NEWS_HUB.description}</span>
                </Link>
              </li>
              {news.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    className="block px-4 py-3 text-sm text-steel-700 hover:bg-steel-50 hover:text-navy-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rust-500"
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

          <Link
            href="/about"
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-steel-700 transition hover:bg-steel-100 hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 md:inline-flex"
          >
            About
          </Link>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
