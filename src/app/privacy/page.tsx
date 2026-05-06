import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import PrivacyBody from "@/content/static/privacy.mdx";
import { SITE } from "@/lib/manifest";

const TITLE = "Privacy policy";
const DESCRIPTION =
  "What this site collects, what it doesn't, and how third-party services like Vercel and Yahoo Finance fit in.";

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
        <article className="prose prose-steel max-w-none prose-headings:font-display prose-headings:text-navy-900 prose-a:text-rust-700 prose-a:no-underline hover:prose-a:underline dark:prose-invert">
          <PrivacyBody />
        </article>
      </div>

      <JsonLd data={privacyJsonLd} />
    </>
  );
}
