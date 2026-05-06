import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { SITE, type ClusterSlug, type PageEntry } from "@/lib/manifest";

interface VendorPageProps {
  page: PageEntry;
  crumbs: Crumb[];
  clusterSlug: ClusterSlug;
  body: ReactNode;
}

export default function VendorPage({ page, crumbs, clusterSlug, body }: VendorPageProps) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    datePublished: page.publishedAt,
    dateModified: page.updatedAt ?? page.publishedAt,
    inLanguage: "en-US",
    url: `${SITE.baseUrl}${page.href}`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.baseUrl },
  };

  return (
    <>
      <PageHero eyebrow="Vendor profile" title={page.title} description={page.description} />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Breadcrumbs crumbs={crumbs} />
        <p className="mt-6 rounded-card border border-steel-200 bg-steel-100 px-4 py-3 text-xs text-steel-600">
          <strong className="font-semibold text-navy-900">Note:</strong> This is an informational
          profile compiled from public sources. We are not affiliated with this vendor and do not
          endorse them. Prices, services, and locations may have changed since publication.
        </p>
        <article className="prose prose-steel mt-6 max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 dark:prose-invert">
          {body}
        </article>
        <RelatedLinks clusterSlug={clusterSlug} excludeSlug={page.slug} />
      </div>
      <JsonLd data={articleJsonLd} />
    </>
  );
}
