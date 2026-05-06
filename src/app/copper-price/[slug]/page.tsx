import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PricingPage from "@/components/templates/PricingPage";
import GuideArticle from "@/components/templates/GuideArticle";
import VendorPage from "@/components/templates/VendorPage";
import LocalDirectory from "@/components/templates/LocalDirectory";
import { allLeafSlugs, findLeaf, getCluster } from "@/lib/manifest";

const CLUSTER_SLUG = "copper-price" as const;
const cluster = getCluster(CLUSTER_SLUG);

export const dynamicParams = false;

export function generateStaticParams() {
  return allLeafSlugs(CLUSTER_SLUG);
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = findLeaf(CLUSTER_SLUG, slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.href },
  };
}

export default async function L3Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findLeaf(CLUSTER_SLUG, slug);
  if (!page) notFound();

  const { default: Body } = await import(`@/content/copper-price/${slug}.mdx`);

  const crumbs = [
    { href: cluster.href, label: cluster.shortTitle },
    { href: page.href, label: page.title },
  ];

  switch (page.template) {
    case "pricing":
      return <PricingPage page={page} crumbs={crumbs} clusterSlug={CLUSTER_SLUG} body={<Body />} />;
    case "guide":
      return <GuideArticle page={page} crumbs={crumbs} clusterSlug={CLUSTER_SLUG} body={<Body />} />;
    case "vendor":
      return <VendorPage page={page} crumbs={crumbs} clusterSlug={CLUSTER_SLUG} body={<Body />} />;
    case "local-directory":
      return <LocalDirectory page={page} crumbs={crumbs} clusterSlug={CLUSTER_SLUG} body={<Body />} />;
    default:
      notFound();
  }
}
