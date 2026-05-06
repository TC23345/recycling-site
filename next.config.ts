import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

// ── Phase 1 IA migration redirects ─────────────────────────────────────────
// Three hub-level redirects (legacy guide clusters → new guide structure) and
// 18 leaf-level redirects auto-generated from .claude/migration-plan.md.
// All permanent (308) — site isn't indexed yet, but external links are guarded.

const HUB_REDIRECTS: Array<{ source: string; destination: string }> = [
  { source: "/scrap", destination: "/scrap-guide" },
  { source: "/scrap-yard-near-me", destination: "/local-guide/near-me" },
  { source: "/scrap-metal", destination: "/scrap-guide" },
];

// 18 leaf-level redirects, table-driven from the migration plan.
// Order: legacy /scrap/ leaves (6), /scrap-yard-near-me/ (6), /scrap-metal/ (6).
const LEAF_REDIRECT_TABLE: Array<{ from: string; to: string }> = [
  // /scrap/ — 4 to new guide hierarchy + 2 to /copper-price/
  { from: "/scrap/recycle-scrap-steel", to: "/recycling-guide/metal-recycling/recycle-scrap-steel" },
  { from: "/scrap/omnisource",          to: "/industry-guide/vendors/omnisource" },
  { from: "/scrap/weissmans",           to: "/industry-guide/vendors/weissmans" },
  { from: "/scrap/copper-and-wire",     to: "/scrap-guide/grades/copper-and-wire" },
  { from: "/scrap/how-much-is-copper-per-pound", to: "/copper-price/how-much-is-copper-per-pound" },
  { from: "/scrap/copper-per-pound",    to: "/copper-price/copper-per-pound" },

  // /scrap-yard-near-me/ — all 6 → /local-guide/near-me/
  { from: "/scrap-yard-near-me/scrap-yards-near-me",          to: "/local-guide/near-me/scrap-yards-near-me" },
  { from: "/scrap-yard-near-me/metal-recycling-near-me",      to: "/local-guide/near-me/metal-recycling-near-me" },
  { from: "/scrap-yard-near-me/scrap-metal-near-me",          to: "/local-guide/near-me/scrap-metal-near-me" },
  { from: "/scrap-yard-near-me/scrap-metal-recycling-near-me",to: "/local-guide/near-me/scrap-metal-recycling-near-me" },
  { from: "/scrap-yard-near-me/scrap-metal-prices-near-me",   to: "/local-guide/near-me/scrap-metal-prices-near-me" },
  { from: "/scrap-yard-near-me/metal-recyclers-near-me",      to: "/local-guide/near-me/metal-recyclers-near-me" },

  // /scrap-metal/ — 6 across recycling-guide / scrap-guide / selling-guide
  { from: "/scrap-metal/scrap-metal-prices",     to: "/scrap-guide/yards/scrap-metal-prices" },
  { from: "/scrap-metal/metal-recycling",        to: "/recycling-guide/metal-recycling/metal-recycling" },
  { from: "/scrap-metal/scrap-for-metal",        to: "/scrap-guide/basics/scrap-for-metal" },
  { from: "/scrap-metal/scrap-metal-recycling",  to: "/recycling-guide/metal-recycling/scrap-metal-recycling" },
  { from: "/scrap-metal/scrap-metal-removal",    to: "/selling-guide/logistics/scrap-metal-removal" },
  { from: "/scrap-metal/metal-to-be-recycled",   to: "/recycling-guide/metal-recycling/metal-to-be-recycled" },

  // /copper-price/ aluminum-tagged → /aluminum-price/
  { from: "/copper-price/aluminum-scrap-price",     to: "/aluminum-price/aluminum-scrap-price" },
  { from: "/copper-price/aluminum-price-per-pound", to: "/aluminum-price/aluminum-price-per-pound" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  async redirects() {
    return [
      ...HUB_REDIRECTS.map((r) => ({ ...r, permanent: true })),
      ...LEAF_REDIRECT_TABLE.map((r) => ({
        source: r.from,
        destination: r.to,
        permanent: true,
      })),
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
