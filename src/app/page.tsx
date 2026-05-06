import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import PriceTable from "@/components/PriceTable";
import MetalCardsGrid from "@/components/MetalCard";
import JsonLd from "@/components/JsonLd";
import HomeIntro from "@/content/pillars/home.mdx";
import { guideClusters, HOME, SITE } from "@/lib/manifest";

export const metadata: Metadata = {
  title: { absolute: HOME.title },
  description: HOME.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME.title,
    description: HOME.description,
    url: SITE.baseUrl,
    type: "website",
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  headline: HOME.title,
  description: HOME.description,
  url: `${SITE.baseUrl}${HOME.href}`,
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.baseUrl },
};

export default function HomePage() {
  const guides = guideClusters();

  return (
    <>
      <PageHero
        eyebrow="Authority site"
        title={HOME.title}
        description={HOME.description}
      />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <article className="prose prose-steel max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 prose-a:no-underline hover:prose-a:underline dark:prose-invert">
          <HomeIntro />
        </article>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-navy-900">
              Live Metal Prices
            </h2>
            <p className="text-xs uppercase tracking-widest text-steel-500">
              Refreshes every 60 s
            </p>
          </div>
          <Suspense fallback={<div className="my-8 h-48 animate-pulse rounded-card bg-steel-100" />}>
            <PriceTable />
          </Suspense>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-navy-900">
            Metal price pages
          </h2>
          <p className="mt-2 max-w-2xl text-steel-600">
            Dedicated live-price hubs for each metal, with grade ladders, market context, and
            seller tips.
          </p>
          <div className="mt-6">
            <Suspense fallback={<div className="h-40 animate-pulse rounded-card bg-steel-100" />}>
              <MetalCardsGrid />
            </Suspense>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-navy-900">
            Guides & directories
          </h2>
          <p className="mt-2 max-w-2xl text-steel-600">
            Long-form reference: how scrap is graded, where to find a yard, how the recycling
            chain actually works.
          </p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-3">
            {guides.map((c) => (
              <li key={c.slug}>
                <Link
                  href={c.href}
                  className="block h-full rounded-card border border-steel-200 bg-white p-6 shadow-steel transition hover:border-rust-300 hover:shadow-md dark:bg-steel-100"
                >
                  <p className="font-display text-lg font-semibold text-navy-900">{c.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-steel-600">{c.description}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rust-600">
                    Explore →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd data={homeJsonLd} />
    </>
  );
}
