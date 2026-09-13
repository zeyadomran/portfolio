# Portfolio implementation plan

## Confirmed setup

- Next.js App Router and TypeScript at the repository root.
- Tailwind CSS, preserving the design's tokens, geometry, typography, and motion.
- Yarn Classic 1.22.22, pinned locally and in `packageManager`, with a committed `yarn.lock`.
- Standard Next.js deployment on Vercel. No backend, CMS, or environment variables needed for the supplied portfolio.

## Design review

The authored `design/DESIGN.md`, `design/design/IMPLEMENTATION.md`, and template guide identify `design/index.html` as the canonical, single-page portfolio. The generated `DESIGN-MANIFEST.json` incorrectly labels reusable partials as individual screens. About includes education and skills; the identity comparison is a design reference, not a production route.

Preserve black backgrounds, local Space Mono, royal blue #4C70F0, square corners, the selected Baseline identity, the supplied copy and contact links, and the five foreground SVG compositions. Retain the design export unchanged for comparison.

## Steps

1. Scaffold Next.js, Tailwind, TypeScript, ESLint, and Yarn Classic. Copy only production assets and their licenses.
2. Convert the authored markup into server-rendered React components: header, hero, About story, education, skills, work, contact, and footer. Use Tailwind for reusable layout primitives and expose design tokens through its theme.
3. Integrate Lenis and the supplied animation logic through a client lifecycle boundary. Preserve native anchors, keyboard input, fit-gated pinned stories, mobile reading flow, skills filtering, and reduced motion. Dispose listeners, observers, animations, and DOM enhancements on unmount.
4. Add metadata and favicon, document local commands and Vercel settings.
5. Run lint, TypeScript, and a production build. Validate responsive sizes from 360px to 1920px, skills and story controls, hash navigation, reduced motion, no-JavaScript reading, and console errors. Compare representative screenshots to the export.

## Completion record

Completed on 2026-09-13. Next.js 16.3.5, React 19.3.0, Tailwind CSS 4.3.3, Lenis 1.3.26, and Yarn Classic 1.22.22 are installed and locked.

- All sections are implemented as server-rendered React components, with the original assets, copy, and Baseline identity.
- Runtime cleanup is connected to React. Instant history navigation cancels any in-flight Lenis animation and owns scroll restoration while mounted.
- Tailwind's utility layer follows the retained layout layer so nested qualification fields preserve their flex layout.
- ESLint, TypeScript, and the optimized production build pass.
- All 15 Playwright checks pass in desktop Chrome with viewport emulation, covering all nine design sizes plus interactions and accessibility behavior.
- Compared 11 major layout regions with the canonical export at all nine sizes under reduced motion: no position or size differences greater than 1 CSS pixel. Desktop and mobile screenshots were reviewed, including the hero, education, work, and contact sections.
- Development Strict Mode smoke check passed: no browser console errors, hydration errors, or nested/duplicated heading enhancement wrappers; skills filtering remained functional.
- Original tracked files under `design/` and `assets/` are unchanged.

The local preview is ready. Vercel setup is documented in `README.md`; no deployment was performed. Browser checks used Chrome with emulated viewport sizes, not physical-device or Safari testing.
