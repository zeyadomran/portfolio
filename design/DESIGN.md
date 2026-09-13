# Zeyad Omran - portfolio design

This records the existing portfolio after **Baseline / option 3** was selected. The editable source of truth is [index.html](index.html). The reusable kit is indexed in [design/README.md](design/README.md).

## Purpose and character

The portfolio introduces Zeyad as a software developer interested in intuitive interfaces, human-computer interaction, practical AI tools, and simpler workflows. It leads from a personal introduction through interests and work to contact links. Its audience includes hiring teams, collaborators, and people exploring his work.

The visual character is bold, monospaced, geometric, and mostly monochrome. Large type establishes attention; restrained royal blue marks a point of focus. Compact spacing uses the available screen area. Selected content stays pinned and changes with scroll progress, with ordinary scrolling between scenes.

## Decisions to preserve

| Area | Current decision |
| --- | --- |
| Product | Responsive website; no handset presentation shell |
| Ground | Pure black `#000000`; dark mode only |
| Type | Local Space Mono Regular and Bold for every role |
| Geometry | Square edges throughout; zero corner radius |
| Borders | Sparse, 1px, neutral light gray `#B8B8B8` |
| Accent | Royal blue `#4C70F0`, used sparingly |
| Identity | Baseline option 3: two offset rails with a blue terminal square |
| Header | Sticky transparent header, 12px backdrop blur, white navigation, bold current item, thin bottom rule |
| Start and finish | Hero and Contact fill the available viewport below the header and grow with content |
| Storytelling | Complete scrolling chapters on phones; larger screens pin only when all stage content fits |
| Motion preference | Browser reduced-motion preference; no visible motion toggle or stop-sequence buttons |

These decisions come from the user's revisions and current source. Numeric values below record implementation choices, not new user approvals. The current header is transparent with a light backdrop blur; its ground has no opaque fill. Forced colors use the system canvas for legibility.

## Color

| Token | Value | Role |
| --- | --- | --- |
| `--black` | `#000` | Page and navigation |
| `--surface` | `#101416` | Skill tiles and subtle interaction emphasis |
| `--text` | `#F5F7FA` | Primary text |
| `--muted` | `#B7C2CC` | Supporting text |
| `--line` | `#B8B8B8` | Rules, outlines, geometric strokes |
| `--accent` | `#4C70F0` | Logo terminal, hero period, scene accents |

Establish hierarchy through scale, weight, position, and space before adding borders. Pair color with weight, text, filled squares, or underlines for selection. Keep blue concentrated on small elements. Do not reintroduce green accents, gradient washes, glows, or rounded cards.

## Typography and hierarchy

The hero name is the strongest element: two lines, bold Space Mono, natural monospaced character spacing, and a blue square period. Active stage headings and role titles follow. KPI values receive emphasis before labels and descriptions. Section labels, dates, locations, and helper text stay quieter. Contact labels share one font, weight, and size.

| Role | Desktop source value |
| --- | --- |
| Name | `clamp(64px,11vw,160px)`; 700; line height 1.12 |
| Stage heading | `clamp(2.25rem,4.5vw,4rem)`; line height 1.2 |
| Role heading | `clamp(1.75rem,2.8vw,2.75rem)`; 700; line height 1.2 |
| Lead copy | Hero `clamp(1.25rem,2.4vw,2rem)`; other leads `clamp(1.25rem,2.2vw,1.75rem)`; line height 1.5 |
| Body | `1.125rem`; 400; line height 1.6 |
| Small copy | `1rem` |
| Navigation | `1.125rem` |
| KPI value | `clamp(2.25rem,3vw,3rem)`; 700; line height 1.15 |
| Contact label | `clamp(1.25rem,2vw,1.75rem)`; 700 |

Most prose uses 65ch or the 72ch reading-width token. Short hero and contact text use narrower measures. Authored headings and primary link labels are not truncated. Contact's title uses container-relative sizing and may wrap below a 20rem container width. Exact variables and overrides are in [tokens.json](design/tokens.json).

## Spacing and responsive layout

Spacing tokens are 4, 8, 16, 24, 32, 48, and 64px. Desktop content is capped at 1680px, with 32px gutters. Main content stays in normal grid or flex flow. Content regions grow rather than clip at larger text settings.

| Condition | Existing adaptation |
| --- | --- |
| Up to 1100px | Header columns and work-diagram width adjust |
| Up to 1023px | 24px gutters; 1rem body; Contact becomes one column |
| Up to 767px | 16px gutters; two-row header; stacked hero and story; single-column KPIs |
| Below 375px | Extra name-size and gap adjustments |
| Contact container up to 20rem | Contact heading can wrap |
| A scene cannot fit, or width is below 768px | All stages remain in ordinary flow with working stage navigation |

Hero and Contact use `min-height:calc(var(--viewport-height) - var(--header-height))`, with a zero lower bound. The viewport token uses 100svh where supported and 100vh otherwise. The sticky header remains in document flow and its measured height is subtracted once. Contact cards prefer a square ratio but can grow for content and reflow through auto-fit columns.

## Narrative and components

1. Hero: name, role, concise statement, work link, modular diagram.
2. About: introduction; Frontend, HCI, and AI agents stages; education; skills explorer.
3. Work: IBM lettering; Software developer and Front-End Developer Intern stages; summaries and seven metrics.
4. Contact: invitation and square Email, LinkedIn, and GitHub cards.
5. Footer: year, smaller diagram, and back-to-top link.

Diagrams share square-ended horizontal, vertical, and angular linework with a blue focus square. Composition and size vary by section. Decorative SVGs are hidden from assistive technology. Current work metrics have visible descriptions; earlier work accordions were superseded and are not part of this snapshot.

Preserve current copy, skills, dates, locations, metrics, and contact destinations when changing visuals. [The content inventory](design/CONTENT.md) records the source wording.

## Interaction and accessibility

Controls use 200ms ease-out feedback and 140ms ease-in returns. The one-time hero entry lasts 320ms with small group offsets capped at 80ms. Skills categories arrive together in 200ms rather than staggering every tile. Pinned stage changes use a 200ms directional 8px entrance. Contact cards rise 12px once when visible, over 200ms with small offsets capped at 80ms; pointer or keyboard interaction settles the affected card immediately. Existing 240ms nav scrubbing and independent 8-second decorative drift remain. Contact arrows, labels, and dark surfaces receive matching hover and focus feedback, with a smaller pressed position. See [the motion follow-up](design/MOTION.md).

Scroll drives the active stage, coordinated geometry, progress marker, heading-color reveal, and KPI emphasis. Scroll remains reversible, without forced snapping. Panels release at the end of their allocated distance. Header links and stage controls provide direct access.

Keep semantic controls, visible focus, 44px minimum control heights, and explicit selected states. Preserve native keyboard and touch input. Reduced motion shows a static reading presentation with all stages visible. Without JavaScript, core content and ordinary anchor links remain in the source. Forced colors use system colors and extra text cues.

These are source behavior and design requirements, not claims of device testing or accessibility certification.

## Selected identity

Use [Baseline's symbol](assets/identity/baseline/symbol.svg) as the identity source and favicon. The header uses an inline SVG copy of its exact resting geometry so its two rails and terminal can animate independently. It retains the 200 by 200 viewBox, 48px display size, and transparent padding. The home link names Zeyad; the decorative SVG is aria-hidden and not focusable. On hover or keyboard focus, the rails align and the blue terminal rises to the upper line with a quarter turn; the upper rail brightens. Reduced motion preserves the resting geometry with an immediate highlight.

The Baseline kit also contains outlined wordmark, horizontal and stacked lockups, and single-color variants. [The identity guide](identity/guide.md) records clear space and sizes. [The comparison](identity/index.html) retains Panel and Fold as alternatives. Generated concept boards are exploratory; flat editable SVGs are the implementation assets.

## Source and maintenance

[system.css](design/system.css) and [runtime.js](design/runtime.js) are extracted copies used by the full-page template. The live portfolio still keeps its own inline styles and script. Editing a kit file does not automatically change `index.html`.

This snapshot was saved on 2026-09-12. Refresh it deliberately after future approved changes. No preview, rendering, browser walkthrough, or tests were performed while saving the kit.



## Foreground diagrams and education layout

The original block compositions are restored from saved root version 22: the nine-panel hero, four-square About pattern, tall Work stack, six-panel Contact pattern, and four-block footer. Their horizontal, vertical, and angled strokes, blue squares, scroll poses, pointer depths, and ambient offsets come from that existing source. The separate background renderer remains removed.

Every SVG has eight additional viewBox units on each side, and width/height attributes match the padded ratio. The original footer's conservative motion envelope extended slightly beyond its frame; the padding accommodates it and adds clearance to the Hero edges. Figures render at their full natural ratio. Their containers never lock both dimensions or crop the artwork.

Hero artwork stays below its lead and work link, with width capped by its text column and available viewport height. About and Work figures sit in bounded grid columns beside their content on wider screens. Headings and body copy stack within the text column. On phones the artwork moves to a separate small row before the full-width stage content; it is outside the sticky controls. Complete-stage measurement continues to include artwork before desktop pinning. Tall content uses normal flow, preserving all text and the current mobile navigation.

Education uses the shared two-column grid with one top divider. A quiet Education label and a September 2019 to June 2024 timeline sit in the left rail. University of Calgary is the dominant heading on the right, followed by clearly paired degree and concentration fields. The complete dates become a horizontal timeline above the university on narrow or enlarged-text layouts. Degree details stack when their own column is narrow. BSc, Computer Science, Internship Program, and Human-Computer Interaction remain unchanged.


## Mobile reading and quiet background

The shared WebGL/Canvas backdrop and static fallback have been removed. Pure black is the page ground; the foreground SVGs and Baseline identity remain.

Below 768px, About and Work use complete, naturally scrolling chapters with no artificial scroll-distance wrapper or hidden stage content. The active step and foreground pattern follow reading progress. The tools row stays below the main header when it uses no more than 30% of the available panel height; on shorter or enlarged-text screens it stays in flow. Stage buttons jump to and focus the corresponding heading. Larger screens still use pinned scenes when every complete panel fits. Browser reduced motion keeps all content visible.

Phone browser-bar changes repaint visible progress without rebuilding the story tracks. Actual changes to layout width, stable viewport height, or header height restore the reading anchor. The source audit found the previous extra header height, hidden fallback controls, and unconditional resize rebuilds; these changes address those code paths. Device behavior has not been previewed or tested.

## Geometry restoration sizing

Figure width caps in pixels are: Hero 384 / 288 / 160, About 240 / 192 / 128, Work 112 / 96 / 64, Contact 256 / 256 / 160, and footer 160 / 160 / 144 for desktop / tablet / phone. These are implementation limits for the requested fit audit. Width is also bounded by the containing column; height stays automatic. Hero and Contact retain the available-viewport minimum and can grow on short screens or with enlarged text. Education and the mobile story repair are retained.

The audit inspected input source, SVG ratios, transforms, and layout rules. No browser rendering or post-write tests were performed.

## Composition and focus refinement

The user approved all five recommendations from the Ace Studio inspiration review: stable visual anchors, stronger type contrast, consistent alignment, concentrated color, and deliberate spacing. The reference informed those principles; its fonts, colors, content, and unverified live animation behavior are not replicated.

About's introduction, both story frames, stage navigation and progress, and the closing copy and skills share a decorative rail and flexible text column. The rail is `clamp(12rem,20vw,18rem)`, with a 32px gap. Below 1024px it becomes 10rem with a 24px gap; below 768px all content stacks. Artwork retains its original frame, geometry and motion. The education row retains its separate dates and full width.

The hero uses top-aligned name and supporting columns. Its lead begins beside the name below the quiet role label. On phones it follows the name in normal flow. Its original viewport minimum and bounded artwork size remain.

Pinned stages retain the runtime's largest-stage reservation, with content aligned to the top of that space. Shorter stages no longer recenter vertically. The largest complete stage still must fit before pinning activates. Flow chapters use explicit 48px gaps, reduced to 32px on phones. Section spacing is 64px, reduced to 48px on phones. Related text uses the smaller existing spacing tokens.

Space Mono remains the only typeface. Headings and metric values use scalable rem-based bounds; metadata remains readable at 1rem. Metrics align directly with the role text. A small blue square beside the current metric replaces the broad background emphasis. Selected topic squares, the progress marker, and the selected skills underline use the same blue, with bold text or selected-state semantics as additional cues.

No narrative, destination, SVG composition, header treatment, education date, or runtime behavior was replaced. All existing reduced-motion and mobile fallbacks remain. This refinement was composed from source; no post-write browser review or tests were run.

## Responsive polish

Work metadata and metrics now respond to their content column, rather than relying only on the window breakpoint. Below 36rem of available column width, dates, role title, and location occupy separate rows and metrics use one column. The rem threshold also responds to larger text settings. The existing whole-stage fit measurement chooses pinned or continuous flow after this reflow.

The complete metric remains “Over 80%”; “Over” now uses the metadata size and regular weight so the percentage carries the emphasis. The number, percent sign, qualifier, and active square stay together.

Contact cards retain equal type and square proportions. Their minimum width reserves eight character advances in the actual label font, padding, both 1px borders, and 4px of hover movement. Compact header navigation uses a balanced two-column grid only when its own row is narrower than 17rem; every link remains visible. Other typography, content, colors, and artwork are preserved.

These are source-based polish decisions, not newly confirmed brand requirements. No browser, device, or post-write tests were performed.

## University redesign

The requested section redesign retains the existing black ground, Space Mono, square geometry, and gray 1px rule. The shared left rail now carries dates instead of a third metadata column. The university title uses `--education-title-size:clamp(1.75rem,3vw,2.75rem)`; years use the subordinate `--education-year-size:clamp(1.5rem,2vw,2rem)`. One small blue square identifies the Education label. The qualification fields are a semantic description list, with the internship program grouped under the degree.

The section has no fixed height, cropped content, or new animation. At 48rem and below, dates form a horizontal row above the content. The details also stack below a 36rem content container. These layout choices are the design interpretation of the user's redesign request. All university facts are preserved. Source authoring only; no post-write previews or tests.

## Single-row skills

Each skills category is now one compact horizontal row. Full labels remain on one line at the existing readable text size, with 8px tile padding and gaps. When all tiles cannot fit, the list scrolls horizontally within the content column. A native scrollbar indicates overflow; no skill is removed or truncated. This applies within the existing five-category explorer. Other page layouts and typography are unchanged.
