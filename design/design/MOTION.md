# Motion follow-up

Applied using the selected `emilkowalski-motion` workflow. This pass changes local feedback and entry motion while retaining copy, layout, Baseline branding, and the existing scroll story.

## Motion moments

| Moment | Behavior |
| --- | --- |
| Hero entry | One readable 12px rise, 320ms per group; 40ms offsets capped at 80ms; the whole entrance ends within 400ms |
| Skills selection | Immediate content/state change; one 200ms group entrance from 8px left or right according to category order |
| Hover and focus | 200ms ease-out feedback using the existing cubic-bezier curve |
| Return | 140ms ease-in return for arrows, labels, rules, and surface emphasis |
| Press | Small positional feedback declared after hover states, including mouse and touch |

Hero elements start at 85% opacity, with normal readable source beneath the animation. Entry is skipped for deep links and restored scroll positions beyond the header. Wheel, touch, pointer press, keyboard input, reduced motion, and page suspension cancel it. It does not replay after visiting another section or returning through browser history.

Skills no longer stagger every tile. The whole category arrives together, retaining the reserved group height, selected-state attributes, a screen-reader-only live count, and button focus. Repeated clicks cancel superseded animations and show the latest requested category immediately.

## Stage and contact refinement

A second focused pass adds two moments using the existing 200ms control timing and ease-out curve:

| Moment | Behavior |
| --- | --- |
| Pinned stage change | New content, count, and selected step update immediately; the incoming content group moves 8px from below when advancing or above when reversing, from 85% to full opacity |
| Contact-card entrance | Each card enters once when visible, rising 12px in 200ms; cards entering together use 40ms offsets capped at 80ms, finishing within 280ms |

The stage entrance settles even when scrolling stops. It replaces the former per-stage 12px displacement around the boundary; heading color, geometric poses, progress, and KPI emphasis remain linked to scroll. A rapid stage change cancels the previous group animation. Initial stage selection, measurement, and offscreen changes remain still.

Contact cards are readable before JavaScript runs. Cards below the viewport wait until they enter it, including vertically stacked cards on mobile. Pointer entry, pointer press, and keyboard focus immediately settle the affected card. Entrances do not replay when revisiting Contact or restoring from browser history. No extra observer or timer is needed: visibility reads share the existing render loop.

Both moments skip animation with reduced motion or unavailable Web Animations. Resize measurement and page suspension cancel active motion. `--state-offset` centralizes the stage displacement; existing control, stagger, and entry-offset tokens govern the remaining values.

## Logo interaction

The header now uses an inline copy of the selected Baseline symbol. On hover or keyboard focus, the upper rail moves 16 SVG units right and the lower rail moves 16 units left, aligning their starting edges. The blue square rises 48 units and makes one quarter turn to meet the upper rail; an opacity overlay brightens that rail. The 48px logo box never moves during hover or changes the header layout.

Rails settle in 200ms. The terminal uses the existing 320ms entrance with a 40ms offset, finishing within 360ms. Leaving reverses from the current position in 140ms with no delay. The pose holds while engaged, with no repeating loop. Pressing scales the mark to 96%. Touch retains normal home navigation without depending on hover.

CSS transitions handle interruptions and reversal without extra listeners or animation instances. Browser reduced motion and the existing motion-off state retain the resting geometry, with an immediate highlight and the normal visible focus ring. Forced colors inherit the existing system palette. The favicon and source identity asset remain static.

## Preferences and lifecycle

The earlier foreground motion passes animate transform and opacity and added no new libraries. Existing ambient diagram movement and nav scrubbing are retained because the user explicitly requested them earlier; they are exceptions to the skill's quieter default.

The runtime tracks its own Web Animations and releases finished or canceled instances. It suspends work when hidden, disconnects observers on pagehide, removes listeners on final departure, and reconnects observers when restored from the back-forward cache. Resize timers and animation frames are canceled during suspension. Browser reduced-motion preference still disables automatic motion and pinning.

## Editable sources

The live source is `../index.html`. Extracted copies are `system.css` and `runtime.js`; `templates/portfolio.html` already loads those files and receives the same motion pass. The token catalog and snapshot manifest are refreshed. The header markup and reusable header snippet include the inline logo needed for its CSS interaction.

This document records authored source behavior. No post-write browser previews, renders, or tests were performed.



## Restored foreground patterns

The original Hero, About, Work, Contact, and footer block patterns are restored with their existing scroll poses, fine-pointer depths, and subtle ambient offsets. The current runtime continues to interpolate About and Work poses from the active stage or mobile reading progress. Larger figures sit outside mobile sticky tools; moving decoration never covers content or controls.

All SVG frames add eight units of clearance on every edge. Source inspection found the original Hero close to its frame limits and the footer slightly beyond them under conservative combined pointer, ambient, and scroll travel. Padding keeps the unchanged motion inside the viewBox. SVGs preserve their full ratio, with responsive width caps and automatic height.

Offscreen and hidden-page suspension, browser reduced motion, stage transitions, and the stable mobile resize behavior remain. No background renderer or new dependency is introduced.


## Mobile story continuity

Phone chapters remain in normal flow, with selected steps, foreground marker positions, heading reveals, and KPI emphasis driven by reading position. Their content is never swapped out while scrolling. The tools row stays sticky only when it leaves sufficient reading space. Flow navigation offsets and focus account for that row. Desktop stage swapping remains fit-gated and interruptible. Mobile browser-bar resizing no longer triggers an unconditional unpin/re-pin and scroll restoration.

The continuously moving Three.js/Canvas background and its static fallback are removed. Browser reduced motion still disables foreground movement and desktop pinning while retaining all chapter navigation and readable content.

## Stable stage composition

The reserved largest-stage space now top-aligns incoming content, keeping each heading at the same resting position. The existing 200ms directional entrance is unchanged. A small blue square appears beside the emphasized KPI value using the existing 200ms enter / 140ms return timing. Selected stage squares and progress use royal blue. These are state cues; no new animation loop or dependency is added. Existing reduced-motion rules disable transitions, and all content remains readable in flow mode.

## Keyboard interruption

Native page-scroll keys stop any active Lenis tween while a link has focus, as well as when the document is focused. Buttons and summaries keep Space activation, and editing widgets retain their key handling. The old navigation completion callback is invalidated so it cannot move focus after interruption. Existing timing, reduced-motion behavior, and animation cleanup are unchanged.
