import type { Metadata } from "next";
import PillarHub from "@/components/templates/PillarHub";
import HomeIntro from "@/content/pillars/home.mdx";
import { HOME, SITE } from "@/lib/manifest";

export const metadata: Metadata = {
  title: { absolute: HOME.title },
  description: HOME.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME.title,
    description: HOME.description,
    url: SITE.baseUrl,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <PillarHub
      level={1}
      eyebrow="Authority site"
      title={HOME.title}
      description={HOME.description}
      href={HOME.href}
      intro={<HomeIntro />}
    />
  );
}
