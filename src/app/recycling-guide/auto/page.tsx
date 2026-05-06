import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/recycling-guide/auto/_intro.mdx";
import { getCategory, getGuide, leavesByCategory } from "@/lib/manifest";

const guide = getGuide("recycling-guide");
const category = getCategory("recycling-guide", "auto");

export const metadata: Metadata = {
  title: category.title,
  description: category.description,
  alternates: { canonical: category.href },
};

export default function RecyclingGuideAutoHub() {
  return (
    <PillarHub
      level={3}
      eyebrow="Category hub"
      title={category.title}
      description={category.description}
      href={category.href}
      childGuideLeaves={leavesByCategory("recycling-guide", "auto")}
      crumbs={[
        { href: guide.href, label: guide.shortTitle },
        { href: category.href, label: category.shortTitle },
      ]}
      intro={<Intro />}
    />
  );
}
