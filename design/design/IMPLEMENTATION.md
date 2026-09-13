# Implementation guide

This describes the portfolio source saved on 2026-09-12. [system.css](system.css) and [runtime.js](runtime.js) implement that page structure rather than a generic component framework.

## Load order and scaffold

The full-page template loads local Space Mono fonts, Lenis CSS, `system.css`, Lenis JavaScript, then `runtime.js`. The runtime is an immediately invoked function and runs after the markup exists.

Retain `html[data-motion="off"]` as the initial state. Motion is enabled after fonts settle when browser preference permits it. The required scaffold includes `.site-header`, `.viewport-probe`, `main`, and the footer's `#year`. Every decorative `[data-art]` needs an ancestor `[data-scene-scope]`. Do not attach this runtime to isolated snippets without that scaffold.

There is no backend or build step required to open the page. Contact links use existing destinations. This page has no forms, server responses, loading lists, or empty-result flows to add to its state model.

## Styles and tokens

Edit the root custom properties in `system.css` for template changes. For live-site changes, edit corresponding inline styles in `../index.html`, then refresh the kit deliberately. `tokens.json` records exact default values and media overrides but does not generate CSS.

Keep the first `@layer od-layout` and marker comments. Compose normal-flow content with `.od-stack`, `.od-row`, `.od-grid`, `.od-field`, and `.od-stat`. Header height, scene panel height, tallest stage height, and tallest skills-group height are measured at runtime; preserve their responsive measurements.

## Navigation

Section anchors are `#home`, `#about`, `#work`, and `#links`; Contact is the visible label for `#links`. `#main` is the skip-link target. Preserve ordinary links, hash navigation, browser back/forward, and native keyboard input.

The active section gets `aria-current="location"`. Bold measuring text prevents nav width changes. Scrub slices are decorative and retain `aria-hidden="true"`. Anchor scrolling accounts for measured header height and moves focus after arrival. Stage buttons retain focus after seeking.

## Pinned stories

Each `.story-track[data-story]` needs `.story-panel`, `.stage-nav`, `.story-frame`, `.story-visual` inside `.story-frame` before `.stage-stack`, `.stage-stack`, `[data-stage]` articles, `.story-progress`, `.stage-count`, `.progress-line`, and `.progress-marker`. Provide one `data-stage-button` per article, indexed from zero.

Current identifiers are `about` and `work`. A figure's matching `data-art` ties it to that story. IDs must be unique; buttons, stages, and geometry poses must stay in the same order.

Before pinning, the runtime measures every complete stage panel. Pinning requires a width of at least 768px, enabled motion, sticky support, at least 360px available height, and a tallest panel no larger than the available height minus 2px. Otherwise `.is-flow` exposes all articles and working stage controls. `.has-sticky-tools` applies only when its tools row leaves at least 70% of the panel height for content and the panel is at least 240px tall.

```text
screenHeight = measured stable viewport probe (100svh, or 100vh fallback)
panelHeight = floor(screenHeight - measuredHeaderHeight)
step = panelHeight (pinning is used only at widths of 768px or more)
travel = step * stageCount
wrapperHeight = panelHeight + travel
start = wrapperDocumentTop - measuredHeaderHeight
progress = clamp((scrollY - start) / travel, 0, 1)
position = progress * stageCount
activeStage = min(stageCount - 1, floor(position))
```

About has three stages; Work has two. On desktop a three-stage wrapper is approximately four panel heights including its sticky panel. Phones use normal chapter scrolling without synthetic travel distance. The panel releases at the wrapper's end, with no snapping.

Only the active article is shown while pinned. On a stage change, the content, count, and selected step update immediately. The incoming stack enters over 200ms from an 8px vertical offset and 0.85 opacity; forward changes rise from below, reverse changes settle from above. Superseded animations are canceled. Initial selection, measurement, and offscreen changes skip the entrance. The group settles even if scrolling stops. Geometry transitions toward the next arrangement late in the stage. Upward scrolling reverses progress. Stage buttons seek to `(index + 0.4) * step`. Resize restores the reading anchor or stage progress when practical. `unpin()` removes measured scene heights and exposes all stages.

## Geometry and headings

Decorative SVGs use natural viewBox ratios and non-scaling strokes. Moving groups separate three transforms:

```html
<g class="scroll-unit" data-poses="0,0,1;16,16,.85">
  <g class="pointer-unit" data-depth="0.8">
    <g class="ambient-unit" style="--phase:-1s">
      <!-- Source geometry -->
    </g>
  </g>
</g>
```

Each pose is `x,y,scale`; semicolons separate stages. Pointer movement applies only to fine pointers, not touch. Ambient drift pauses offscreen and in background tabs. Keep horizontal, vertical, and angled linework consistent across diagrams.

Heading words gain an `aria-hidden` duplicate color layer. The original stays readable in light gray as the final-color layer appears. Preserve actual accessible text and do not replace headings with bitmap lettering.

## Skills

Each `data-skill-filter` matches a `data-skill-group`; `aria-controls` matches the group's unique ID. Filters use `aria-pressed`. A visually hidden polite status reports the category and actual count to screen readers; no repeated category/count line appears above the tiles. All groups are measured to reserve the tallest height at the current width. The selected group animates together for 200ms with an 8px directional entrance based on category order. A new selection cancels the previous group animation immediately; tiles are not individually staggered.

When adding a category, include a filter, group, and uniquely identified heading. Informational tiles remain list items, not inert buttons. Without JavaScript all categories stay readable; reduced motion cancels tile animations.

## Metrics and contact

KPI cards are content: a block value, label, and visible explanatory paragraph. Numbers and units stay together. Runtime emphasis advances through metrics in a pinned role or follows proximity to the reading line in normal flow; it does not hide their descriptions.

Contact cards use a square ratio, content-driven minimum size, and auto-fit columns. Each card has a one-time 200ms entrance when visible: 12px rise, opacity 0.85 to 1, and 40ms offsets capped at 80ms for cards appearing together. Pointer entry, pointer press, and keyboard focus immediately cancel that card's motion. Visibility reads share `paint()`; all cards stay readable without animation. All labels share `--contact-size`. Arrows have 44px boxes. Hover, focus, and active states are authored together. For longer labels, adjust shared sizing or the container instead of truncating the action or shrinking a single card's font.

## Input and reduced motion

Lenis uses `lerp:0.14` for wheel smoothing; touch remains native with `syncTouch:false`. Native page-scroll keys cancel an earlier smooth-scroll tween even when a link has focus. Space activation on buttons and summaries, editing controls, and already-handled key events retain their own behavior. Programmatic navigation takes 0.36 seconds with smoothing enabled. If Lenis is unavailable, navigation falls back to native scrolling.

Use the browser preference without visible on/off or stop-sequence controls. Reduced motion removes transitions and animations, cancels relevant Web Animations, disables pinning, and exposes all content. Forced colors use system colors, hide decorative scenes, and underline selected controls.

## Assets and content

The active identity source and favicon are `assets/identity/baseline/symbol.svg`. The header in the live page, full-page template, and header partial uses matching inline SVG geometry: `.logo-rail-top`, `.logo-rail-bottom`, and `.logo-terminal`. CSS responds to the home link's hover and focus-visible states; no JavaScript listeners are needed. Preserve its accessible link name and keep the SVG aria-hidden and focusable="false". `--logo-rail-shift` and `--logo-terminal-travel` are SVG user-space distances; `--logo-press-scale` controls pointer/touch press feedback. Reduced motion and `data-motion="off"` suppress all logo transforms while leaving an immediate upper-rail highlight. Hero lettering remains real Space Mono text. IBM lettering has a 960 by 381 ratio and renders full-frame. Keep font and Lenis licenses when copying assets. See [the identity guide](../identity/guide.md) and [content inventory](CONTENT.md).

Renaming a section requires updating anchors and labels. Changing stage count requires matching buttons and poses. Preserve user-confirmed metrics and time windows. The saved source adds no new career claims.

## Status

The saved styles and runtime include [the motion follow-up](MOTION.md): readable hero entry, immediate skills transitions, directional stage changes, once-per-card contact entrances, unified control feedback, and tracked animation/listener/observer cleanup with back-forward-cache restoration. No page was rendered, previewed, screen-captured, or tested. Behavior descriptions come from the authored source.



## Foreground layout revision

The header uses a transparent fill with `--header-blur:12px`, preserving its sticky position, measured height, border, and focus states. A small text shadow supports navigation contrast; forced colors use `Canvas` without blur or shadow.

Place `.story-visual` first inside `.story-frame`, followed by `.stage-stack`. `.story-top` owns employer identity and stage controls only. Preserve each restored figure's `data-art`, `.scroll-unit > .pointer-unit > .ambient-unit` nesting, poses, depths, and phases. Both pinned and flow presentations use the existing runtime to update the same selected step and SVG pose interpolation. The restored patterns need no runtime change.

The content frame uses a bounded decorative column and `minmax(0,1fr)` for readable content, switching to one column below 768px. Figure sizing uses natural height, a container-bounded width, and separate `--story-art-width` and `--work-art-width` tokens. The hero also caps width against available viewport height. The SVG viewBox padding leaves room for existing motion; do not restore the tighter historical frame or force the tall Work figure into a square.

The education row is the first child of `.about-support`. Its two children are `.education-timeline` and `.education-content`, aligned to the shared rail and text column. Dates remain semantic `time` elements with separate month/year blocks and a screen-reader separator. The connecting rule is decorative. Qualification fields use a `dl`, `dt`, and `dd` structure. Use [the education partial](templates/partials/education.html) for this complete block. The support container is now one column, with skills following the education row. New art-width and education-type tokens live in the same source stylesheet and token catalog. The shared backdrop, fallback wrapper, vendor bundle, and dedicated runtime have been removed.

## Mobile sizing and flow navigation

`--viewport-height` resolves to 100svh when supported, with 100vh as a fallback. The zero-width probe and start/finish section minimum heights use that same value; header height is measured after fonts settle. Visible heading/contact progress uses `visualViewport.height` at normal zoom, falling back to `innerHeight`. It does not use the changing visible height to rebuild story wrappers.

In flow mode, no article is hidden. `selectStage()` updates selected buttons and the count without toggling visibility. Reading position advances the foreground marker and `--flow-progress` rule. `showStage()` retains visibility switching exclusively for pinned stages. Button `aria-controls` values point to runtime-assigned stage IDs. Flow buttons navigate to the real heading ID and move keyboard focus there; pinned buttons keep their existing seek behavior and button focus. Flow anchor offsets include a sticky tools row only when it is enabled.

`scheduleLayout()` compares layout width, the stable viewport probe, and measured header height before rebuilding. Toolbar-only visible-viewport changes request a repaint. Real size changes remeasure and restore the reading anchor. Flow controls stay in normal flow if they would obscure too much of a short screen. This is a source-level repair; there was no browser reproduction or post-write test run.

## Restored geometry input

The five foreground SVG compositions came from root version 22, before the compact rail revision. Only their frame dimensions were expanded by 16 total SVG units per axis; all shapes and poses are retained. The current root remains canonical. The fit audit was source-based: original rectangle extents, authored motion limits, full-frame ratios, grid widths, and the complete-stage fit gate. No visual-device verification is claimed.

## Shared composition grid

The final composition rule block in the canonical stylesheet applies the approved alignment and hierarchy pass. `--layout-rail` and `--layout-gap` align `.intro-row`, `.story-top`, `.story-frame`, `.story-progress`, and `.about-support > div`. The education row spans the existing full width. On phones the grid becomes one column and story controls remain separate from artwork.

Keep `.is-pinned .stage-stack` top-aligned inside its measured `--stage-height`. Centering the active child would make shorter stages move their heading vertically. `.story-frame` centers the reserved group within the available panel row. The existing runtime still measures complete stages and falls back to flow; its code is unchanged.

Metrics keep their source markup and `data-emphasis` behavior. The emphasis now controls `.kpi-value::after`, a small blue square, instead of a broad card fill. Metric text aligns with the role text because card horizontal padding is zero. Hover retains the brief value movement; forced colors and reduced motion use the existing preferences.

## Reflow and input polish

`.role-body` establishes the named `work-content` inline-size container. At 36rem or less, its role metadata stacks and `.kpi-grid` becomes one column. Inline-size containment leaves the block height content-driven, so existing scene measurement sees the complete reflowed stage. The existing viewport fallback remains for browsers without container queries.

On phone layouts, the header nav spans a definite full-width grid row and establishes `portfolio-nav`. Below 17rem it balances links in two columns. The measured header height still controls story offsets and available viewport space. Do not apply inline containment to the desktop nav's intrinsic-width column.

`.contact-links` explicitly uses `--contact-size` so the `8ch` term in `--contact-card-min` measures its actual labels. The width also reserves padding, both borders, and horizontal label travel. Update the character budget when adding a longer contact label. The work fragment preserves the text “Over 80%” with a `.kpi-qualifier` span to distinguish the qualifier from the value.

The page-scroll key handler never calls `preventDefault()`. It stops Lenis and invalidates a pending navigation-focus callback before native scrolling proceeds. Keys in editing widgets and Space on activation controls are left alone. Loading, empty, and submission-error states are not added: this portfolio has no remote-data or form-submission flow.

## University section layout

Use the complete education partial with its `education-label` and `education-title` IDs once per page. The aside's accessible name combines both. `.education-content` has inline-size containment; its block height remains content-driven. At a content width of 36rem or less, the degree and concentration stack. At a viewport width of 48rem or less, the outer grid stacks and `.education-range` becomes a horizontal timeline. The viewport rule also supplies the single-column fallback without container-query support. Reuse the existing spacing and blue-marker tokens; title and year sizes have dedicated editable tokens. No runtime change is required.

## Skills rail

Each `.skill-tiles.od-rail` list has `tabindex="0"` and is labelled by its existing category heading. Native keyboard arrows, touch swipes, trackpad gestures, and the scrollbar can reach horizontally overflowing tiles. Flex items do not shrink or wrap; labels use `white-space:nowrap`. Overflow stays inside the full-width list. Vertical padding keeps the existing 4px hover movement clear of the scrollport edge. The runtime still reserves the largest category height and retains each list's own horizontal scroll position across category changes. No new JavaScript is required. Source authoring only; no post-write browser checks or tests.
