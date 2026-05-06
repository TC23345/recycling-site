import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="border-b border-steel-200 bg-gradient-to-b from-steel-100 to-steel-50 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {eyebrow && (
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-rust-600">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-steel-600">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
