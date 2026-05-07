import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/news/_intro.mdx";
import { NEWS_HUB, newsCategoriesAll, SITE } from "@/lib/manifest";

export const metadata: Metadata = {
  title: NEWS_HUB.title,
  description: NEWS_HUB.description,
  alternates: { canonical: NEWS_HUB.href },
  openGraph: {
    title: NEWS_HUB.title,
    description: NEWS_HUB.description,
    url: `${SITE.baseUrl}${NEWS_HUB.href}`,
    type: "website",
  },
};

export default function NewsHubPage() {
  return (
    <PillarHub
      level={2}
      eyebrow="News hub"
      title={NEWS_HUB.title}
      description={NEWS_HUB.description}
      href={NEWS_HUB.href}
      childNewsCategories={newsCategoriesAll()}
      crumbs={[{ href: NEWS_HUB.href, label: NEWS_HUB.shortTitle }]}
      intro={<Intro />}
    />
  );
}
