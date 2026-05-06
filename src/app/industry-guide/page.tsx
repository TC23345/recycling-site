import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/industry-guide/_intro.mdx";
import { categoriesByGuide, getGuide, SITE } from "@/lib/manifest";

const guide = getGuide("industry-guide");

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.href },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: `${SITE.baseUrl}${guide.href}`,
    type: "website",
  },
};

export default function IndustryGuideHub() {
  return (
    <PillarHub
      level={2}
      eyebrow="Guide hub"
      title={guide.title}
      description={guide.description}
      href={guide.href}
      childCategories={categoriesByGuide("industry-guide")}
      crumbs={[{ href: guide.href, label: guide.shortTitle }]}
      intro={<Intro />}
    />
  );
}
