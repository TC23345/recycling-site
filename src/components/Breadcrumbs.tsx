import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/manifest";

export interface Crumb {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const allCrumbs: Crumb[] = [{ href: "/", label: "Home" }, ...crumbs];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE.baseUrl}${c.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-steel-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          {allCrumbs.map((c, i) => {
            const isLast = i === allCrumbs.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="text-navy-900">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="hover:text-rust-700">
                    {c.label}
                  </Link>
                )}
                {!isLast && <span aria-hidden className="text-steel-300">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={itemListJsonLd} />
    </>
  );
}
