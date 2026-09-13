"""Save the selected portfolio's documentation and reusable source snapshot.

Run from the project root. Refuses to overwrite outputs or use a changed baseline.
This script reads input source and writes companions; it does not render or test.
"""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import re

ROOT = Path.cwd()
EXPECTED = '9b6196098d99b760ad90fe5acded466485fbe21c0164e7d1959e2a5ab97443cf'
raw = Path('index.html').read_bytes()
digest = hashlib.sha256(raw).hexdigest()
if digest != EXPECTED:
    raise RuntimeError('The input portfolio changed before saving its design kit.')
source = raw.decode('utf-8').replace('\r\n', '\n')
styles = list(re.finditer(r'<style>\s*([\s\S]*?)\s*</style>', source))
scripts = list(re.finditer(r'<script>\s*([\s\S]*?)\s*</script>', source))
if len(styles) != 1 or len(scripts) != 1:
    raise RuntimeError('Expected one source style block and one interaction block.')
css, js = styles[0].group(1), scripts[0].group(1)
assets = sorted(set(re.findall(r'(?:href|src)="(assets/[^"]+)"', source)
                    + re.findall(r'url\("(assets/[^"]+)"\)', css)))
for name in assets:
    if not Path(name).is_file():
        raise RuntimeError('Missing input asset: ' + name)


class SourceNodes(HTMLParser):
    """Find original source slices without rewriting their markup."""
    VOID = {'area','base','br','col','embed','hr','img','input','link',
            'meta','param','source','track','wbr'}

    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.lines = [0] + [m.end() for m in re.finditer('\n', text)]
        self.stack, self.nodes = [], []
        self.feed(text)

    def source_offset(self):
        line, col = self.getpos()
        return self.lines[line-1] + col

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append({'tag':tag, 'attrs':dict(attrs), 'start':self.source_offset()})

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i]['tag'] == tag:
                node = self.stack[i]
                node['end'] = self.text.index('>', self.source_offset()) + 1
                self.nodes.append(node)
                del self.stack[i:]
                return

    def pick(self, tag=None, cls=None, id=None):
        matches = [n for n in self.nodes
                   if (tag is None or n['tag']==tag)
                   and (cls is None or cls in n['attrs'].get('class','').split())
                   and (id is None or n['attrs'].get('id')==id)]
        if not matches:
            raise RuntimeError('Missing source component: ' + str((tag,cls,id)))
        node = min(matches, key=lambda n:n['start'])
        return self.text[node['start']:node['end']]


nodes = SourceNodes(source)
fragments = {
    'header':nodes.pick(tag='header', cls='site-header'),
    'hero':nodes.pick(tag='section', id='home'),
    'about':nodes.pick(tag='section', id='about'),
    'story':nodes.pick(cls='about-story'),
    'skills':nodes.pick(cls='skills-explorer'),
    'work':nodes.pick(tag='section', id='work'),
    'kpi-card':nodes.pick(tag='article', cls='kpi-card'),
    'contact':nodes.pick(tag='section', id='links'),
    'contact-card':nodes.pick(tag='a', cls='contact-link'),
    'footer':nodes.pick(tag='footer', cls='site-footer'),
}


def declarations(text):
    return {k.strip():v.strip() for k,v in
            (item.split(':',1) for item in text.split(';')
             if item.strip().startswith('--'))}


roots = list(re.finditer(r':root\s*\{([^}]+)\}', css))
overrides = []
for block in roots[1:]:
    context = list(re.finditer(r'@media\s*([^{}]+)\{', css[:block.start()]))[-1].group(1).strip()
    overrides.append({'media':context,'tokens':declarations(block.group(1))})


def md(text):
    return text.strip() + '\n'


files = {}
files['DESIGN.md'] = md('''
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
''')

files['design/README.md'] = md('''
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
''')

files['design/IMPLEMENTATION.md'] = md('''
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
''')

files['design/templates/README.md'] = md('''
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
''')

files['design/system.css'] = ('/* Portfolio system snapshot. Source: ../index.html. See README.md. */\n'
                              + css.replace('url("assets/', 'url("../assets/') + '\n')
files['design/runtime.js'] = ('// Portfolio interaction snapshot. Requires the full scaffold; see IMPLEMENTATION.md.\n'
                              + js + '\n')
files['design/tokens.json'] = json.dumps({
    'name':'Zeyad Omran portfolio tokens', 'version':'1.0.0', 'source':'../index.html',
    'sourceSha256':digest, 'selectedIdentity':'baseline',
    'note':'Exact CSS custom-property catalog. system.css has the working declarations; the browser does not load this JSON.',
    'default':declarations(roots[0].group(1)), 'overrides':overrides
}, indent=2) + '\n'


class TextInventory(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts, self.stack = [], []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        suppressed = tag in {'svg','script','style'} or attrs.get('aria-hidden')=='true'
        if tag not in SourceNodes.VOID:
            self.stack.append((tag,suppressed))
            if suppressed:
                self.skip += 1
        if not self.skip and tag in {'p','h1','h2','h3','h4','li','article','section','div','br'}:
            self.parts.append('\n')

    def handle_startendtag(self, tag, attrs):
        if tag == 'br' and not self.skip:
            self.parts.append('\n')

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0] == tag:
                self.skip -= sum(value for _,value in self.stack[i:])
                del self.stack[i:]
                break
        if not self.skip:
            self.parts.append('\n' if tag in {'p','h1','h2','h3','h4','li','article','section','div'} else ' ')

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)

    def readable(self):
        return '\n\n'.join(re.sub(r'\s+',' ',part).strip()
                           for part in ''.join(self.parts).split('\n') if part.strip())


copy = ['# Saved portfolio content', '',
        'Source: `../index.html`, saved 2026-09-12. Text is extracted, not rewritten. Decorative duplicates are excluded. Line separation follows markup blocks. This is a copy inventory, not independent verification of career claims.', '']
for key, title in [('hero','Hero'),('about','About, education, and skills'),
                   ('work','Work'),('contact','Contact'),('footer','Footer')]:
    reader = TextInventory()
    reader.feed(fragments[key])
    copy.extend(['## '+title, '', reader.readable(), ''])
links = sorted(set(re.findall(r'href="((?:https?://|mailto:)[^"]+)"', source)))
copy.extend(['## Contact destinations', ''] + ['- `'+url+'`' for url in links]
            + ['', 'The live page remains authoritative. No links were opened while saving this inventory.'])
files['design/CONTENT.md'] = '\n'.join(copy) + '\n'
for key, fragment in fragments.items():
    files['design/templates/partials/'+key+'.html'] = ('<!-- Source fragment for the root portfolio; see ../README.md. -->\n'
                                                     + fragment + '\n')

# Replace the later script first so the original style-block offsets remain valid.
template = (source[:scripts[0].start()] + '<script src="../runtime.js"></script>'
            + source[scripts[0].end():])
template = (template[:styles[0].start()] + '<link rel="stylesheet" href="../system.css">'
            + template[styles[0].end():])
template = re.sub(r'((?:href|src)=")assets/', r'\1../../assets/', template)
template = template.replace('<!doctype html>', '<!doctype html>\n<!-- Saved portfolio template. Live source: ../../index.html. See README.md. -->', 1)
files['design/templates/portfolio.html'] = template
files['design/snapshot.json'] = json.dumps({
    'name':'Zeyad Omran portfolio design kit', 'version':'1.0.0', 'savedOn':'2026-09-12',
    'canonicalEntry':'index.html', 'sourceSha256':digest, 'selectedIdentity':'baseline',
    'mode':'source snapshot; live portfolio unchanged',
    'templateEntry':'design/templates/portfolio.html',
    'dependencies':[{'path':name,'sha256':hashlib.sha256(Path(name).read_bytes()).hexdigest()}
                    for name in assets],
    'files':sorted(list(files)+['design/snapshot.json','design/source/save_snapshot.py']),
    'verification':'Source extraction only. No post-write rendering, previews, or tests.'
}, indent=2) + '\n'

# Resolve every destination and prepare all content before finalization.
for name in files:
    path = ROOT / name
    if path.exists():
        raise RuntimeError('Preserving an existing output: ' + name)
    if not path.resolve().is_relative_to(ROOT.resolve()):
        raise RuntimeError('Output escapes the project: ' + name)

# The complete reusable HTML entry lands last. The root page is never written.
order = [name for name in files if name != 'design/templates/portfolio.html']
order.append('design/templates/portfolio.html')
for name in order:
    path = ROOT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(files[name], encoding='utf-8', newline='\n')
print('Saved ' + str(len(files)+1) + ' design-kit files including the construction recipe.')
print('Complete template: design/templates/portfolio.html. Root index.html was not written.')
