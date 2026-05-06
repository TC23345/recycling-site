import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/precious-metals-guide/_intro.mdx";
import { categoriesByGuide, getGuide, SITE } from "@/lib/manifest";

const guide = getGuide("precious-metals-guide");

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

export default function PreciousMetalsGuideHub() {
  return (
    <PillarHub
      level={2}
      eyebrow="Guide hub"
      title={guide.title}
      description={guide.description}
      href={guide.href}
      childCategories={categoriesByGuide("precious-metals-guide")}
      crumbs={[{ href: guide.href, label: guide.shortTitle }]}
      intro={<Intro />}
    />
  );
}
