import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import PriceTable from "@/components/PriceTable";
import { SITE, type GuideLeaf } from "@/lib/manifest";

interface GuideLeafPageProps {
  page: GuideLeaf;
  crumbs: Crumb[];
  body: ReactNode;
}

const EYEBROW: Record<GuideLeaf["template"], string> = {
  pricing: "Pricing",
  guide: "Guide",
  vendor: "Vendor profile",
  "local-directory": "Find a yard",
  "pillar-hub": "Hub",
};

export default function GuideLeafPage({ page, crumbs, body }: GuideLeafPageProps) {
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

  const isVendor = page.template === "vendor";
  const isPricing = page.template === "pricing";
  const isLocal = page.template === "local-directory";

  return (
    <>
      <PageHero eyebrow={EYEBROW[page.template]} title={page.title} description={page.description} />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Breadcrumbs crumbs={crumbs} />

        {isVendor && (
          <p className="mt-6 rounded-card border border-steel-200 bg-steel-100 px-4 py-3 text-xs text-steel-600">
            <strong className="font-semibold text-navy-900">Note:</strong> This is an
            informational profile compiled from public sources. We are not affiliated with
            this vendor and do not endorse them. Prices, services, and locations may have
            changed since publication.
          </p>
        )}

        {isPricing && <PriceTable />}

        <article className="prose prose-steel mt-8 max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 dark:prose-invert">
          {body}
        </article>

        <RelatedLinks
          guide={page.guide}
          category={page.category}
          excludeSlug={page.slug}
          heading={isLocal ? "More local guides" : "Related guides"}
        />
      </div>
      <JsonLd data={articleJsonLd} />
    </>
  );
}
