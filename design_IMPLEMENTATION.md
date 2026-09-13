# Implementation guide

This describes the portfolio source saved on 2026-09-12. [system.css](system.css) and [runtime.js](runtime.js) implement that page structure rather than a generic component framework.

## Load order and scaffold

The full-page template loads local Space Mono fonts, Lenis CSS, `system.css`, Lenis JavaScript, then `runtime.js`. The runtime is an immediately invoked function and runs after the markup exists.

Retain `html[data-motion="off"]` as the initial state. Motion is enabled after fonts settle when browser preference permits it. The required scaffold includes `.site-header`, `.viewport-probe`, `main`, and the footer's `#year`. Every decorative `[data-art]` needs an ancestor `[data-scene-scope]`. Do not attach this runtime to isolated snippets without that scaffold.

There is no backend or package build. Contact links use existing destinations. This page has no forms, server responses, loading lists, or empty-result flows to add to its state model.

## Styles and tokens

Edit the root custom properties in `system.css` for template changes. For live-site changes, edit corresponding inline styles in `../index.html`, then refresh the kit deliberately. `tokens.json` records exact default values and media overrides but does not generate CSS.

Keep the first `@layer od-layout` and marker comments. Compose normal-flow content with `.od-stack`, `.od-row`, `.od-grid`, `.od-field`, and `.od-stat`. Header height, scene panel height, tallest stage height, and tallest skills-group height are measured at runtime; preserve their responsive measurements.

## Navigation

Section anchors are `#home`, `#about`, `#work`, and `#links`; Contact is the visible label for `#links`. `#main` is the skip-link target. Preserve ordinary links, hash navigation, browser back/forward, and native keyboard input.

The active section gets `aria-current="location"`. Bold measuring text prevents nav width changes. Scrub slices are decorative and retain `aria-hidden="true"`. Anchor scrolling accounts for measured header height and moves focus after arrival. Stage buttons retain focus after seeking.

## Pinned stories

Each `.story-track[data-story]` needs `.story-panel`, `.stage-nav`, `.story-frame`, `.story-visual`, `.stage-stack`, `[data-stage]` articles, `.story-progress`, `.stage-count`, `.progress-line`, and `.progress-marker`. Provide one `data-stage-button` per article, indexed from zero.

Current identifiers are `about` and `work`. A figure's matching `data-art` ties it to that story. IDs must be unique; buttons, stages, and geometry poses must stay in the same order.

Before pinning, the runtime measures every complete stage panel. Pinning requires enabled motion, sticky support, at least 360px available height, and a tallest panel no larger than the available height minus 2px. Otherwise all articles appear in normal flow and stage controls remain hidden.

```text
screenHeight = min(innerHeight, measured 100svh)
panelHeight = floor(screenHeight - measuredHeaderHeight)
step = panelHeight * (viewportWidth < 768 ? 0.7 : 1)
travel = step * stageCount
wrapperHeight = panelHeight + travel
start = wrapperDocumentTop - measuredHeaderHeight
progress = clamp((scrollY - start) / travel, 0, 1)
position = progress * stageCount
activeStage = min(stageCount - 1, floor(position))
```

About has three stages; Work has two. On desktop a three-stage wrapper is approximately four panel heights including its sticky panel. Mobile shortens each stage's travel when pinning can fit. The panel releases at the wrapper's end, with no snapping.

Only the active article is shown while pinned. Entry/exit use a 12px vertical displacement and opacity from 0.8 to 1, around the first/last 14% of a stage. Geometry transitions toward the next arrangement late in the stage. Upward scrolling reverses progress. Stage buttons seek to `(index + 0.4) * step`. Resize restores the reading anchor or stage progress when practical. `unpin()` removes measured scene heights and exposes all stages.

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

Each `data-skill-filter` matches a `data-skill-group`; `aria-controls` matches the group's unique ID. Filters use `aria-pressed`. A polite status reports the category and actual count. All groups are measured to reserve the tallest height at the current width. Tiles animate using the control duration and 40ms stagger, capped at five stagger steps.

When adding a category, include a filter, group, and uniquely identified heading. Informational tiles remain list items, not inert buttons. Without JavaScript all categories stay readable; reduced motion cancels tile animations.

## Metrics and contact

KPI cards are content: a block value, label, and visible explanatory paragraph. Numbers and units stay together. Runtime emphasis advances through metrics in a pinned role or follows proximity to the reading line in normal flow; it does not hide their descriptions.

Contact cards use a square ratio, content-driven minimum size, and auto-fit columns. All labels share `--contact-size`. Arrows have 44px boxes. Hover, focus, and active states are authored together. For longer labels, adjust shared sizing or the container instead of truncating the action or shrinking a single card's font.

## Input and reduced motion

Lenis uses `lerp:0.14` for wheel smoothing; touch remains native with `syncTouch:false`. Native keyboard scrolling cancels an earlier wheel tween. Programmatic navigation takes 0.36 seconds with smoothing enabled. If Lenis is unavailable, navigation falls back to native scrolling.

Use the browser preference without visible on/off or stop-sequence controls. Reduced motion removes transitions and animations, cancels relevant Web Animations, disables pinning, and exposes all content. Forced colors use system colors, hide decorative scenes, and underline selected controls.

## Assets and content

The active logo is `assets/identity/baseline/symbol.svg`. Hero lettering remains real Space Mono text. IBM lettering has a 960 by 381 ratio and renders full-frame. Keep font and Lenis licenses when copying assets. See [the identity guide](../identity/guide.md) and [content inventory](CONTENT.md).

Renaming a section requires updating anchors and labels. Changing stage count requires matching buttons and poses. Preserve user-confirmed metrics and time windows. The saved source adds no new career claims.

## Status

This is a source extraction and documentation pass. No page was rendered, previewed, screen-captured, or tested. Behavior descriptions come from the current source. The root portfolio remains byte-for-byte unchanged.
