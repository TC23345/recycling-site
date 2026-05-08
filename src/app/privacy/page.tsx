import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import PrivacyBody from "@/content/static/privacy.mdx";
import { SITE } from "@/lib/manifest";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How Whats My Scrap Worth? handles information when you visit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.baseUrl}/privacy`,
    type: "website",
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE.baseUrl}/privacy`,
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.baseUrl },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title={TITLE}
        description={DESCRIPTION}
      />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <Breadcrumbs crumbs={[{ href: "/privacy", label: "Privacy" }]} />
        <article className="prose prose-steel mt-8 max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 prose-a:no-underline hover:prose-a:underline dark:prose-invert">
          <PrivacyBody />
        </article>
      </div>

      <JsonLd data={privacyJsonLd} />
    </>
  );
}
