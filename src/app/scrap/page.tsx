import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import Intro from "@/content/pillars/scrap.mdx";
import { getCluster } from "@/lib/manifest";

const cluster = getCluster("scrap");

export const metadata: Metadata = {
  title: cluster.title,
  description: cluster.description,
  alternates: { canonical: cluster.href },
};

export default function ScrapHub() {
  return (
    <PillarHub
      level={2}
      eyebrow="Cluster hub"
      title={cluster.title}
      description={cluster.description}
      href={cluster.href}
      clusterSlug={cluster.slug}
      crumbs={[{ href: cluster.href, label: cluster.shortTitle }]}
      intro={<Intro />}
    />
  );
}
