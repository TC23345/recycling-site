import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/local-guide/regional-quirks/_intro.mdx";
import { getCategory, getGuide, leavesByCategory, SITE } from "@/lib/manifest";

const guide = getGuide("local-guide");
const category = getCategory("local-guide", "regional-quirks");

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

export default function LocalGuideRegionalQuirksHub() {
  return (
    <PillarHub
      level={3}
      eyebrow="Category hub"
      title={category.title}
      description={category.description}
      href={category.href}
      childGuideLeaves={leavesByCategory("local-guide", "regional-quirks")}
      crumbs={[
        { href: guide.href, label: guide.shortTitle },
        { href: category.href, label: category.shortTitle },
      ]}
      intro={<Intro />}
    />
  );
}
