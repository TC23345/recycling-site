import Link from "next/link";
import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import {
  CLUSTERS,
  leavesByCluster,
  SITE,
  type CategoryDefinition,
  type ClusterDefinition,
  type ClusterSlug,
  type GuideDefinition,
  type GuideLeaf,
  type PageEntry,
} from "@/lib/manifest";

interface PillarHubProps {
  level: 1 | 2 | 3;
  title: string;
  description: string;
  eyebrow?: string;
  href: string;
  /** Pricing-cluster L2 hub: pulls leaves from `LEAVES` via `leavesByCluster`. */
  clusterSlug?: ClusterSlug;
  /** Cards to render under "Topics". For L1 home this is auto-populated with all clusters. */
  childClusters?: ClusterDefinition[];
  /** Guide-hub child cards (categories). */
  childCategories?: CategoryDefinition[];
  /** Guide-hub child cards (guides) — used by L1 if/when invoked. */
  childGuides?: GuideDefinition[];
  /** Category-hub child cards (guide leaves). */
  childGuideLeaves?: GuideLeaf[];
  intro: ReactNode;
  crumbs?: Crumb[];
}

export default function PillarHub({
  level,
  title,
  description,
  eyebrow,
  href,
  clusterSlug,
  childClusters,
  childCategories,
  childGuides,
  childGuideLeaves,
  intro,
  crumbs,
}: PillarHubProps) {
  const childPages: PageEntry[] = clusterSlug ? leavesByCluster(clusterSlug) : [];
  const clusterCards: ClusterDefinition[] =
    childClusters ?? (level === 1 ? CLUSTERS : []);
  const categoryCards: CategoryDefinition[] = childCategories ?? [];
  const guideCards: GuideDefinition[] = childGuides ?? [];
  const guideLeafCards: GuideLeaf[] = childGuideLeaves ?? [];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    headline: title,
    description,
    url: `${SITE.baseUrl}${href}`,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.baseUrl },
  };

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-5xl px-6 py-10">
        {crumbs && crumbs.length > 0 && (
          <div className="mb-8">
            <Breadcrumbs crumbs={crumbs} />
          </div>
        )}

        <article className="prose prose-steel max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 prose-a:no-underline hover:prose-a:underline dark:prose-invert">
          {intro}
        </article>

        {guideCards.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Guides</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {guideCards.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={g.href}
                    className="block h-full rounded-card border border-steel-200 bg-white p-6 shadow-steel transition-[colors,box-shadow] duration-200 hover:border-rust-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
                  >
                    <p className="font-display text-lg font-semibold text-navy-900">{g.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-steel-600">{g.description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rust-600">
                      Explore →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {clusterCards.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Topics</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {clusterCards.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    className="block h-full rounded-card border border-steel-200 bg-white p-6 shadow-steel transition-[colors,box-shadow] duration-200 hover:border-rust-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
                  >
                    <p className="font-display text-lg font-semibold text-navy-900">{c.title}</p>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-steel-600">{c.description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rust-600">
                      Explore →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {categoryCards.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Categories</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {categoryCards.map((c) => (
                <li key={`${c.guide}-${c.slug}`}>
                  <Link
                    href={c.href}
                    className="block h-full rounded-card border border-steel-200 bg-white p-6 shadow-steel transition-[colors,box-shadow] duration-200 hover:border-rust-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
                  >
                    <p className="font-display text-lg font-semibold text-navy-900">{c.title}</p>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-steel-600">{c.description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rust-600">
                      Explore →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {childPages.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-navy-900">In this cluster</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {childPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.href}
                    className="block h-full rounded-card border border-steel-200 bg-white p-5 shadow-steel transition-[colors,box-shadow] duration-200 hover:border-rust-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
                  >
                    <p className="font-display text-base font-semibold text-navy-900">{p.title}</p>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-steel-600">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {guideLeafCards.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-navy-900">In this category</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {guideLeafCards.map((p) => (
                <li key={`${p.guide}-${p.category}-${p.slug}`}>
                  <Link
                    href={p.href}
                    className="block h-full rounded-card border border-steel-200 bg-white p-5 shadow-steel transition-[colors,box-shadow] duration-200 hover:border-rust-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
                  >
                    <p className="font-display text-base font-semibold text-navy-900">{p.title}</p>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-steel-600">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <JsonLd data={articleJsonLd} />
    </>
  );
}
