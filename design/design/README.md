# Portfolio design kit

Originally saved on 2026-09-12 after **Baseline / option 3** was selected, then refreshed with [the motion follow-up](MOTION.md). [The live portfolio](../index.html) remains canonical. The saved template uses the same updated styles and interaction code.

| File | Use |
| --- | --- |
| [Design document](../DESIGN.md) | Direction, hierarchy, layout, identity, and interaction principles |
| [Implementation guide](IMPLEMENTATION.md) | Component hooks, scroll formulas, dependencies, and editing guidance |
| [Content inventory](CONTENT.md) | Copy, skills, dates, metrics, and contact destinations |
| [Tokens](tokens.json) | Exact default variables and responsive/forced-color overrides |
| [Styles](system.css) | Reusable stylesheet, including tokens and layout primitives |
| [Interaction code](runtime.js) | Existing navigation, scenes, skills, and motion |
| [Motion follow-up](MOTION.md) | Hero entry, skills and stage transitions, contact entrances, control timing, lifecycle behavior |
| [Full-page template](templates/portfolio.html) | Runnable source snapshot |
| [Template guide](templates/README.md) | Section snippets and reuse instructions |
| [Snapshot manifest](snapshot.json) | Input hash, dependencies, saved-file inventory |
| [Identity guide](../identity/guide.md) | Logo files and usage rules |
| [Generation prompts](../identity/prompts.md) | Existing identity exploration prompts |

The current kit includes the approved composition refinement: shared story alignment, stable heading positions, stronger type hierarchy, small blue selection cues, and responsive chapter spacing.

The current polish also adds content-width Work reflow, balanced narrow navigation, label-based contact sizing, and keyboard scroll interruption on focused links.

## Open and reuse

Open `templates/portfolio.html` directly in a browser. It uses `../system.css`, `../runtime.js`, and local assets through `../../assets/`. No build step or package install is needed.

To use the kit elsewhere, copy `design/` and `assets/` together, retaining their sibling relationship and license files. If moving the HTML, update its dependency paths. CSS asset URLs resolve relative to `system.css`.

The template contains Zeyad's real copy and contact links. Replace personal content deliberately before adapting it for another person. Section fragments are snippets for insertion into a page, not standalone previews.

## Ownership

- `../index.html` is the live portfolio.
- CSS, JavaScript, and templates here are extracted snapshots, not an automatic second build source.
- `tokens.json` is a reference catalog; the browser does not load it.
- `../assets/identity/manifest.json` records Baseline as the active identity.
- `snapshot.json` describes this kit; it is not an Open Design runtime contract.
- [source/save_snapshot.py](source/save_snapshot.py) is the original snapshot construction recipe, retained for provenance. It predates the motion follow-up and refuses changed baselines or existing outputs; it does not synchronize this kit.

The kit reuses local fonts, imagery, SVGs, and Lenis. App caches, version history, and unrelated workspace files are excluded. No post-write previews or tests were performed.


The current snapshot includes a transparent header, the original foreground block patterns in responsive content rows, and a redesigned education section with a date timeline, prominent university heading, and grouped qualification fields. The [education fragment](templates/partials/education.html) is available for reuse. The shared backdrop is removed; the current runtime includes screen-fit sections and accessible mobile story flow.
