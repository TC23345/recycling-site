# Recycling Site

A content-first authority site in the scrap metal and recycling niche, built around live commodity pricing and long-form educational content. Hub-and-spoke information architecture: a home page, four pricing hubs (copper / aluminum / brass / stainless steel), three guide hubs (scrap basics, scrap-yards-near-me, scrap-metal recycling), and 24 long-tail leaf pages.

## Stack

- **Next.js 16** — App Router, Turbopack, React Server Components by default
- **React 19**
- **Tailwind CSS 4.2** — CSS-first via `@theme` (no `tailwind.config.js`); industrial OKLCH palette in rust / steel / navy
- **`@next/mdx`** — MDX content with the official Next.js loader; metadata lives in a typed manifest, not in MDX frontmatter
- **TypeScript** strict
- **Zod** — validates upstream price-feed responses

## Live data

Prices for copper, aluminum, brass, and stainless are fetched server-side from Yahoo Finance's unofficial chart endpoint (`HG=F`, `ALI=F`), validated with Zod, and converted to USD/lb when the upstream returns USD/MT. A deterministic-jitter stub is the fallback if the upstream ever fails — the table animation never freezes. The `/api/prices` Route Handler caches at the edge for 60 s; client components poll every 30 s and apply a flash animation on value change.

Brass is derived from live copper × 0.62 (Cu/Zn alloy ratio). Stainless and prepared steel currently use the stub since no clean free feed maps to them; nickel proxy was rejected as too noisy.

## Quick start

```bash
git clone https://github.com/TC23345/recycling-site.git
cd recycling-site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Hot-reload via Turbopack.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) on port 3000 |
| `npm run build` | Production build; runs typecheck and prerenders all routes |
| `npm run start` | Serve the built output |
| `npm run lint` | ESLint |

## Architecture

```
src/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, theme-boot script, site-wide JSON-LD
│   ├── page.tsx                    # L1 home (bespoke composition)
│   ├── sitemap.ts, robots.ts       # SEO file conventions
│   ├── api/prices/route.ts         # Live price endpoint, 60s revalidate
│   └── <cluster>/
│       ├── page.tsx                # L2 hub (PillarHub template)
│       └── [slug]/page.tsx         # L3 dynamic route (templated; one per cluster)
├── components/
│   ├── Nav, Footer, Breadcrumbs, JsonLd, PageHero, RelatedLinks
│   ├── ThemeToggle.tsx             # Light/dark toggle (client)
│   ├── LivePriceTable.tsx          # Polling + flash animation (client)
│   ├── LivePriceTicker.tsx         # Single-metal ticker (client)
│   ├── PriceBadge.tsx              # Nav badge (server, server-fetched)
│   ├── MetalCard.tsx               # Home grid (server)
│   └── templates/                  # PillarHub, PricingPage, GuideArticle, VendorPage, LocalDirectory
├── content/
│   ├── pillars/<cluster>.mdx       # L2 hub intros
│   └── <cluster>/<slug>.mdx        # L3 leaf bodies
├── lib/
│   ├── manifest.ts                 # Single source of truth: clusters, leaves, helpers
│   └── prices.ts                   # fetchLivePrices(), Zod schema, conversions
└── mdx-components.tsx              # @next/mdx integration (passthrough)
```

The manifest at `src/lib/manifest.ts` drives navigation, footer, sitemap, breadcrumbs, related-links sidebar, `generateStaticParams` for dynamic routes, and JSON-LD generation. Adding a new page is typically two files: a manifest entry and an MDX body.

## Theming

All design tokens live in a single `@theme` block in `src/app/globals.css` — colors (OKLCH), fonts (wired from `next/font`), radii, shadows. There is no `tailwind.config.js`; Tailwind v4 is fully CSS-first.

Class-based dark mode is registered via `@custom-variant dark (&:where(.dark, .dark *))` and implemented by inverting the steel ramp and lightening the navy ramp inside `.dark { ... }`. Most utilities (`bg-steel-50`, `text-navy-900`, etc.) auto-invert without per-component `dark:` variants. A small inline script in `<head>` reads `localStorage.theme` and `prefers-color-scheme` synchronously to prevent FOUC.

## SEO

- `generateMetadata` on every page — title template, OG, canonical, Twitter
- Per-page JSON-LD: `Article` (leaves), `BreadcrumbList`, plus site-wide `WebSite` and `Organization`
- `sitemap.ts` and `robots.ts` driven by the manifest

## Deployment

Connect the repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected; no build config required. Subsequent pushes to `master` auto-deploy; PRs get preview URLs.

Set `NEXT_PUBLIC_SITE_URL` in Vercel project env vars when a real domain is wired so canonical URLs and the sitemap reflect production. No other env vars are required for the live-price pipeline.
