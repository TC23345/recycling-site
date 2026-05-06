import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/recycling-guide/e-waste/_intro.mdx";
import { getCategory, getGuide, leavesByCategory, SITE } from "@/lib/manifest";

const guide = getGuide("recycling-guide");
const category = getCategory("recycling-guide", "e-waste");

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

export default function RecyclingGuideEWasteHub() {
  return (
    <PillarHub
      level={3}
      eyebrow="Category hub"
      title={category.title}
      description={category.description}
      href={category.href}
      childGuideLeaves={leavesByCategory("recycling-guide", "e-waste")}
      crumbs={[
        { href: guide.href, label: guide.shortTitle },
        { href: category.href, label: category.shortTitle },
      ]}
      intro={<Intro />}
    />
  );
}
