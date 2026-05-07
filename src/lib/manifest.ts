export type Template =
  | "pillar-hub"
  | "pricing"
  | "guide"
  | "vendor"
  | "local-directory";

export type Cluster = "core" | "local" | "on-page" | "roi";

export type ClusterCategory = "guide" | "pricing";

export type ClusterSlug =
  | "copper-price"
  | "aluminum-price"
  | "brass-price"
  | "stainless-steel-price"
  | "gold-price"
  | "silver-price";

import type { Metal } from "./prices";

export interface PageEntry {
  slug: string;
  title: string;
  description: string;
  cluster: Cluster;
  clusterSlug: ClusterSlug | null;
  level: 1 | 2 | 3;
  template: Template;
  targetKeyword: string;
  searchVolume?: number;
  href: string;
  publishedAt: string;
  updatedAt?: string;
}

export interface ClusterDefinition {
  slug: ClusterSlug;
  cluster: Cluster;
  category: ClusterCategory;
  metal?: Metal;
  title: string;
  shortTitle: string;
  description: string;
  template: "pillar-hub";
  href: string;
  targetKeyword: string;
  searchVolume?: number;
}

// ── Guide / Category hierarchy (Phase 1 IA expansion) ────────────────────────
// The new informational silo lives at /<guide>-guide/<category>/<leaf>. Pricing
// hubs above keep their existing flat structure. Slugs below DO include the
// `-guide` suffix (i.e. URL segment + directory name on disk).

export type GuideSlug =
  | "scrap-guide"
  | "recycling-guide"
  | "selling-guide"
  | "industry-guide"
  | "local-guide"
  | "precious-metals-guide";

export interface GuideDefinition {
  slug: GuideSlug;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
}

export interface CategoryDefinition {
  guide: GuideSlug;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
}

export interface GuideLeaf {
  guide: GuideSlug;
  category: string;
  slug: string;
  title: string;
  description: string;
  template: Template;
  targetKeyword: string;
  searchVolume?: number;
  href: string;
  publishedAt: string;
  updatedAt?: string;
}

export const SITE = {
  name: "Scrap Metal & Recycling Guide",
  shortName: "Scrap & Recycle",
  description:
    "Comprehensive scrap metal pricing, recycling guides, vendor profiles, and yard directories — built for sellers, scrappers, and recycling pros.",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://whatsmyscrapworth.com",
  publishedAt: "2026-05-05",
} as const;

export const HOME: PageEntry = {
  slug: "home",
  title: "Scrap Metal & Recycling Guide",
  description:
    "Daily scrap pricing, vendor profiles, recycling guides, and yard directories — your single resource for everything scrap.",
  cluster: "core",
  clusterSlug: null,
  level: 1,
  template: "pillar-hub",
  targetKeyword: "scrap metal and recycling",
  href: "/",
  publishedAt: SITE.publishedAt,
};

export const CLUSTERS: ClusterDefinition[] = [
  {
    slug: "copper-price",
    cluster: "roi",
    category: "pricing",
    metal: "copper",
    title: "Copper Price",
    shortTitle: "Copper Price",
    description:
      "Live copper spot, scrap copper grades, and the macro signals that move per-pound payouts.",
    template: "pillar-hub",
    href: "/copper-price",
    targetKeyword: "copper price",
    searchVolume: 135000,
  },
  {
    slug: "aluminum-price",
    cluster: "roi",
    category: "pricing",
    metal: "aluminum",
    title: "Aluminum Price",
    shortTitle: "Aluminum Price",
    description:
      "Live aluminum spot and scrap pricing across sheet, extrusion, cast, and UBC grades.",
    template: "pillar-hub",
    href: "/aluminum-price",
    targetKeyword: "aluminum price",
    searchVolume: 12100,
  },
  {
    slug: "brass-price",
    cluster: "roi",
    category: "pricing",
    metal: "brass",
    title: "Brass Price",
    shortTitle: "Brass Price",
    description:
      "Live brass scrap pricing — yellow, red, and plumbing brass — derived from copper and zinc.",
    template: "pillar-hub",
    href: "/brass-price",
    targetKeyword: "brass price",
    searchVolume: 4400,
  },
  {
    slug: "stainless-steel-price",
    cluster: "roi",
    category: "pricing",
    metal: "steel-stainless",
    title: "Stainless Steel Price",
    shortTitle: "Stainless Price",
    description:
      "Live stainless 304 and 316 scrap pricing, plus the nickel cycle that drives the spread.",
    template: "pillar-hub",
    href: "/stainless-steel-price",
    targetKeyword: "stainless steel price",
    searchVolume: 3600,
  },
  {
    slug: "gold-price",
    cluster: "roi",
    category: "pricing",
    metal: "gold",
    title: "Gold Price",
    shortTitle: "Gold Price",
    description:
      "Live gold spot pricing in USD per troy ounce, plus karat-by-karat refiner payouts for jewelry, dental, and coin sorts.",
    template: "pillar-hub",
    href: "/gold-price",
    targetKeyword: "gold price",
    searchVolume: 246000,
  },
  {
    slug: "silver-price",
    cluster: "roi",
    category: "pricing",
    metal: "silver",
    title: "Silver Price",
    shortTitle: "Silver Price",
    description:
      "Live silver spot pricing in USD per troy ounce — sterling vs fine silver, coin scrap, and what refiners actually pay.",
    template: "pillar-hub",
    href: "/silver-price",
    targetKeyword: "silver price",
    searchVolume: 110000,
  },
];

export function clustersByCategory(category: ClusterCategory): ClusterDefinition[] {
  return CLUSTERS.filter((c) => c.category === category);
}

export function pricingClusters(): ClusterDefinition[] {
  return clustersByCategory("pricing");
}

export function guideClusters(): ClusterDefinition[] {
  // Legacy guide clusters were removed in the Phase 1 IA expansion. Surfaces
  // that previously called this should call `guidesAll()` instead, but we keep
  // the export so any straggling consumers compile.
  return clustersByCategory("guide");
}

// ── Guide / Category data ───────────────────────────────────────────────────

export const GUIDES: GuideDefinition[] = [
  {
    slug: "scrap-guide",
    title: "Scrap Guide",
    shortTitle: "Scrap",
    description:
      "Everything you need to know about scrap — what counts, how it's graded, who buys it, and what it pays.",
    href: "/scrap-guide",
  },
  {
    slug: "recycling-guide",
    title: "Recycling Guide",
    shortTitle: "Recycling",
    description:
      "How metal recycling actually works — from bin to ingot — plus auto, e-waste, and construction-and-demolition streams.",
    href: "/recycling-guide",
  },
  {
    slug: "selling-guide",
    title: "Selling Guide",
    shortTitle: "Selling",
    description:
      "Practical guidance for sellers: how to prep, how to price, how to move material, and how to actually get paid.",
    href: "/selling-guide",
  },
  {
    slug: "industry-guide",
    title: "Industry Guide",
    shortTitle: "Industry",
    description:
      "Vendor profiles, mills and markets, trade-and-pricing dynamics, and the regulatory backdrop.",
    href: "/industry-guide",
  },
  {
    slug: "local-guide",
    title: "Local Guide",
    shortTitle: "Local",
    description:
      "Find scrap yards, metal recyclers, and aluminum buyers near you — plus state, metro, and regional quirks.",
    href: "/local-guide",
  },
  {
    slug: "precious-metals-guide",
    title: "Precious Metals Guide",
    shortTitle: "Precious",
    description:
      "Gold, silver, platinum, palladium — purity, weight units, refiner economics, and what to expect when selling jewelry, coins, or bullion.",
    href: "/precious-metals-guide",
  },
];

export const CATEGORIES: CategoryDefinition[] = [
  // ── scrap-guide ───────────────────────────────────────────────────────────
  {
    guide: "scrap-guide",
    slug: "basics",
    title: "Scrap Basics",
    shortTitle: "Basics",
    description: "Foundational concepts — what scrap is, how it flows, how the trade works.",
    href: "/scrap-guide/basics",
  },
  {
    guide: "scrap-guide",
    slug: "grades",
    title: "Scrap Grades",
    shortTitle: "Grades",
    description: "Grade definitions for the metals yards actually buy, with payout context.",
    href: "/scrap-guide/grades",
  },
  {
    guide: "scrap-guide",
    slug: "equipment",
    title: "Scrap Equipment",
    shortTitle: "Equipment",
    description: "Tools and gear — strippers, magnets, scales, balers — that pay for themselves.",
    href: "/scrap-guide/equipment",
  },
  {
    guide: "scrap-guide",
    slug: "yards",
    title: "Scrap Yards",
    shortTitle: "Yards",
    description: "How yards operate — pricing, scales, and what to expect on a drop-off.",
    href: "/scrap-guide/yards",
  },

  // ── recycling-guide ───────────────────────────────────────────────────────
  {
    guide: "recycling-guide",
    slug: "metal-recycling",
    title: "Metal Recycling",
    shortTitle: "Metal Recycling",
    description: "How metal recycling works end-to-end and why it pays the prices it does.",
    href: "/recycling-guide/metal-recycling",
  },
  {
    guide: "recycling-guide",
    slug: "auto",
    title: "Auto Recycling",
    shortTitle: "Auto",
    description: "End-of-life vehicles, catalytic converters, and the auto-scrap supply chain.",
    href: "/recycling-guide/auto",
  },
  {
    guide: "recycling-guide",
    slug: "e-waste",
    title: "E-Waste Recycling",
    shortTitle: "E-Waste",
    description: "Electronics recycling — circuit boards, wire harvest, and precious-metal recovery.",
    href: "/recycling-guide/e-waste",
  },
  {
    guide: "recycling-guide",
    slug: "c-and-d",
    title: "Construction & Demolition",
    shortTitle: "C&D",
    description: "Construction and demolition recycling — rebar, structural steel, and HVAC reclaim.",
    href: "/recycling-guide/c-and-d",
  },

  // ── selling-guide ─────────────────────────────────────────────────────────
  {
    guide: "selling-guide",
    slug: "preparation",
    title: "Preparation",
    shortTitle: "Preparation",
    description: "Sorting, stripping, and prepping a load so it grades well at the scale.",
    href: "/selling-guide/preparation",
  },
  {
    guide: "selling-guide",
    slug: "pricing",
    title: "Pricing",
    shortTitle: "Pricing",
    description: "How to read a yard price sheet, when to call around, and timing the market.",
    href: "/selling-guide/pricing",
  },
  {
    guide: "selling-guide",
    slug: "logistics",
    title: "Logistics",
    shortTitle: "Logistics",
    description: "Hauling, container drop-off, pickup services, and getting material to the yard.",
    href: "/selling-guide/logistics",
  },
  {
    guide: "selling-guide",
    slug: "money",
    title: "Getting Paid",
    shortTitle: "Money",
    description: "Cash, check, ACH, and 1099 — how scrap yards pay, and what to know about taxes.",
    href: "/selling-guide/money",
  },

  // ── industry-guide ────────────────────────────────────────────────────────
  {
    guide: "industry-guide",
    slug: "vendors",
    title: "Vendors",
    shortTitle: "Vendors",
    description: "Profiles of major scrap and recycling buyers — informational, not affiliated.",
    href: "/industry-guide/vendors",
  },
  {
    guide: "industry-guide",
    slug: "mills-and-markets",
    title: "Mills & Markets",
    shortTitle: "Mills & Markets",
    description: "Where scrap actually ends up — the mills, foundries, and downstream buyers.",
    href: "/industry-guide/mills-and-markets",
  },
  {
    guide: "industry-guide",
    slug: "trade-and-pricing",
    title: "Trade & Pricing",
    shortTitle: "Trade & Pricing",
    description: "Macro pricing dynamics, futures, exports, and what moves the per-pound number.",
    href: "/industry-guide/trade-and-pricing",
  },
  {
    guide: "industry-guide",
    slug: "regulation",
    title: "Regulation",
    shortTitle: "Regulation",
    description: "ID requirements, environmental rules, and the regulatory backdrop for buyers and sellers.",
    href: "/industry-guide/regulation",
  },

  // ── local-guide ───────────────────────────────────────────────────────────
  {
    guide: "local-guide",
    slug: "states",
    title: "By State",
    shortTitle: "States",
    description: "State-by-state scrap-yard density, regulations, and market quirks.",
    href: "/local-guide/states",
  },
  {
    guide: "local-guide",
    slug: "metros",
    title: "By Metro",
    shortTitle: "Metros",
    description: "Major metro markets — yard density, dominant buyers, and price norms.",
    href: "/local-guide/metros",
  },
  {
    guide: "local-guide",
    slug: "near-me",
    title: "Near Me",
    shortTitle: "Near Me",
    description: "Find scrap yards, metal recyclers, and buyers near you — what to expect on the scale.",
    href: "/local-guide/near-me",
  },
  {
    guide: "local-guide",
    slug: "regional-quirks",
    title: "Regional Quirks",
    shortTitle: "Regional Quirks",
    description: "How geography, freight, and local mills shift payouts from one region to the next.",
    href: "/local-guide/regional-quirks",
  },

  // ── precious-metals-guide ─────────────────────────────────────────────────
  {
    guide: "precious-metals-guide",
    slug: "basics",
    title: "Precious Basics",
    shortTitle: "Basics",
    description:
      "Troy ounce vs avoirdupois, fineness vs karat, what makes a metal 'precious', and why these markets behave differently from scrap.",
    href: "/precious-metals-guide/basics",
  },
  {
    guide: "precious-metals-guide",
    slug: "grades",
    title: "Grades & Purity",
    shortTitle: "Grades",
    description:
      "Karat marks (10K, 14K, 18K, 22K, 24K), sterling vs fine silver, .925 vs .999, hallmarks, and how purity shapes payout.",
    href: "/precious-metals-guide/grades",
  },
  {
    guide: "precious-metals-guide",
    slug: "refining",
    title: "Refining & Selling",
    shortTitle: "Refining",
    description:
      "Coin sorts, jewelry, dental scrap — who buys what, what refiners actually pay (95–99% of spot), and how to vet a buyer.",
    href: "/precious-metals-guide/refining",
  },
  {
    guide: "precious-metals-guide",
    slug: "market",
    title: "Market & Spot",
    shortTitle: "Market",
    description:
      "What moves spot — central banks, ETF flows, futures — plus LBMA fixings and the gap between spot and physical premium.",
    href: "/precious-metals-guide/market",
  },
];

export const GUIDE_LEAVES: GuideLeaf[] = [
  // ── scrap-guide / basics ──────────────────────────────────────────────────
  {
    guide: "scrap-guide",
    category: "basics",
    slug: "scrap-for-metal",
    title: "Scrap for Metal: A Beginner's Guide",
    description:
      "How to start scrapping for metal — where to source, how to sort, and where to sell for the best payout.",
    template: "guide",
    targetKeyword: "scrap for metal",
    searchVolume: 9900,
    href: "/scrap-guide/basics/scrap-for-metal",
    publishedAt: SITE.publishedAt,
  },

  // ── scrap-guide / grades ──────────────────────────────────────────────────
  {
    guide: "scrap-guide",
    category: "grades",
    slug: "copper-and-wire",
    title: "Copper & Wire: Grades, Prices, and What Yards Want",
    description:
      "Bare bright vs. #1 vs. #2 copper, insulated wire grades, and how stripping affects payout per pound.",
    template: "guide",
    targetKeyword: "copper and wire",
    searchVolume: 8100,
    href: "/scrap-guide/grades/copper-and-wire",
    publishedAt: SITE.publishedAt,
  },

  // ── scrap-guide / yards ───────────────────────────────────────────────────
  {
    guide: "scrap-guide",
    category: "yards",
    slug: "scrap-metal-prices",
    title: "Scrap Metal Prices Today",
    description:
      "Current scrap metal prices across the major grades — copper, aluminum, brass, steel — and the macro forces moving them.",
    template: "pricing",
    targetKeyword: "scrap metal prices",
    searchVolume: 22200,
    href: "/scrap-guide/yards/scrap-metal-prices",
    publishedAt: SITE.publishedAt,
  },

  // ── recycling-guide / metal-recycling ─────────────────────────────────────
  {
    guide: "recycling-guide",
    category: "metal-recycling",
    slug: "recycle-scrap-steel",
    title: "How to Recycle Scrap Steel",
    description:
      "Step-by-step guide to recycling scrap steel — what counts as ferrous, how to prep it, and what yards pay per ton.",
    template: "guide",
    targetKeyword: "recycle scrap steel",
    searchVolume: 12100,
    href: "/recycling-guide/metal-recycling/recycle-scrap-steel",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "recycling-guide",
    category: "metal-recycling",
    slug: "metal-recycling",
    title: "Metal Recycling: How It Actually Works",
    description:
      "From bin to ingot — the full chain of metal recycling, who handles each step, and why it pays the prices it does.",
    template: "guide",
    targetKeyword: "metal recycling",
    searchVolume: 12100,
    href: "/recycling-guide/metal-recycling/metal-recycling",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "recycling-guide",
    category: "metal-recycling",
    slug: "scrap-metal-recycling",
    title: "Scrap Metal Recycling Explained",
    description:
      "Why scrap metal recycling matters, the environmental and economic case, and how the industry is structured.",
    template: "guide",
    targetKeyword: "scrap metal recycling",
    searchVolume: 9900,
    href: "/recycling-guide/metal-recycling/scrap-metal-recycling",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "recycling-guide",
    category: "metal-recycling",
    slug: "metal-to-be-recycled",
    title: "Metal to Be Recycled: A Sorting Guide",
    description:
      "What metals can be recycled, what gets rejected, and the cleanest way to prep a load before you head to the yard.",
    template: "guide",
    targetKeyword: "metal to be recycled",
    searchVolume: 5400,
    href: "/recycling-guide/metal-recycling/metal-to-be-recycled",
    publishedAt: SITE.publishedAt,
  },

  // ── selling-guide / logistics ─────────────────────────────────────────────
  {
    guide: "selling-guide",
    category: "logistics",
    slug: "scrap-metal-removal",
    title: "Scrap Metal Removal Services",
    description:
      "Free pickup vs. paid haul-off, when each makes sense, and what services to expect from a removal crew.",
    template: "guide",
    targetKeyword: "scrap metal removal",
    searchVolume: 6600,
    href: "/selling-guide/logistics/scrap-metal-removal",
    publishedAt: SITE.publishedAt,
  },

  // ── industry-guide / vendors ──────────────────────────────────────────────
  {
    guide: "industry-guide",
    category: "vendors",
    slug: "omnisource",
    title: "OmniSource: Profile & Locations",
    description:
      "OmniSource yard locations, services, and what sellers should expect on the scale — informational profile, not affiliated.",
    template: "vendor",
    targetKeyword: "omnisource",
    searchVolume: 9900,
    href: "/industry-guide/vendors/omnisource",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "industry-guide",
    category: "vendors",
    slug: "weissmans",
    title: "Weissman's Scrap: Profile & Services",
    description:
      "Weissman's scrap operations, what they buy, and how their pricing tends to compare — informational profile, not affiliated.",
    template: "vendor",
    targetKeyword: "weissmans",
    searchVolume: 9900,
    href: "/industry-guide/vendors/weissmans",
    publishedAt: SITE.publishedAt,
  },

  // ── local-guide / near-me ─────────────────────────────────────────────────
  {
    guide: "local-guide",
    category: "near-me",
    slug: "scrap-yards-near-me",
    title: "Scrap Yards Near Me",
    description:
      "How to find a reputable scrap yard nearby, what services they offer, and questions to ask before you load up.",
    template: "local-directory",
    targetKeyword: "scrap yards near me",
    searchVolume: 40500,
    href: "/local-guide/near-me/scrap-yards-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "local-guide",
    category: "near-me",
    slug: "metal-recycling-near-me",
    title: "Metal Recycling Near Me",
    description:
      "Find metal recycling centers in your area — what they accept, container drop-off, and pickup options.",
    template: "local-directory",
    targetKeyword: "metal recycling near me",
    searchVolume: 33100,
    href: "/local-guide/near-me/metal-recycling-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "local-guide",
    category: "near-me",
    slug: "scrap-metal-near-me",
    title: "Scrap Metal Near Me",
    description:
      "Locate scrap metal buyers near you, compare their grade systems, and avoid common scale-house pitfalls.",
    template: "local-directory",
    targetKeyword: "scrap metal near me",
    searchVolume: 27100,
    href: "/local-guide/near-me/scrap-metal-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "local-guide",
    category: "near-me",
    slug: "scrap-metal-recycling-near-me",
    title: "Scrap Metal Recycling Near Me",
    description:
      "Recycling-focused yards in your area — what they specialize in, drop-off vs. pickup, and certifications to look for.",
    template: "local-directory",
    targetKeyword: "scrap metal recycling near me",
    searchVolume: 18100,
    href: "/local-guide/near-me/scrap-metal-recycling-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "local-guide",
    category: "near-me",
    slug: "scrap-metal-prices-near-me",
    title: "Scrap Metal Prices Near Me",
    description:
      "How local scrap prices vary, how to call around, and what 'spot' vs. 'paid' actually means at a yard.",
    template: "local-directory",
    targetKeyword: "scrap metal prices near me",
    searchVolume: 12100,
    href: "/local-guide/near-me/scrap-metal-prices-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    guide: "local-guide",
    category: "near-me",
    slug: "metal-recyclers-near-me",
    title: "Metal Recyclers Near Me",
    description:
      "Industrial and consumer metal recyclers nearby — material acceptance lists, hours, and how to vet a yard.",
    template: "local-directory",
    targetKeyword: "metal recyclers near me",
    searchVolume: 9900,
    href: "/local-guide/near-me/metal-recyclers-near-me",
    publishedAt: SITE.publishedAt,
  },
];

export const LEAVES: PageEntry[] = [
  // ── Cluster: copper-price (roi) — keeps existing 4 leaves + 4 migrated ────
  {
    slug: "copper-prices-today",
    title: "Copper Prices Today",
    description:
      "Today's copper spot, scrap, and per-pound payout — plus the inventory and macro signals to watch.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "copper prices today",
    searchVolume: 12100,
    href: "/copper-price/copper-prices-today",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "copper-scrap-price",
    title: "Copper Scrap Price Guide",
    description:
      "Copper scrap pricing across bare bright, #1, #2, and insulated grades, with practical guidance for sellers.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "copper scrap price",
    searchVolume: 12100,
    href: "/copper-price/copper-scrap-price",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "price-of-copper-per-pound",
    title: "Price of Copper Per Pound",
    description:
      "Per-pound copper pricing, how spot translates to scale-house payouts, and timing tips that move the needle.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "price of copper per pound",
    searchVolume: 12100,
    href: "/copper-price/price-of-copper-per-pound",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "scrap-copper-prices",
    title: "Scrap Copper Prices: Daily Snapshot",
    description:
      "Daily scrap copper price snapshot, grade-by-grade, with notes on local variance and quality discounts.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "scrap copper prices",
    searchVolume: 12100,
    href: "/copper-price/scrap-copper-prices",
    publishedAt: SITE.publishedAt,
  },
  // Migrated from /scrap/ in Phase 1
  {
    slug: "how-much-is-copper-per-pound",
    title: "How Much Is Copper Per Pound?",
    description:
      "Today's copper-per-pound payout, what affects the rate, and how to read a yard's price sheet without getting shorted.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "how much is copper per pound",
    searchVolume: 14800,
    href: "/copper-price/how-much-is-copper-per-pound",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "copper-per-pound",
    title: "Copper Per Pound — Today's Rate",
    description:
      "Current copper-per-pound payouts by grade, plus how COMEX spot drives the number you see at the yard.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "copper per pound",
    searchVolume: 8100,
    href: "/copper-price/copper-per-pound",
    publishedAt: SITE.publishedAt,
  },

  // ── Cluster: aluminum-price (roi) — 2 leaves migrated from /copper-price/ ─
  {
    slug: "aluminum-scrap-price",
    title: "Aluminum Scrap Price Today",
    description:
      "Current aluminum scrap prices by grade — sheet, cast, extrusion, cans — and what drives the day-to-day swings.",
    cluster: "roi",
    clusterSlug: "aluminum-price",
    level: 3,
    template: "pricing",
    targetKeyword: "aluminum scrap price",
    searchVolume: 12100,
    href: "/aluminum-price/aluminum-scrap-price",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "aluminum-price-per-pound",
    title: "Aluminum Price Per Pound",
    description:
      "Aluminum's per-pound price by grade, with the alloy and contamination factors that explain wide payout ranges.",
    cluster: "roi",
    clusterSlug: "aluminum-price",
    level: 3,
    template: "pricing",
    targetKeyword: "aluminum price per pound",
    searchVolume: 8100,
    href: "/aluminum-price/aluminum-price-per-pound",
    publishedAt: SITE.publishedAt,
  },
];

export function getCluster(slug: ClusterSlug): ClusterDefinition {
  const c = CLUSTERS.find((c) => c.slug === slug);
  if (!c) throw new Error(`Unknown cluster slug: ${slug}`);
  return c;
}

export function leavesByCluster(slug: ClusterSlug): PageEntry[] {
  return LEAVES.filter((p) => p.clusterSlug === slug);
}

export function findLeaf(clusterSlug: ClusterSlug, slug: string): PageEntry | undefined {
  return LEAVES.find((p) => p.clusterSlug === clusterSlug && p.slug === slug);
}

export function allLeafSlugs(clusterSlug: ClusterSlug): { slug: string }[] {
  return leavesByCluster(clusterSlug).map((p) => ({ slug: p.slug }));
}

// ── Guide / Category helpers ────────────────────────────────────────────────

export function guidesAll(): GuideDefinition[] {
  return GUIDES;
}

export function getGuide(slug: GuideSlug): GuideDefinition {
  const g = GUIDES.find((g) => g.slug === slug);
  if (!g) throw new Error(`Unknown guide slug: ${slug}`);
  return g;
}

export function categoriesByGuide(slug: GuideSlug): CategoryDefinition[] {
  return CATEGORIES.filter((c) => c.guide === slug);
}

export function getCategory(guide: GuideSlug, slug: string): CategoryDefinition {
  const c = CATEGORIES.find((c) => c.guide === guide && c.slug === slug);
  if (!c) throw new Error(`Unknown category: ${guide}/${slug}`);
  return c;
}

export function leavesByCategory(guide: GuideSlug, category: string): GuideLeaf[] {
  return GUIDE_LEAVES.filter((l) => l.guide === guide && l.category === category);
}

export function findGuideLeaf(
  guide: GuideSlug,
  category: string,
  slug: string,
): GuideLeaf | undefined {
  return GUIDE_LEAVES.find(
    (l) => l.guide === guide && l.category === category && l.slug === slug,
  );
}

export function allGuideLeafSlugs(guide: GuideSlug, category: string): { slug: string }[] {
  return leavesByCategory(guide, category).map((l) => ({ slug: l.slug }));
}
