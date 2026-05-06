import type { ReactNode } from "react";

interface FaqItemProps {
  /** The FAQ question. Rendered as an `<h3>` inside `<summary>` so it stays
   *  in the document outline (good for SEO + featured-snippet capture)
   *  while serving as the accordion's click target. */
  q: string;
  children: ReactNode;
}

/**
 * Server-rendered FAQ accordion item using native `<details>/<summary>` —
 * no client JS, fully crawler-readable (Google indexes content inside
 * collapsed details), and progressively enhances on browsers that style
 * the disclosure widget.
 *
 * Usage in MDX:
 *
 *     import FaqItem from "@/components/FaqItem";
 *
 *     <FaqItem q="How much is a pound of copper worth right now?">
 *
 *     Check the live ticker at the top of this page for spot...
 *
 *     </FaqItem>
 *
 * Blank lines around children are required so MDX parses the body as
 * markdown rather than raw JSX.
 */
export default function FaqItem({ q, children }: FaqItemProps) {
  return (
    <details className="group not-prose mt-3 rounded-card border border-steel-200 bg-white px-5 py-4 transition-colors duration-200 hover:border-rust-300 dark:bg-steel-100">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <h3 className="m-0 font-display text-base font-semibold text-navy-900 group-hover:text-rust-700">
          {q}
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 12"
          fill="currentColor"
          className="mt-1 h-3 w-3 shrink-0 text-steel-500 transition-transform duration-200 group-open:rotate-180 group-open:text-rust-600"
          aria-hidden
        >
          <path d="M2 4l4 4 4-4z" />
        </svg>
      </summary>
      <div className="prose prose-steel mt-3 max-w-none text-steel-700 dark:prose-invert">
        {children}
      </div>
    </details>
  );
}
