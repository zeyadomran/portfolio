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
| Header | Sticky black header, white navigation, bold current item, thin bottom rule |
| Start and finish | Hero and Contact have at least viewport height and can grow with content |
| Storytelling | Three About stages and two IBM role stages, pinned only when they fit |
| Motion preference | Browser reduced-motion preference; no visible motion toggle or stop-sequence buttons |

These decisions come from the user's revisions and current source. Numeric values below record implementation choices, not new user approvals. The early liquid-glass reference does not describe the current opaque black header.

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
| Stage heading | `clamp(36px,4.5vw,64px)`; line height 1.2 |
| Role heading | `clamp(28px,2.8vw,44px)`; 700; line height 1.2 |
| Lead copy | `clamp(1.25rem,2.2vw,1.75rem)`; line height 1.5 |
| Body | `1.125rem`; 400; line height 1.6 |
| Small copy | `1rem` |
| Navigation | `1.125rem` |
| KPI value | `clamp(32px,2.6vw,40px)`; 700; line height 1.15 |
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
| A scene cannot fit | Pinning is disabled; all its stages remain in ordinary flow |

Hero and Contact use `min-height:100vh`, followed by `100svh` where supported. The sticky header remains in document flow; story offsets use its measured height. Contact cards prefer a square ratio but can grow for content and reflow through auto-fit columns.

## Narrative and components

1. Hero: name, role, concise statement, work link, modular diagram.
2. About: introduction; Frontend, HCI, and AI agents stages; education; skills explorer.
3. Work: IBM lettering; Software developer and Front-End Developer Intern stages; summaries and seven metrics.
4. Contact: invitation and square Email, LinkedIn, and GitHub cards.
5. Footer: year, smaller diagram, and back-to-top link.

Diagrams share square-ended horizontal, vertical, and angular linework with a blue focus square. Composition and size vary by section. Decorative SVGs are hidden from assistive technology. Current work metrics have visible descriptions; earlier work accordions were superseded and are not part of this snapshot.

Preserve current copy, skills, dates, locations, metrics, and contact destinations when changing visuals. [The content inventory](design/CONTENT.md) records the source wording.

## Interaction and accessibility

Controls use 200ms feedback, nav scrubbing 240ms, entrances 320ms, exits 200ms, and list staggering 40ms. Existing decorative drift has an independent 8-second alternate cycle. Hovered contact arrows move diagonally, labels shift slightly, and a dark surface appears behind the card. Focus receives equivalent feedback.

Scroll drives the active stage, coordinated geometry, progress marker, heading-color reveal, and KPI emphasis. Scroll remains reversible, without forced snapping. Panels release at the end of their allocated distance. Header links and stage controls provide direct access.

Keep semantic controls, visible focus, 44px minimum control heights, and explicit selected states. Preserve native keyboard and touch input. Reduced motion shows a static reading presentation with all stages visible. Without JavaScript, core content and ordinary anchor links remain in the source. Forced colors use system colors and extra text cues.

These are source behavior and design requirements, not claims of device testing or accessibility certification.

## Selected identity

Use [Baseline's symbol](assets/identity/baseline/symbol.svg) in the header and favicon. It has a 200 by 200 viewBox and displays at 48px in the header. Keep its natural ratio and transparent padding. The home link already names Zeyad, so its image has empty alt text.

The Baseline kit also contains outlined wordmark, horizontal and stacked lockups, and single-color variants. [The identity guide](identity/guide.md) records clear space and sizes. [The comparison](identity/index.html) retains Panel and Fold as alternatives. Generated concept boards are exploratory; flat editable SVGs are the implementation assets.

## Source and maintenance

[system.css](design/system.css) and [runtime.js](design/runtime.js) are extracted copies used by the full-page template. The live portfolio still keeps its own inline styles and script. Editing a kit file does not automatically change `index.html`.

This snapshot was saved on 2026-09-12. Refresh it deliberately after future approved changes. No preview, rendering, browser walkthrough, or tests were performed while saving the kit.
