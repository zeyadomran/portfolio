# Zeyad Omran's portfolio

An editorial portfolio for product teams hiring a design-minded software engineer. Built with Next.js App Router, React, TypeScript, local PP Neue Montreal typography, and authored CSS. The story connects AI assistant interfaces, reusable frontend systems, performance, and an HCI-informed approach to work.

## Local development

Use Node.js 20.9 or newer and the checked-in Yarn Classic 1.22.22 release.

```sh
node .yarn/releases/yarn-1.22.22.cjs install --frozen-lockfile
node .yarn/releases/yarn-1.22.22.cjs dev
```

Open http://localhost:3000. Before building a fresh checkout, provision the three local font files described in `src/app/fonts/README.md`; raw font binaries are intentionally ignored by Git.

## Editing the story

- `src/components/editorial/portfolio.tsx`: server-rendered story, work chapters, native disclosures, experience, and contact information.
- `src/components/editorial/interactions.tsx`: navigation state, pointer response, scroll progress, restrained parallax, assistant workspace, component configurator, timing illustration, and copy-email action.
- `src/app/globals.css`: color and spacing tokens, typography, composition, interaction states, mobile layouts, reduced-motion and print styles.
- `src/app/layout.tsx`: local font loading and metadata.
- `src/lib/seo.ts`: public identity, canonical URL, structured data, and social metadata.
- `src/app/opengraph-image.tsx`: generated 1200×630 social image.

The assistant study keeps chat in a full-height right-hand panel. Opening the workspace changes only the remaining area to its left; the chat retains its width and position. Demo form values survive closing and reopening. The fictional content illustrates the interaction and is labeled accordingly.

The component study exposes real local configuration state. The performance illustration uses a common eight-second scale for the reported eight-to-three-second rendering result at 50 rows; it is not a live benchmark. That result belongs to the field-template/parser optimization, separate from the shared-table migration.

Native scrolling is retained. The desktop layout uses modest parallax and sticky figures where the viewport has enough room. On narrow screens, chapter titles precede figures and content stacks. Reduced-motion CSS removes animation and transforms. Core text, navigation, contact links, and native disclosures are server rendered.

Older components under `src/components/portfolio/`, the old runtime, and the original `design/` reference remain in the repository for reference but are not imported by the current home page. The current experience does not use Lenis.

## Validation

```sh
node .yarn/releases/yarn-1.22.22.cjs lint
node .yarn/releases/yarn-1.22.22.cjs typecheck
node .yarn/releases/yarn-1.22.22.cjs build
node .yarn/releases/yarn-1.22.22.cjs test:e2e
```

The Playwright specifications cover five responsive widths, assistant positioning and retained form state, component configuration, navigation, reduced motion, keyboard access, no-JavaScript content, contact layout, and SEO. They use installed Google Chrome by default; set `PLAYWRIGHT_CHANNEL=chromium` after installing the Playwright browser to use Chromium instead. Use a production build for production browser checks; the configuration can reuse an existing local server.

## Deployment and search

The canonical domain remains https://zeyadomran.com. For a Next.js deployment, use `yarn install --frozen-lockfile` and `yarn build`, with the project root as the build directory. Provision the local fonts in the build environment before building. The redesign was prepared and checked locally; it has not been published.

Title, description, canonical metadata, Open Graph, Twitter metadata, connected WebSite/ProfilePage/Person JSON-LD, robots, and the sitemap remain supported. Vercel preview/development environments receive `noindex` and an empty sitemap. Optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` values emit verification tags; see `.env.example`.

Keep contribution claims generic and evidence-backed. Do not insert internal service or repository names, imply ownership of AI models/backend systems, or turn an illustrative graphic into a claimed product screenshot.
