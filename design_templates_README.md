# Reusable templates

[portfolio.html](portfolio.html) is the complete runnable snapshot. Open it directly or use its source as a starting point. Styles and interactions are in [../system.css](../system.css) and [../runtime.js](../runtime.js). Keep assets at `../../assets/` relative to this HTML.

It retains actual copy, contact links, the selected Baseline logo, and local dependencies. Replace personal content deliberately when adapting it.

## Section snippets

Files in `partials/` are exact source fragments for insertion into a full page, not independent previews. Asset paths in fragments remain relative to the project root. When inserting into `portfolio.html`, change `assets/` URLs to `../../assets/`.

| Fragment | Use |
| --- | --- |
| [header.html](partials/header.html) | Sticky navigation; expects home/about/work/links anchors |
| [hero.html](partials/hero.html) | Hero with name, scene, and work link |
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
