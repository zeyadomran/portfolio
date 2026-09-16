# Portfolio guidance

Preserve the current editorial design, interactions, local typography, and evidence-backed contribution claims. Public IBM copy describes confirmed frontend work and uses generic names; illustrations remain labeled as such.

Before changing page structure, styling, or interactions, read README.md's "Editing the story" section for the product contracts. Core content and native disclosures must remain usable without JavaScript; keep prerendered HTML and browser hydration consistent.

For SEO or deployment changes, read `src/lib/seo.ts`, `scripts/site-metadata.ts`, and README.md's "Deployment and search" section. Preserve canonical identity, section anchors, and preview indexing behavior.

Validate changes with the commands in README.md's "Validation" section. Run the build before static-output tests and Playwright. Keep `design/archive/` outside the active application.
