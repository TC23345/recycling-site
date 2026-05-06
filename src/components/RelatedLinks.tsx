import Link from "next/link";
import {
  leavesByCategory,
  leavesByCluster,
  type ClusterSlug,
  type GuideSlug,
} from "@/lib/manifest";

interface RelatedLinksProps {
  /** Pricing-cluster context — pulls leaves from `LEAVES`. */
  clusterSlug?: ClusterSlug;
  /** Guide/category context — pulls leaves from `GUIDE_LEAVES`. Provide both. */
  guide?: GuideSlug;
  category?: string;
  excludeSlug?: string;
  max?: number;
  heading?: string;
}

interface RelatedItem {
  slug: string;
  href: string;
  title: string;
  description: string;
}

export default function RelatedLinks({
  clusterSlug,
  guide,
  category,
  excludeSlug,
  max = 6,
  heading = "Related guides",
}: RelatedLinksProps) {
  let related: RelatedItem[] = [];

  if (clusterSlug) {
    related = leavesByCluster(clusterSlug)
      .filter((p) => p.slug !== excludeSlug)
      .slice(0, max)
      .map((p) => ({
        slug: p.slug,
        href: p.href,
        title: p.title,
        description: p.description,
      }));
  } else if (guide && category) {
    related = leavesByCategory(guide, category)
      .filter((l) => l.slug !== excludeSlug)
      .slice(0, max)
      .map((l) => ({
        slug: l.slug,
        href: l.href,
        title: l.title,
        description: l.description,
      }));
  }

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2
        id="related-heading"
        className="font-display text-2xl font-semibold tracking-tight text-navy-900"
      >
        {heading}
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {related.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.href}
              className="block rounded-card border border-steel-200 bg-white p-5 shadow-steel transition hover:border-rust-300 hover:shadow-md dark:bg-steel-100"
            >
              <p className="font-display text-base font-semibold text-navy-900">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-steel-600">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
