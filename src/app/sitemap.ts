import type { MetadataRoute } from "next";
import {
  CATEGORIES,
  CLUSTERS,
  GUIDES,
  GUIDE_LEAVES,
  HOME,
  LEAVES,
  NEWS_CATEGORIES,
  NEWS_HUB,
  SITE,
} from "@/lib/manifest";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE.baseUrl}${HOME.href}`,
      lastModified: HOME.updatedAt ?? HOME.publishedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...CLUSTERS.map((c) => ({
      url: `${SITE.baseUrl}${c.href}`,
      lastModified: HOME.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...GUIDES.map((g) => ({
      url: `${SITE.baseUrl}${g.href}`,
      lastModified: HOME.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE.baseUrl}${NEWS_HUB.href}`,
      lastModified: HOME.publishedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...CATEGORIES.map((c) => ({
      url: `${SITE.baseUrl}${c.href}`,
      lastModified: HOME.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...NEWS_CATEGORIES.map((n) => ({
      url: `${SITE.baseUrl}${n.href}`,
      lastModified: HOME.publishedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...LEAVES.map((p) => ({
      url: `${SITE.baseUrl}${p.href}`,
      lastModified: p.updatedAt ?? p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...GUIDE_LEAVES.map((p) => ({
      url: `${SITE.baseUrl}${p.href}`,
      lastModified: p.updatedAt ?? p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE.baseUrl}/about`,
      lastModified: HOME.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE.baseUrl}/privacy`,
      lastModified: HOME.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];
  return entries;
}
