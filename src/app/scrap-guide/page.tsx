import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/scrap-guide/_intro.mdx";
import { categoriesByGuide, getGuide } from "@/lib/manifest";

const guide = getGuide("scrap-guide");

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.href },
};

export default function ScrapGuideHub() {
  return (
    <PillarHub
      level={2}
      eyebrow="Guide hub"
      title={guide.title}
      description={guide.description}
      href={guide.href}
      childCategories={categoriesByGuide("scrap-guide")}
      crumbs={[{ href: guide.href, label: guide.shortTitle }]}
      intro={<Intro />}
    />
  );
}
