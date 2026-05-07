# Recycling Site

A content-first authority site in the scrap metal and recycling niche, built around live commodity pricing and long-form educational content. Hub-and-spoke information architecture: a home page, **6 pricing pillars** (copper, aluminum, brass, stainless, gold, silver), **6 guide silos × 4 categories each** (scrap, recycling, selling, industry, local, precious-metals), with leaf content under each. **69 prerendered routes today.**

## Stack

- **Next.js 16** — App Router, Turbopack, React Server Components by default
- **React 19**
- **Tailwind CSS 4.2** — CSS-first via `@theme` (no `tailwind.config.js`); industrial OKLCH palette in rust / steel / navy
- **`@next/mdx` + `remark-gfm`** — MDX content with the official Next.js loader; metadata lives in a typed manifest, not in MDX frontmatter
- **TypeScript** strict
- **Zod** — validates upstream price-feed responses

## Live data

Prices for copper, aluminum, brass, stainless, gold, and silver are fetched server-side. The pipeline is a per-metal source chain:

1. **Metals.dev `/v1/latest`** (primary, when `METALS_DEV_API_KEY` is set) — paid feed, supports all 6 metals.
2. **Yahoo Finance** chart endpoint (`HG=F` for copper, `ALI=F` for aluminum) — fallback for industrial metals.
3. **Derived** — brass = copper × 0.62 (Cu/Zn alloy ratio).
4. **Stub** — deterministic-jitter fallback so the table animation never freezes. Stainless + prepared steel are stub-only (no clean public ticker maps).

Every snapshot returns `source: "metals-dev" | "yahoo" | "derived" | "stub"`, visible inline next to each price for transparency.

**Display units:** industrial metals render in USD/lb; gold + silver render in USD/troy-ounce (`1 lb = 14.5833 toz`). The `formatMetalPrice(snapshot)` helper picks the right one per metal.

**Historical data:** 30-day charts + trend-insight bars on every pricing pillar, plus sparklines on home-page metal cards. Sourced from Metals.dev `/v1/timeseries` for precious metals (works on free tier) and Yahoo's chart endpoint with `range=1mo` for industrial metals (Metals.dev free tier returns null for industrial historical data).

## Quick start

```bash
git clone https://github.com/TC23345/recycling-site.git
cd recycling-site
cp .env.example .env.local           # add your Metals.dev key (optional; falls through to Yahoo without it)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Hot-reload via Turbopack.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) on port 3000 |
| `npm run build` | Production build; runs typecheck and prerenders 69 routes |
| `npm run start` | Serve the built output |
| `npm run lint` | ESLint |

## Architecture

```
src/
├── app/
│   ├── layout.tsx                            # Root layout, fonts, theme-boot script, site-wide JSON-LD
│   ├── page.tsx                              # L1 home (bespoke composition: hero + carousel + 2x3 guides)
│   ├── sitemap.ts, robots.ts                 # SEO file conventions
│   ├── about/page.tsx, privacy/page.tsx      # Static pages
│   ├── api/prices/route.ts                   # Live price endpoint, 60s revalidate
│   ├── <pricing-pillar>/page.tsx             # 6 pricing pillars
│   ├── <pricing-pillar>/[slug]/page.tsx      # L3 leaves (copper + aluminum have these today)
│   ├── <guide-silo>/page.tsx                 # 6 guide hubs
│   ├── <guide-silo>/<category>/page.tsx      # 24 category hubs
│   └── <guide-silo>/<category>/[slug]/page.tsx  # L4 leaves (per-category dynamic route)
├── components/
│   ├── Nav, MobileMenu, Footer, Breadcrumbs, JsonLd, PageHero, ThemeToggle
│   ├── PriceTable, PriceTicker, PriceBadge, MetalCard
│   ├── LivePriceTable, LivePriceTicker        # client polling + flash animation
│   ├── Sparkline, PriceChart, TrendInsight    # 30-day historical surfaces (vanilla SVG)
│   ├── PricingHeaderExtras                    # composes TrendInsight + PriceChart for pillar pages
│   └── templates/                              # PillarHub, PricingPage, GuideArticle, GuideLeafPage, VendorPage, LocalDirectory
├── content/
│   ├── pillars/<pillar>.mdx                   # L2 hub intros (6 pricing + 1 home)
│   ├── static/{about,privacy}.mdx
│   ├── <pricing-pillar>/<slug>.mdx            # pricing leaves
│   └── guides/<guide>/<category>/<slug>.mdx   # guide-silo leaves
├── lib/
│   ├── manifest.ts                            # Single source of truth: clusters, guides, categories, leaves, helpers
│   └── prices.ts                              # fetchLivePrices, fetchTimeseries, Zod schemas, conversions
└── mdx-components.tsx                         # @next/mdx integration (wraps tables in .table-wrap)
```

The manifest at `src/lib/manifest.ts` drives navigation, footer, sitemap, breadcrumbs, related-links sidebar, `generateStaticParams` for dynamic routes, and JSON-LD generation. Adding a new leaf is typically two files: a manifest entry and an MDX body.

## Theming

All design tokens live in a single `@theme` block in `src/app/globals.css` — colors (OKLCH), fonts (wired from `next/font`), radii, shadows. There is no `tailwind.config.js`; Tailwind v4 is fully CSS-first.

Class-based dark mode is registered via `@custom-variant dark (&:where(.dark, .dark *))` and implemented by inverting the steel ramp and lightening the navy ramp inside `.dark { ... }`. Most utilities (`bg-steel-50`, `text-navy-900`, etc.) auto-invert without per-component `dark:` variants. A small inline script in `<head>` reads `localStorage.theme` and `prefers-color-scheme` synchronously to prevent FOUC.

## SEO

- `generateMetadata` on every page — title template, description, canonical, OpenGraph
- Per-page JSON-LD: `WebPage` / `Article` / `AboutPage` (leaves), `BreadcrumbList`, plus site-wide `WebSite` and `Organization`
- `sitemap.ts` and `robots.ts` driven by the manifest
- 21 permanent (308) redirects in `next.config.ts` preserve any external links to legacy URLs

## Deployment

Connect the repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected; no build config required. Subsequent pushes to `master` auto-deploy; PRs get preview URLs.

**Environment variables (all optional):**

| Var | Purpose | Where read |
|---|---|---|
| `METALS_DEV_API_KEY` | Live + historical pricing for all 6 metals; falls through to Yahoo without it | `src/lib/prices.ts` |
| `NEXT_PUBLIC_SITE_URL` | Production base URL for canonical / sitemap / OG tags | `src/lib/manifest.ts` |

Set both in Vercel project env vars when wiring a real domain. The site behaves correctly without either set — pricing falls through to Yahoo + stub, and `SITE.baseUrl` defaults to `https://whatsmyscrapworth.com` (the production domain of record).
