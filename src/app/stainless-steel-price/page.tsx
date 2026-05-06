import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/pillars/stainless-steel-price.mdx";
import { CLUSTERS, SITE } from "@/lib/manifest";

const cluster = CLUSTERS.find((c) => c.slug === "stainless-steel-price")!;

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

export default function StainlessSteelPriceHub() {
  return (
    <PillarHub
      level={2}
      eyebrow="Live pricing"
      title={cluster.title}
      description={cluster.description}
      href={cluster.href}
      crumbs={[{ href: cluster.href, label: cluster.shortTitle }]}
      intro={<Intro />}
    />
  );
}
