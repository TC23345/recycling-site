import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import PriceTable from "@/components/PriceTable";
import MetalCardsGrid from "@/components/MetalCard";
import JsonLd from "@/components/JsonLd";
import HomeIntro from "@/content/pillars/home.mdx";
import { guidesAll, HOME, SITE } from "@/lib/manifest";

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
  const guides = guidesAll();

  return (
    <>
      <PageHero
        eyebrow="Live pricing & guides"
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
          <Suspense
            fallback={
              <div
                className="my-8 h-72 animate-pulse rounded-card border border-steel-200 bg-steel-100 sm:h-64"
                aria-hidden
              />
            }
          >
            <PriceTable />
          </Suspense>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-navy-900">
            Metal price pages
          </h2>
          <p className="mt-2 max-w-2xl text-pretty text-steel-600">
            Dedicated live-price hubs for each metal, with grade ladders, market context, and
            seller tips.
          </p>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-4" aria-hidden>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-56 w-[18rem] shrink-0 animate-pulse rounded-card border border-steel-200 bg-steel-100 sm:w-[20rem]"
                    />
                  ))}
                </div>
              }
            >
              <MetalCardsGrid />
            </Suspense>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-navy-900">
            Guides & directories
          </h2>
          <p className="mt-2 max-w-2xl text-pretty text-steel-600">
            Long-form reference: how scrap is graded, where to find a yard, how the recycling
            chain actually works.
          </p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((c) => (
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
      </div>

      <JsonLd data={homeJsonLd} />
    </>
  );
}
