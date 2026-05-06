export type Template =
  | "pillar-hub"
  | "pricing"
  | "guide"
  | "vendor"
  | "local-directory";

export type Cluster = "core" | "local" | "on-page" | "roi";

export type ClusterSlug =
  | "scrap"
  | "scrap-yard-near-me"
  | "scrap-metal"
  | "copper-price";

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
  title: string;
  shortTitle: string;
  description: string;
  template: "pillar-hub";
  href: string;
  targetKeyword: string;
  searchVolume?: number;
}

export const SITE = {
  name: "Scrap Metal & Recycling Guide",
  shortName: "Scrap & Recycle",
  description:
    "Comprehensive scrap metal pricing, recycling guides, vendor profiles, and yard directories — built for sellers, scrappers, and recycling pros.",
  baseUrl: "https://recycling-site.example",
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
    slug: "scrap",
    cluster: "core",
    title: "Scrap",
    shortTitle: "Scrap",
    description:
      "Everything you need to know about scrap — what counts, how it's graded, who buys it, and what it pays.",
    template: "pillar-hub",
    href: "/scrap",
    targetKeyword: "scrap",
    searchVolume: 27100,
  },
  {
    slug: "scrap-yard-near-me",
    cluster: "local",
    title: "Scrap Yards Near You",
    shortTitle: "Scrap Yard Near Me",
    description:
      "Find scrap yards, metal recyclers, and aluminum buyers near you — what to expect on the scale, and how to compare offers.",
    template: "pillar-hub",
    href: "/scrap-yard-near-me",
    targetKeyword: "scrap yard near me",
    searchVolume: 60500,
  },
  {
    slug: "scrap-metal",
    cluster: "on-page",
    title: "Scrap Metal",
    shortTitle: "Scrap Metal",
    description:
      "Scrap metal grades, current prices, removal services, and the recycling chain that turns waste into ingots.",
    template: "pillar-hub",
    href: "/scrap-metal",
    targetKeyword: "scrap metal",
    searchVolume: 27100,
  },
  {
    slug: "copper-price",
    cluster: "roi",
    title: "Copper & Metals Pricing",
    shortTitle: "Copper Price",
    description:
      "Live and recent prices for copper, aluminum, brass, and stainless — plus the factors that move them and how to time a sale.",
    template: "pillar-hub",
    href: "/copper-price",
    targetKeyword: "copper price",
    searchVolume: 135000,
  },
];

export const LEAVES: PageEntry[] = [
  // ── Cluster: scrap (core) ──────────────────────────────────────────
  {
    slug: "how-much-is-copper-per-pound",
    title: "How Much Is Copper Per Pound?",
    description:
      "Today's copper-per-pound payout, what affects the rate, and how to read a yard's price sheet without getting shorted.",
    cluster: "core",
    clusterSlug: "scrap",
    level: 3,
    template: "pricing",
    targetKeyword: "how much is copper per pound",
    searchVolume: 14800,
    href: "/scrap/how-much-is-copper-per-pound",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "recycle-scrap-steel",
    title: "How to Recycle Scrap Steel",
    description:
      "Step-by-step guide to recycling scrap steel — what counts as ferrous, how to prep it, and what yards pay per ton.",
    cluster: "core",
    clusterSlug: "scrap",
    level: 3,
    template: "guide",
    targetKeyword: "recycle scrap steel",
    searchVolume: 12100,
    href: "/scrap/recycle-scrap-steel",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "omnisource",
    title: "OmniSource: Profile & Locations",
    description:
      "OmniSource yard locations, services, and what sellers should expect on the scale — informational profile, not affiliated.",
    cluster: "core",
    clusterSlug: "scrap",
    level: 3,
    template: "vendor",
    targetKeyword: "omnisource",
    searchVolume: 9900,
    href: "/scrap/omnisource",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "weissmans",
    title: "Weissman's Scrap: Profile & Services",
    description:
      "Weissman's scrap operations, what they buy, and how their pricing tends to compare — informational profile, not affiliated.",
    cluster: "core",
    clusterSlug: "scrap",
    level: 3,
    template: "vendor",
    targetKeyword: "weissmans",
    searchVolume: 9900,
    href: "/scrap/weissmans",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "copper-and-wire",
    title: "Copper & Wire: Grades, Prices, and What Yards Want",
    description:
      "Bare bright vs. #1 vs. #2 copper, insulated wire grades, and how stripping affects payout per pound.",
    cluster: "core",
    clusterSlug: "scrap",
    level: 3,
    template: "guide",
    targetKeyword: "copper and wire",
    searchVolume: 8100,
    href: "/scrap/copper-and-wire",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "copper-per-pound",
    title: "Copper Per Pound — Today's Rate",
    description:
      "Current copper-per-pound payouts by grade, plus how COMEX spot drives the number you see at the yard.",
    cluster: "core",
    clusterSlug: "scrap",
    level: 3,
    template: "pricing",
    targetKeyword: "copper per pound",
    searchVolume: 8100,
    href: "/scrap/copper-per-pound",
    publishedAt: SITE.publishedAt,
  },

  // ── Cluster: scrap-yard-near-me (local) ────────────────────────────
  {
    slug: "scrap-yards-near-me",
    title: "Scrap Yards Near Me",
    description:
      "How to find a reputable scrap yard nearby, what services they offer, and questions to ask before you load up.",
    cluster: "local",
    clusterSlug: "scrap-yard-near-me",
    level: 3,
    template: "local-directory",
    targetKeyword: "scrap yards near me",
    searchVolume: 40500,
    href: "/scrap-yard-near-me/scrap-yards-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "metal-recycling-near-me",
    title: "Metal Recycling Near Me",
    description:
      "Find metal recycling centers in your area — what they accept, container drop-off, and pickup options.",
    cluster: "local",
    clusterSlug: "scrap-yard-near-me",
    level: 3,
    template: "local-directory",
    targetKeyword: "metal recycling near me",
    searchVolume: 33100,
    href: "/scrap-yard-near-me/metal-recycling-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "scrap-metal-near-me",
    title: "Scrap Metal Near Me",
    description:
      "Locate scrap metal buyers near you, compare their grade systems, and avoid common scale-house pitfalls.",
    cluster: "local",
    clusterSlug: "scrap-yard-near-me",
    level: 3,
    template: "local-directory",
    targetKeyword: "scrap metal near me",
    searchVolume: 27100,
    href: "/scrap-yard-near-me/scrap-metal-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "scrap-metal-recycling-near-me",
    title: "Scrap Metal Recycling Near Me",
    description:
      "Recycling-focused yards in your area — what they specialize in, drop-off vs. pickup, and certifications to look for.",
    cluster: "local",
    clusterSlug: "scrap-yard-near-me",
    level: 3,
    template: "local-directory",
    targetKeyword: "scrap metal recycling near me",
    searchVolume: 18100,
    href: "/scrap-yard-near-me/scrap-metal-recycling-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "scrap-metal-prices-near-me",
    title: "Scrap Metal Prices Near Me",
    description:
      "How local scrap prices vary, how to call around, and what 'spot' vs. 'paid' actually means at a yard.",
    cluster: "local",
    clusterSlug: "scrap-yard-near-me",
    level: 3,
    template: "local-directory",
    targetKeyword: "scrap metal prices near me",
    searchVolume: 12100,
    href: "/scrap-yard-near-me/scrap-metal-prices-near-me",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "metal-recyclers-near-me",
    title: "Metal Recyclers Near Me",
    description:
      "Industrial and consumer metal recyclers nearby — material acceptance lists, hours, and how to vet a yard.",
    cluster: "local",
    clusterSlug: "scrap-yard-near-me",
    level: 3,
    template: "local-directory",
    targetKeyword: "metal recyclers near me",
    searchVolume: 9900,
    href: "/scrap-yard-near-me/metal-recyclers-near-me",
    publishedAt: SITE.publishedAt,
  },

  // ── Cluster: scrap-metal (on-page) ─────────────────────────────────
  {
    slug: "scrap-metal-prices",
    title: "Scrap Metal Prices Today",
    description:
      "Current scrap metal prices across the major grades — copper, aluminum, brass, steel — and the macro forces moving them.",
    cluster: "on-page",
    clusterSlug: "scrap-metal",
    level: 3,
    template: "pricing",
    targetKeyword: "scrap metal prices",
    searchVolume: 22200,
    href: "/scrap-metal/scrap-metal-prices",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "metal-recycling",
    title: "Metal Recycling: How It Actually Works",
    description:
      "From bin to ingot — the full chain of metal recycling, who handles each step, and why it pays the prices it does.",
    cluster: "on-page",
    clusterSlug: "scrap-metal",
    level: 3,
    template: "guide",
    targetKeyword: "metal recycling",
    searchVolume: 12100,
    href: "/scrap-metal/metal-recycling",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "scrap-for-metal",
    title: "Scrap for Metal: A Beginner's Guide",
    description:
      "How to start scrapping for metal — where to source, how to sort, and where to sell for the best payout.",
    cluster: "on-page",
    clusterSlug: "scrap-metal",
    level: 3,
    template: "guide",
    targetKeyword: "scrap for metal",
    searchVolume: 9900,
    href: "/scrap-metal/scrap-for-metal",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "scrap-metal-recycling",
    title: "Scrap Metal Recycling Explained",
    description:
      "Why scrap metal recycling matters, the environmental and economic case, and how the industry is structured.",
    cluster: "on-page",
    clusterSlug: "scrap-metal",
    level: 3,
    template: "guide",
    targetKeyword: "scrap metal recycling",
    searchVolume: 9900,
    href: "/scrap-metal/scrap-metal-recycling",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "scrap-metal-removal",
    title: "Scrap Metal Removal Services",
    description:
      "Free pickup vs. paid haul-off, when each makes sense, and what services to expect from a removal crew.",
    cluster: "on-page",
    clusterSlug: "scrap-metal",
    level: 3,
    template: "guide",
    targetKeyword: "scrap metal removal",
    searchVolume: 6600,
    href: "/scrap-metal/scrap-metal-removal",
    publishedAt: SITE.publishedAt,
  },
  {
    slug: "metal-to-be-recycled",
    title: "Metal to Be Recycled: A Sorting Guide",
    description:
      "What metals can be recycled, what gets rejected, and the cleanest way to prep a load before you head to the yard.",
    cluster: "on-page",
    clusterSlug: "scrap-metal",
    level: 3,
    template: "guide",
    targetKeyword: "metal to be recycled",
    searchVolume: 5400,
    href: "/scrap-metal/metal-to-be-recycled",
    publishedAt: SITE.publishedAt,
  },

  // ── Cluster: copper-price (roi) ────────────────────────────────────
  {
    slug: "aluminum-scrap-price",
    title: "Aluminum Scrap Price Today",
    description:
      "Current aluminum scrap prices by grade — sheet, cast, extrusion, cans — and what drives the day-to-day swings.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "aluminum scrap price",
    searchVolume: 12100,
    href: "/copper-price/aluminum-scrap-price",
    publishedAt: SITE.publishedAt,
  },
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
  {
    slug: "aluminum-price-per-pound",
    title: "Aluminum Price Per Pound",
    description:
      "Aluminum's per-pound price by grade, with the alloy and contamination factors that explain wide payout ranges.",
    cluster: "roi",
    clusterSlug: "copper-price",
    level: 3,
    template: "pricing",
    targetKeyword: "aluminum price per pound",
    searchVolume: 8100,
    href: "/copper-price/aluminum-price-per-pound",
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
