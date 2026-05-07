import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/news/sustainability/_intro.mdx";
import { getNewsCategory, NEWS_HUB, SITE } from "@/lib/manifest";

const category = getNewsCategory("sustainability");

export const metadata: Metadata = {
  title: category.title,
  description: category.description,
  alternates: { canonical: category.href },
  openGraph: {
    title: category.title,
    description: category.description,
    url: `${SITE.baseUrl}${category.href}`,
    type: "website",
  },
};

export default function NewsSustainabilityPage() {
  return (
    <PillarHub
      level={3}
      eyebrow="News category"
      title={category.title}
      description={category.description}
      href={category.href}
      crumbs={[
        { href: NEWS_HUB.href, label: NEWS_HUB.shortTitle },
        { href: category.href, label: category.shortTitle },
      ]}
      intro={<Intro />}
      emptyStateMessage="Articles in this category are being authored. Check back soon — or browse other news topics from the breadcrumb above."
    />
  );
}
