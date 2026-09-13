# Portfolio design kit

Saved on 2026-09-12 from the existing portfolio after **Baseline / option 3** was selected. [The live portfolio](../index.html) remains canonical and was not changed when saving this kit.

| File | Use |
| --- | --- |
| [Design document](../DESIGN.md) | Direction, hierarchy, layout, identity, and interaction principles |
| [Implementation guide](IMPLEMENTATION.md) | Component hooks, scroll formulas, dependencies, and editing guidance |
| [Content inventory](CONTENT.md) | Copy, skills, dates, metrics, and contact destinations |
| [Tokens](tokens.json) | Exact default variables and responsive/forced-color overrides |
| [Styles](system.css) | Reusable stylesheet, including tokens and layout primitives |
| [Interaction code](runtime.js) | Existing navigation, scenes, skills, and motion |
| [Full-page template](templates/portfolio.html) | Runnable source snapshot |
| [Template guide](templates/README.md) | Section snippets and reuse instructions |
| [Snapshot manifest](snapshot.json) | Input hash, dependencies, saved-file inventory |
| [Identity guide](../identity/guide.md) | Logo files and usage rules |
| [Generation prompts](../identity/prompts.md) | Existing identity exploration prompts |

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
- [source/save_snapshot.py](source/save_snapshot.py) is the construction recipe. It refuses changed baselines and existing output files; do not rerun it expecting in-place synchronization.

The kit reuses local fonts, imagery, SVGs, and Lenis. App caches, version history, and unrelated workspace files are excluded. No post-write previews or tests were performed.
