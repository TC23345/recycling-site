import Link from "next/link";
import { CLUSTERS, SITE } from "@/lib/manifest";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-steel-200 bg-steel-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex items-baseline gap-2 font-display text-lg font-semibold text-navy-900 hover:text-navy-700"
        >
          <span className="inline-block h-3 w-3 rounded-sm bg-rust-500" aria-hidden />
          {SITE.shortName}
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 text-sm">
          {CLUSTERS.map((c) => (
            <Link
              key={c.slug}
              href={c.href}
              className="rounded-md px-3 py-1.5 font-medium text-steel-700 hover:bg-steel-100 hover:text-navy-900"
            >
              {c.shortTitle}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
