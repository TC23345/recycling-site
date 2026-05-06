import Link from "next/link";
import { leavesByCluster, type ClusterSlug, type PageEntry } from "@/lib/manifest";

interface RelatedLinksProps {
  clusterSlug: ClusterSlug;
  excludeSlug?: string;
  max?: number;
  heading?: string;
}

export default function RelatedLinks({
  clusterSlug,
  excludeSlug,
  max = 6,
  heading = "Related guides",
}: RelatedLinksProps) {
  const related = leavesByCluster(clusterSlug)
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, max);

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
        {related.map((p: PageEntry) => (
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
