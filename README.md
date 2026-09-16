# Zeyad Omran's portfolio

An editorial portfolio built with Vite, React, TypeScript, Tailwind CSS, local PP Neue Montreal typography, and authored CSS. The story connects AI assistant interfaces, reusable frontend systems, performance, and an HCI-informed approach to work.

## Local development

Use Node.js 22.12 or newer (Node.js 20.19+ in the 20.x line is also supported) and the checked-in Yarn Classic release.

```sh
node .yarn/releases/yarn-1.22.22.cjs install --frozen-lockfile
node .yarn/releases/yarn-1.22.22.cjs dev
```

Open http://127.0.0.1:3000. The font files are tracked in `src/fonts/`; see its README for typography and license context.

## Editing the story

- `src/components/editorial/portfolio.tsx`: story, work chapters, native disclosures, experience, and contact information.
- `src/components/editorial/interactions.tsx`: navigation, hero layers, assistant workspace, component configurator, timing illustration, and copy-email action.
- `src/styles.css`: Tailwind theme and utilities, typography, editorial layout, responsive behavior, reduced motion, and print styles. The existing reset is intentional; Tailwind Preflight is omitted to preserve the design.
- `src/App.tsx`, `src/main.tsx`, and `src/entry-server.tsx`: shared page, browser hydration, and HTML rendering.
- `src/lib/seo.ts`: public identity, canonical URL, and connected WebSite/ProfilePage/Person structured data.
- `scripts/site-metadata.ts`: HTML metadata and crawler files; `public/icon.svg` and `public/opengraph-image.png`: static identity assets.

Vite renders the page in development. Production builds prerender the same React tree into `dist/index.html`, then hydrate it in the browser. Core text, navigation, contact links, structured data, and native disclosures remain available without JavaScript. Update the static 1200×630 social image when its copy or visual identity changes.

The assistant study keeps chat in a full-height right-hand panel while the workspace fills the area to its left. Chat positioning and demo form values survive opening and closing the workspace. Fictional content stays labeled as illustrative.

Modularity exposes real local configuration state and retains its sticky desktop figure. Optimization uses a common eight-second scale for the reported eight-to-three-second rendering result at 50 rows; it is an illustration, not a live benchmark. That result belongs to the field-template/parser optimization, separate from the shared-table migration. Preserve the `#assistant`, `#systems`, and `#optimization` anchors.

Native scrolling, restrained parallax, narrow-screen stacking, and reduced-motion behavior remain part of the design. Older components and runtime code are retained under `design/archive/` as reference; they are outside the active application.

## Validation

```sh
node .yarn/releases/yarn-1.22.22.cjs lint
node .yarn/releases/yarn-1.22.22.cjs typecheck
node .yarn/releases/yarn-1.22.22.cjs build
node .yarn/releases/yarn-1.22.22.cjs test
node .yarn/releases/yarn-1.22.22.cjs test:e2e
```

Build before running the tests: the Node tests inspect static output, and Playwright starts the production preview at http://127.0.0.1:4173. `yarn preview` or `yarn start` serves that same output for manual review. The development and preview ports are strict.

Playwright covers responsive layouts, assistant positioning and retained form state, configuration, navigation, reduced motion, keyboard access, no-JavaScript content, and SEO. It uses installed Google Chrome by default; set `PLAYWRIGHT_CHANNEL=chromium` after installing the Playwright browser to use Chromium instead. The configuration may reuse an existing preview server, so ensure it serves the current build.

## Deployment and search

`vercel.json` selects Vite, runs `yarn install --frozen-lockfile` and `yarn build`, and publishes `dist/` as static files. It redirects the former `/opengraph-image` URL to `/opengraph-image.png`. This migration configures deployment; it does not publish the site.

The canonical domain remains https://zeyadomran.com. Builds preserve title, description, canonical metadata, Open Graph, Twitter metadata, structured data, robots, and sitemap. `VERCEL_ENV=preview` or `development` produces `noindex, follow` and an empty sitemap while allowing crawlers to read the HTML. Other environments produce a sitemap containing only the canonical homepage.

Optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` values emit verification tags. Configure them for the intended build environment and rebuild; `.env.example` documents local setup. These values are read by build tooling, not browser environment variables.

Keep contribution claims generic and evidence-backed. Use confirmed frontend scope, omit internal service and repository names, and label illustrative graphics accurately.
