# Zeyad Omran / Identity directions

Baseline (option 3) is the selected identity. The portfolio at `index.html` uses `assets/identity/baseline/symbol.svg` in its header and as its favicon. Open `identity/index.html` for the identity assets and comparison.

## Files and editability

Each directory under `assets/identity/` contains six editable, transparent SVG assets and one generated concept board. Lettering is outlined from local Space Mono; SVGs require no font download or external service. Path groups have descriptive IDs for symbol edits.

Color tokens live once inside each SVG: `--identity-ink`, `--identity-line`, and `--identity-accent`. The supplied single-color versions are black artwork for light backgrounds. To make a white single-color version, change all three values to `#F5F7FA` in a sibling copy.

The source inputs are in `identity/source/`: exact prompts and board dimensions in `generation.json`, font-derived geometry in `wordmark-paths.json`, and the construction recipe in `build.py`. The recipe protects existing output files from replacement. Edit a copied asset when exploring changes.

Space Mono is licensed under the SIL Open Font License 1.1. See [the local license](../assets/OFL-SpaceMono.txt). The portfolio keeps its existing local font assets.

## Shared palette

| Role | Value | Use |
| --- | --- | --- |
| Background | `#000000` | Main identity canvas and portfolio |
| Foreground | `#F5F7FA` | Name and primary filled shapes |
| Neutral | `#B8B8B8` | Panel outlines, rails and supporting rules |
| Accent | `#4C70F0` | One cursor, plane or terminal per mark |

Use the full-color assets on black. Use the black single-color assets on a plain light background. Preserve transparent margins and the native viewBox; use width with height:auto, never stretch, crop or apply object-fit:cover.

## Shared restrictions and motion

Do not add gradients, glow, shadows, rounded corners, extra accent colors, slogans, mirrored geometry or artificial letter spacing to an exported lockup. Keep symbol and wordmark proportions fixed. The route names Panel, Fold and Baseline label this study; they are not part of the brand name.

Motion is optional. Use 200ms transform or opacity feedback on hover and keyboard focus, and restore the resting state on exit. Do not animate name lettering, layout dimensions or logos continuously. Under prefers-reduced-motion:reduce, use the complete static identity.

## About the generated boards

The PNGs are AI-generated exploration boards. Their lighting effects and any extra specimen labels are not identity rules. Use the flat SVG assets for implementation. No preview, rendering or validation run was performed; the marks are new constructions for this study.

## 01 / Panel

Separate interface panels form a Z beside an open rectangular O. A blue cursor gives the system one point of focus.

**Wordmark:** Uppercase / Space Mono Regular.

**Color:** Neutral linework carries the symbol. White carries the name. Blue belongs only to the cursor.

**Clear space:** reserve at least 16 design units around the visible symbol on its 200-unit canvas. This is one structural unit; the SVG already includes more than this margin. For lockups, keep the exported padding and add at least one capital height of whitespace around neighboring text or controls.

**Minimum displayed sizes:** full-color symbol 48px wide; single-color symbol 32px; standalone wordmark 240px; horizontal lockup 240px; stacked lockup 200px. These are construction rules, not claims of rendered testing.

**Small-size treatment:** Below 48px, use the heavier single-color symbol. Do not use the outlined version below 48px or the single-color symbol below 32px.

**Optional interaction:** Move the cursor by one grid step on hover or focus, then return it. Keep the outlined panels stationary.

**Files:**

- [Symbol](../assets/identity/panel/symbol.svg)
- [Wordmark](../assets/identity/panel/wordmark.svg)
- [Horizontal lockup](../assets/identity/panel/lockup-horizontal.svg)
- [Stacked lockup](../assets/identity/panel/lockup-stacked.svg)
- [Single-color symbol](../assets/identity/panel/symbol-mono.svg)
- [Single-color lockup](../assets/identity/panel/lockup-mono.svg)

**Use in the portfolio header after selecting this route:**

```html
<a href="#home" class="brand" aria-label="Zeyad Omran, home">
  <img class="brand-logo" src="assets/identity/panel/symbol.svg"
       width="200" height="200" alt="">
</a>
```

```css
.brand-logo { display: block; width: 48px; height: auto; }
```

## 02 / Fold

A broad Z folds around an angular O counter. One small blue plane identifies the terminal without weakening the silhouette.

**Wordmark:** Uppercase / Space Mono Bold.

**Color:** White defines the mass of the monogram. One rectangular plane carries blue; no extra colored faces are added.

**Clear space:** reserve at least 16 design units around the visible symbol on its 200-unit canvas. This is one structural unit; the SVG already includes more than this margin. For lockups, keep the exported padding and add at least one capital height of whitespace around neighboring text or controls.

**Minimum displayed sizes:** full-color symbol 32px wide; single-color symbol 24px; standalone wordmark 200px; horizontal lockup 240px; stacked lockup 200px. These are construction rules, not claims of rendered testing.

**Small-size treatment:** Use the single-color silhouette below 32px. Its open counter and broad diagonal remain the defining elements; stop at 24px.

**Optional interaction:** Shift the blue terminal by at most one quarter of its width on hover or focus. Keep the main silhouette fixed.

**Files:**

- [Symbol](../assets/identity/fold/symbol.svg)
- [Wordmark](../assets/identity/fold/wordmark.svg)
- [Horizontal lockup](../assets/identity/fold/lockup-horizontal.svg)
- [Stacked lockup](../assets/identity/fold/lockup-stacked.svg)
- [Single-color symbol](../assets/identity/fold/symbol-mono.svg)
- [Single-color lockup](../assets/identity/fold/lockup-mono.svg)

**Use in the portfolio header after selecting this route:**

```html
<a href="#home" class="brand" aria-label="Zeyad Omran, home">
  <img class="brand-logo" src="assets/identity/fold/symbol.svg"
       width="200" height="200" alt="">
</a>
```

```css
.brand-logo { display: block; width: 48px; height: auto; }
```

## 03 / Baseline

Lowercase lettering sits on two offset lines. The compact symbol repeats those baselines as two rails and a square terminal.

**Wordmark:** Lowercase / Space Mono Regular.

**Color:** White gives the name priority. Neutral rails support it. Blue marks the endpoint of the reading line.

**Clear space:** reserve at least 16 design units around the visible symbol on its 200-unit canvas. This is one structural unit; the SVG already includes more than this margin. For lockups, keep the exported padding and add at least one capital height of whitespace around neighboring text or controls.

**Minimum displayed sizes:** full-color symbol 32px wide; single-color symbol 24px; standalone wordmark 160px; horizontal lockup 240px; stacked lockup 200px. These are construction rules, not claims of rendered testing.

**Small-size treatment:** Use the rails-only symbol below the wordmark minimum. For a single-color application, retain both rails and the terminal square; stop at 24px.

**Optional interaction:** Reveal the second rail and terminal together in a short opacity transition. Keep the lettering still.

**Files:**

- [Symbol](../assets/identity/baseline/symbol.svg)
- [Wordmark](../assets/identity/baseline/wordmark.svg)
- [Horizontal lockup](../assets/identity/baseline/lockup-horizontal.svg)
- [Stacked lockup](../assets/identity/baseline/lockup-stacked.svg)
- [Single-color symbol](../assets/identity/baseline/symbol-mono.svg)
- [Single-color lockup](../assets/identity/baseline/lockup-mono.svg)

**Current portfolio header integration:**

```html
<a href="#home" class="brand" aria-label="Zeyad Omran, home">
  <img class="brand-logo" src="assets/identity/baseline/symbol.svg"
       width="200" height="200" alt="">
</a>
```

```css
.brand-logo { display: block; width: 48px; height: auto; }
```

## Choosing a route

- Panel preserves the most continuity with the existing outlined ZO mark.
- Fold gives the compact symbol the strongest visual weight.
- Baseline puts the person and the name ahead of the monogram.

Baseline is selected and applied to the portfolio header and favicon. Panel and Fold remain available as reference alternatives in the companion page.
