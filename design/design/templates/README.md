# Reusable templates

[portfolio.html](portfolio.html) is the complete runnable snapshot. Open it directly or use its source as a starting point. Styles and interactions are in [../system.css](../system.css) and [../runtime.js](../runtime.js). Keep assets at `../../assets/` relative to this HTML.

It retains actual copy, contact links, the selected Baseline logo, and local dependencies. Replace personal content deliberately when adapting it.

## Section snippets

Files in `partials/` are exact source fragments for insertion into a full page, not independent previews. Asset paths in fragments remain relative to the project root. When inserting into `portfolio.html`, change `assets/` URLs to `../../assets/`.

| Fragment | Use |
| --- | --- |
| [header.html](partials/header.html) | Sticky navigation; expects home/about/work/links anchors |
| [hero.html](partials/hero.html) | Hero with name, scene, and work link |
| [education.html](partials/education.html) | University heading and qualification fields beside a responsive date timeline |
| [about.html](partials/about.html) | Complete About, education, and skills |
| [story.html](partials/story.html) | Three-stage About story; needs an enclosing `[data-scene-scope]` |
| [skills.html](partials/skills.html) | Five-category skills explorer |
| [work.html](partials/work.html) | Two-role IBM section with metrics |
| [kpi-card.html](partials/kpi-card.html) | One KPI; insert in `.kpi-grid.od-grid` |
| [contact.html](partials/contact.html) | Complete Contact section |
| [contact-card.html](partials/contact-card.html) | One link; insert in `.contact-links` |
| [footer.html](partials/footer.html) | Footer, year hook, scene, back-to-top link |

Fragments overlap: About includes Story and Skills, Work includes KPIs, and Contact includes cards. Replace the appropriate section or use a smaller fragment; do not append duplicates with repeated IDs.

## Reuse sequence

1. Use the full-page template for a new page and fragments for local replacements.
2. Update copy, URLs, dates, labels, and metadata deliberately.
3. Keep IDs unique; align stage-button indexes and skill-filter keys with their content.
4. Preserve the scaffold and dependencies in [the implementation guide](../IMPLEMENTATION.md).
5. Edit `system.css` for template styling. Update root `index.html` separately for live changes.

This is an editable snapshot, not a synchronized component library. No post-write previews or tests were performed.




About and Work place `.story-visual` first inside `.story-frame`, followed by `.stage-stack`. The frame has a bounded artwork column on wider screens and one column on phones. Keep artwork outside `.story-top`, which holds the sticky controls. Education belongs before the skills block within the single-column `.about-support`. Use the current styles together with these updated fragments.

Phone stories use the same stages and controls as desktop in natural flow. Retain `.story-top` inside `.story-panel`; its conditional sticky placement and reading offset are owned by the current styles and runtime. No backdrop scripts are required.

## Composition tokens

The source fragments are unchanged by this CSS refinement. Use `--layout-rail` and `--layout-gap` for matching story and introductory columns, `--section-gap` and `--chapter-gap` for spacing, and `--focus-marker-size` for the emphasized result square. Preserve `.story-frame > .story-visual + .stage-stack` and the runtime's largest-stage reservation. Desktop uses two columns; mobile uses complete one-column chapters.

## Responsive polish hooks

Keep `.role-body` around role details so its container query can reorganize metadata and KPI columns. Preserve the `.kpi-qualifier` span in the Work snippet; it changes emphasis without changing “Over 80%”. Contact grid sizing uses its own label font and the shared minimum-width token. Header navigation containment applies only to the existing full-width phone row. Use the updated `runtime.js` for keyboard interruption on focused links.

The education partial includes both the date rail and qualification content. Keep its `time` elements, heading IDs, and description-list fields together. On phones the timeline leads the university heading horizontally; details then stack in reading order.

Skills now use one `.skill-tiles.od-rail` per category. Preserve the list tabindex and category heading reference, and use the updated stylesheet for single-line tiles and native horizontal overflow.
