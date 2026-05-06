import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GuideLeafPage from "@/components/templates/GuideLeafPage";
import {
  allGuideLeafSlugs,
  findGuideLeaf,
  getCategory,
  getGuide,
} from "@/lib/manifest";

const GUIDE_SLUG = "recycling-guide" as const;
const CATEGORY_SLUG = "e-waste" as const;
const guide = getGuide(GUIDE_SLUG);
const category = getCategory(GUIDE_SLUG, CATEGORY_SLUG);

export const dynamicParams = false;

export function generateStaticParams() {
  return allGuideLeafSlugs(GUIDE_SLUG, CATEGORY_SLUG);
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = findGuideLeaf(GUIDE_SLUG, CATEGORY_SLUG, slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.href },
  };
}

export default async function RecyclingGuideEWasteLeaf({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findGuideLeaf(GUIDE_SLUG, CATEGORY_SLUG, slug);
  if (!page) notFound();

  const { default: Body } = await import(
    `@/content/guides/recycling-guide/e-waste/${slug}.mdx`
  );

  const crumbs = [
    { href: guide.href, label: guide.shortTitle },
    { href: category.href, label: category.shortTitle },
    { href: page.href, label: page.title },
  ];

  return <GuideLeafPage page={page} crumbs={crumbs} body={<Body />} />;
}
