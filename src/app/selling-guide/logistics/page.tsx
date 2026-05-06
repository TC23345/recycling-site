import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/guides/selling-guide/logistics/_intro.mdx";
import { getCategory, getGuide, leavesByCategory } from "@/lib/manifest";

const guide = getGuide("selling-guide");
const category = getCategory("selling-guide", "logistics");

export const metadata: Metadata = {
  title: category.title,
  description: category.description,
  alternates: { canonical: category.href },
};

export default function SellingGuideLogisticsHub() {
  return (
    <PillarHub
      level={3}
      eyebrow="Category hub"
      title={category.title}
      description={category.description}
      href={category.href}
      childGuideLeaves={leavesByCategory("selling-guide", "logistics")}
      crumbs={[
        { href: guide.href, label: guide.shortTitle },
        { href: category.href, label: category.shortTitle },
      ]}
      intro={<Intro />}
    />
  );
}
