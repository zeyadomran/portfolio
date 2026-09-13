# Zeyad Omran's portfolio

A Next.js App Router portfolio built from the supplied design export, with TypeScript, Tailwind CSS, local Space Mono fonts, and Lenis. Content is server rendered; navigation, stories, skills, and geometric motion are progressively enhanced after hydration.

## Local development

Use Node.js 20.9 or newer and Yarn Classic 1.22.22.

```sh
yarn install --frozen-lockfile
yarn dev
```

Open http://localhost:3000. The repository pins Yarn v1 in `packageManager` and `.yarnrc`. If Yarn is not on PATH, the checked-in release works directly:

```sh
node .yarn/releases/yarn-1.22.22.cjs install --frozen-lockfile
node .yarn/releases/yarn-1.22.22.cjs dev
```

## Validation

```sh
yarn lint
yarn typecheck
yarn build
yarn test:e2e
```

The browser checks use installed Google Chrome and start the production server automatically. Alternatively, install Chromium with `yarn playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`. Tests cover the nine design viewports, stories, filters, keyboard navigation, history, reduced motion, and content without JavaScript.

## Editing

- `src/app/page.tsx` composes the portfolio sections.
- `src/components/portfolio/` contains editable React components and the client motion boundary.
- `src/app/globals.css` exposes the design tokens to Tailwind. Shared layout primitives use utility classes; `design-system.css` preserves detailed composition, responsive rules, and interaction states. Tailwind Preflight is omitted to retain the authored base styles.
- `src/lib/portfolio-runtime.js` preserves the supplied DOM animation algorithm with an explicit React disposer. Its listeners, observers, animations, and DOM enhancements are restored on unmount, including development Strict Mode remounts.
- `public/assets/` contains the production assets and applicable licenses; `src/app/icon.svg` is the selected Baseline favicon.
- `design/` is the original reference export. Application components do not import it, and it is not a public route. The identity comparison and overlapping partials are not separate portfolio pages.

## Vercel

Import this repository, select **Next.js**, and leave the root directory at the repository root. Use `yarn install --frozen-lockfile` for installation and `yarn build` for the build; keep the default Next.js output setting. No environment variables are required. Select a supported Node.js version satisfying the package's engine requirement.

The site is ready for deployment; this task does not provision a Vercel project or publish it. The canonical production domain is **https://zeyadomran.com**.

## Search and sharing

`src/lib/seo.ts` is the source for the public identity, canonical domain, title, description, and structured data. Metadata targets searches for **Zeyad Omran** and **software developer** and describes the work already shown on the page.

- Server-rendered title, description, author, canonical, indexing directives, Open Graph, and Twitter card metadata.
- Connected `WebSite`, `ProfilePage`, and `Person` JSON-LD, using the existing employer, education, skills, and public profile links.
- `/opengraph-image` produces a 1200×630 PNG using the portfolio's local font and identity.
- `/robots.txt` allows crawling and advertises `/sitemap.xml`. The sitemap lists the single canonical page; section anchors are not separate pages. It omits an artificial last-modified date.
- Vercel preview/development deployments render `noindex`, omit the sitemap advertisement, and return an empty sitemap. Crawling remains allowed so crawlers can read `noindex`. Production builds remain indexable.
- Optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` environment variables emit the corresponding ownership-verification tags. Copy only the real provider token; see `.env.example`. No placeholder verification tags are emitted.

After deployment, attach the canonical domain in Vercel, verify the site in [Google Search Console](https://search.google.com/search-console), submit `https://zeyadomran.com/sitemap.xml`, and inspect the home page to confirm Google can access it. A Search Console Domain property uses DNS verification; a URL-prefix property can use the optional HTML verification tag. Set production verification variables in Vercel and rebuild before verifying.

Metadata helps search engines interpret the site; it does not guarantee a top ranking. The implementation omits `meta keywords`, which [Google does not use for indexing or ranking](https://developers.google.com/search/docs/crawling-indexing/special-tags). Keep visible work and profile information current. Structured data can be checked after launch with [Google's Rich Results Test](https://search.google.com/test/rich-results).

Run the focused SEO checks with `yarn test:e2e tests/seo.spec.ts` after `yarn build`. They inspect server-rendered tags, JSON-LD relationships, crawler endpoints, and the social image's PNG dimensions.

See [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md) for the design review and implementation record.
