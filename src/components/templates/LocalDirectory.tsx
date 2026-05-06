import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { SITE, type ClusterSlug, type PageEntry } from "@/lib/manifest";

interface LocalDirectoryProps {
  page: PageEntry;
  crumbs: Crumb[];
  clusterSlug: ClusterSlug;
  body: ReactNode;
}

export default function LocalDirectory({ page, crumbs, clusterSlug, body }: LocalDirectoryProps) {
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
      <PageHero eyebrow="Find a yard" title={page.title} description={page.description} />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Breadcrumbs crumbs={crumbs} />
        <article className="prose prose-steel mt-8 max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 hover:prose-a:underline focus-visible:prose-a:outline-2 focus-visible:prose-a:outline-offset-2 focus-visible:prose-a:outline-rust-500 dark:prose-invert">
          {body}
        </article>
        <RelatedLinks clusterSlug={clusterSlug} excludeSlug={page.slug} heading="More local guides" />
      </div>
      <JsonLd data={articleJsonLd} />
    </>
  );
}
