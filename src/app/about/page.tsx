import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import AboutBody from "@/content/static/about.mdx";
import { SITE } from "@/lib/manifest";

const TITLE = "About Whats My Scrap Worth?";
const DESCRIPTION =
  "A community resource for live scrap metal pricing, recycling guides, and clear answers about what your metal is actually worth — for households, scrappers, contractors, yard operators, and anyone in between.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.baseUrl}/about`,
    type: "website",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE.baseUrl}/about`,
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.baseUrl },
  mainEntity: {
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.baseUrl,
    description: SITE.description,
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={TITLE}
        description={DESCRIPTION}
      />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <Breadcrumbs crumbs={[{ href: "/about", label: "About" }]} />
        <article className="prose prose-steel mt-8 max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 prose-a:no-underline hover:prose-a:underline dark:prose-invert">
          <AboutBody />
        </article>
      </div>

      <JsonLd data={aboutJsonLd} />
    </>
  );
}
