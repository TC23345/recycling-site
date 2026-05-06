import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import PricingHeaderExtras from "@/components/PricingHeaderExtras";
import Intro from "@/content/pillars/silver-price.mdx";
import { CLUSTERS, SITE } from "@/lib/manifest";

const cluster = CLUSTERS.find((c) => c.slug === "silver-price")!;

export const metadata: Metadata = {
  title: cluster.title,
  description: cluster.description,
  alternates: { canonical: cluster.href },
  openGraph: {
    title: cluster.title,
    description: cluster.description,
    url: `${SITE.baseUrl}${cluster.href}`,
    type: "website",
  },
};

export default function SilverPriceHub() {
  return (
    <PillarHub
      level={2}
      eyebrow="Live pricing"
      title={cluster.title}
      description={cluster.description}
      href={cluster.href}
      crumbs={[{ href: cluster.href, label: cluster.shortTitle }]}
      headerExtras={<PricingHeaderExtras metal="silver" metalLabel="Silver" />}
      intro={<Intro />}
    />
  );
}
