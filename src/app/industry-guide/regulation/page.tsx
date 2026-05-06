import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/industry-guide/regulation/_intro.mdx";
import { getCategory, getGuide, leavesByCategory } from "@/lib/manifest";

const guide = getGuide("industry-guide");
const category = getCategory("industry-guide", "regulation");

export const metadata: Metadata = {
  title: category.title,
  description: category.description,
  alternates: { canonical: category.href },
};

export default function IndustryGuideRegulationHub() {
  return (
    <PillarHub
      level={3}
      eyebrow="Category hub"
      title={category.title}
      description={category.description}
      href={category.href}
      childGuideLeaves={leavesByCategory("industry-guide", "regulation")}
      crumbs={[
        { href: guide.href, label: guide.shortTitle },
        { href: category.href, label: category.shortTitle },
      ]}
      intro={<Intro />}
    />
  );
}
