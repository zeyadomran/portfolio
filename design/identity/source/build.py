"""Build the frozen identity study from local font outlines and generated inputs.

Run from the portfolio project root. Generated SVGs are path-based and font-free.
The root portfolio entry is finalized last; this script performs no post-write QA.
"""
from pathlib import Path
import hashlib
import html
import json

ROOT = Path.cwd()
ENTRY = ROOT / 'index.html'
BASELINE_HASH = 'add233e22839b8afffe2bd99bd31c69be9d2d8e54787d4573ca2bfeded52c561'
entry_bytes = ENTRY.read_bytes()
if hashlib.sha256(entry_bytes).hexdigest() != BASELINE_HASH:
    raise SystemExit('The portfolio input has changed; no outputs written.')
entry = entry_bytes.decode('utf-8').replace('\r\n', '\n')
outlines = json.loads((ROOT / 'identity/source/wordmark-paths.json').read_text(encoding='utf-8'))
generation = json.loads((ROOT / 'identity/source/generation.json').read_text(encoding='utf-8'))
images = {item['id']: item for item in generation['images']}
layout_start = entry.index('/* OD-LAYOUT-PRIMITIVES v1')
layout_end = entry.index('/* /OD-LAYOUT-PRIMITIVES v1 */') + len('/* /OD-LAYOUT-PRIMITIVES v1 */')
layout = entry[layout_start:layout_end]

ROUTES = [
    dict(id='panel', number='01', name='Panel', character='Precise. Open. Modular.',
         role='The closest continuation of your current identity.',
         idea='Separate interface panels form a Z beside an open rectangular O. A blue cursor gives the system one point of focus.',
         type='Uppercase / Space Mono Regular',
         word='upperRegular', minimum=48, mono_minimum=32, word_minimum=240, clear=16,
         color='Neutral linework carries the symbol. White carries the name. Blue belongs only to the cursor.',
         motion='Move the cursor by one grid step on hover or focus, then return it. Keep the outlined panels stationary.',
         small='Below 48px, use the heavier single-color symbol. Do not use the outlined version below 48px or the single-color symbol below 32px.',
         alt='Four outlined rectangles step through a Z beside a rectangular O with a blue cursor square.'),
    dict(id='fold', number='02', name='Fold', character='Compact. Angular. Bold.',
         role='The strongest silhouette for a compact header mark.',
         idea='A broad Z folds around an angular O counter. One small blue plane identifies the terminal without weakening the silhouette.',
         type='Uppercase / Space Mono Bold',
         word='upperBold', minimum=32, mono_minimum=24, word_minimum=200, clear=16,
         color='White defines the mass of the monogram. One rectangular plane carries blue; no extra colored faces are added.',
         motion='Shift the blue terminal by at most one quarter of its width on hover or focus. Keep the main silhouette fixed.',
         small='Use the single-color silhouette below 32px. Its open counter and broad diagonal remain the defining elements; stop at 24px.',
         alt='A filled angular Z wraps a cut-out O counter, with a small blue rectangular terminal.'),
    dict(id='baseline', number='03', name='Baseline', character='Quiet. Personal. Typographic.',
         role='The most direct expression of your name.',
         idea='Lowercase lettering sits on two offset lines. The compact symbol repeats those baselines as two rails and a square terminal.',
         type='Lowercase / Space Mono Regular',
         word='lowerRegular', minimum=32, mono_minimum=24, word_minimum=160, clear=16,
         color='White gives the name priority. Neutral rails support it. Blue marks the endpoint of the reading line.',
         motion='Reveal the second rail and terminal together in a short opacity transition. Keep the lettering still.',
         small='Use the rails-only symbol below the wordmark minimum. For a single-color application, retain both rails and the terminal square; stop at 24px.',
         alt='Two offset horizontal rails end in a blue square, echoing the two lines of the lowercase wordmark.')
]

FILES = [
    ('symbol.svg', 'Symbol'), ('wordmark.svg', 'Wordmark'),
    ('lockup-horizontal.svg', 'Horizontal lockup'), ('lockup-stacked.svg', 'Stacked lockup'),
    ('symbol-mono.svg', 'Single-color symbol'), ('lockup-mono.svg', 'Single-color lockup')
]
assets = {}

def n(value):
    return ('%.3f' % value).rstrip('0').rstrip('.')

def write(relative, content):
    target = ROOT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        raise SystemExit('Refusing to replace an existing identity output: ' + relative)
    target.write_text(content, encoding='utf-8', newline='\n')

def glyph(key, x=0, y=0, scale=1):
    item = outlines[key]
    return f'<g transform="translate({n(x)} {n(y)}) scale({n(scale)})"><path class="ink" d="{item["d"]}"/></g>'

def symbol(route, mono=False):
    if route == 'panel':
        stroke = 8 if mono else 4
        return f'''<g id="modular-panels" fill="none" class="line" stroke-width="{stroke}">
<rect x="32" y="44" width="56" height="16"/><rect x="64" y="68" width="24" height="16"/>
<rect x="32" y="92" width="24" height="16"/><rect x="32" y="116" width="56" height="16"/>
<rect x="104" y="44" width="64" height="88"/></g>
<rect id="cursor" class="accent" x="144" y="108" width="12" height="12"/>'''
    if route == 'fold':
        return '''<path id="folded-monogram" class="ink" fill-rule="evenodd" d="M32 40H152L176 64V136L152 160H32V136L112 64H32Z M136 80L88 136H144L152 128V80Z"/>
<rect id="terminal-plane" class="accent" x="136" y="44" width="16" height="16"/>'''
    return '''<g id="baseline-rails" class="neutral"><rect x="32" y="56" width="104" height="16"/><rect x="64" y="104" width="80" height="16"/></g>
<rect id="terminal" class="accent" x="152" y="104" width="16" height="16"/>'''

def word(route, stacked=True):
    if route['id'] == 'baseline' and stacked:
        first, last = outlines['lowerFirst'], outlines['lowerLast']
        x, y, square, gap = 60, 112, 12, 16
        body = glyph('lowerFirst') + glyph('lowerLast', x, y)
        body += f'<rect class="accent" x="{n(x+last["width"]+gap)}" y="{n(y+last["height"]-square)}" width="12" height="12"/>'
        return body, max(first['width'], x+last['width']+gap+square), y+last['height']
    item = outlines[route['word']]
    body = glyph(route['word'])
    width = item['width']
    if route['id'] == 'baseline':
        body += f'<rect class="accent" x="{n(width+16)}" y="{n(item["height"]-12)}" width="12" height="12"/>'
        width += 28
    return body, width, item['height']

def svg_document(route, filename, body, width, height, mono=False):
    ink, line, accent = ('#000000', '#000000', '#000000') if mono else ('#F5F7FA', '#B8B8B8', '#4C70F0')
    label = route['name'] + ' / ' + dict(FILES)[filename]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{n(width)}" height="{n(height)}" viewBox="0 0 {n(width)} {n(height)}" role="img" aria-labelledby="title desc">
<title id="title">{html.escape(label)} - Zeyad Omran</title>
<desc id="desc">{html.escape(route['alt'].replace('blue', 'black') if mono else route['alt'])} Transparent background. {'Black single-color artwork for a light background.' if mono else 'Light artwork for a black background.'}</desc>
<metadata>Identity directions / Zeyad Omran. Lettering derived from Space Mono under SIL Open Font License 1.1; see assets/OFL-SpaceMono.txt. Geometry and lettering remain editable SVG paths.</metadata>
<style>:root{{--identity-ink:{ink};--identity-line:{line};--identity-accent:{accent}}}.ink{{fill:var(--identity-ink)}}.neutral{{fill:var(--identity-line)}}.line{{stroke:var(--identity-line)}}.accent{{fill:var(--identity-accent)}}</style>
<g stroke-linecap="butt" stroke-linejoin="miter">{body}</g>
</svg>
'''

def export(route, filename, body, width, height, mono=False):
    relative = f'assets/identity/{route["id"]}/{filename}'
    write(relative, svg_document(route, filename, body, width, height, mono))
    assets[relative] = dict(width=width, height=height)

for route in ROUTES:
    export(route, 'symbol.svg', symbol(route['id']), 200, 200)
    export(route, 'symbol-mono.svg', symbol(route['id'], True), 200, 200, True)
    lettering, w, h = word(route)
    export(route, 'wordmark.svg', f'<g transform="translate(24 24)">{lettering}</g>', w+48, h+48)
    # Horizontal lockups keep the name on one line and share one alignment axis.
    lettering, w, h = word(route, False)
    s, mark, gap, pad = .72, 120, 24, 24
    height = mark + 2*pad
    text_y = pad + (mark-h*s)/2
    body = f'<g transform="translate({pad} {pad}) scale(.6)">{symbol(route["id"])}</g>'
    body += f'<g transform="translate({pad+mark+gap} {n(text_y)}) scale({s})">{lettering}</g>'
    width = pad*2 + mark + gap + w*s
    export(route, 'lockup-horizontal.svg', body, width, height)
    mono_body = body.replace(symbol(route['id']), symbol(route['id'], True), 1)
    export(route, 'lockup-mono.svg', mono_body, width, height, True)
    # Stacked versions preserve the route-specific wordmark arrangement.
    lettering, w, h = word(route)
    s, mark, gap, pad = .64, 136, 24, 24
    width = max(w*s, mark) + pad*2
    height = pad*2 + mark + gap + h*s
    symbol_x = pad if route['id'] == 'baseline' else (width-mark)/2
    text_x = pad if route['id'] == 'baseline' else (width-w*s)/2
    body = f'<g transform="translate({n(symbol_x)} {pad}) scale(.68)">{symbol(route["id"])}</g>'
    body += f'<g transform="translate({n(text_x)} {pad+mark+gap}) scale({s})">{lettering}</g>'
    export(route, 'lockup-stacked.svg', body, width, height)

manifest = {
    'brand': 'Zeyad Omran', 'version': '1.0.0', 'status': 'directions for comparison; no replacement selected',
    'palette': {'background':'#000000','foreground':'#F5F7FA','neutral':'#B8B8B8','accent':'#4C70F0'},
    'routes': ROUTES, 'vectorAssets': assets, 'generatedImages': generation['images'],
    'fontLicense': '../OFL-SpaceMono.txt',
    'generationMethod': 'Built-in image_gen tool; three independent logo-brand prompts'
}
write('assets/identity/manifest.json', json.dumps(manifest, indent=2) + '\n')

prompt_doc = ['# Identity generation prompts', '', 'Brand: Zeyad Omran', '',
              'Method: built-in `image_gen` tool, one independent call per direction. No CLI fallback was used.', '',
              'Generated boards are exploration references. The editable SVGs use the frozen flat-color geometry and Space Mono outline source.', '']
for prompt in generation['prompts']:
    prompt_doc += ['## ' + prompt['id'].title(), '', 'Saved board: `../assets/identity/' + prompt['id'] + '/concept.png`', '',
                   '```text', prompt['prompt'], '```', '']
write('identity/prompts.md', '\n'.join(prompt_doc))

guide = ['# Zeyad Omran / Identity directions', '',
         'Open `identity/index.html` for the comparison. The portfolio at `index.html` retains its current logo; only its favicon reference has been added.', '',
         '## Files and editability', '',
         'Each directory under `assets/identity/` contains six editable, transparent SVG assets and one generated concept board. Lettering is outlined from local Space Mono; SVGs require no font download or external service. Path groups have descriptive IDs for symbol edits.', '',
         'Color tokens live once inside each SVG: `--identity-ink`, `--identity-line`, and `--identity-accent`. The supplied single-color versions are black artwork for light backgrounds. To make a white single-color version, change all three values to `#F5F7FA` in a sibling copy.', '',
         'The source inputs are in `identity/source/`: exact prompts and board dimensions in `generation.json`, font-derived geometry in `wordmark-paths.json`, and the construction recipe in `build.py`. The recipe protects existing output files from replacement. Edit a copied asset when exploring changes.', '',
         'Space Mono is licensed under the SIL Open Font License 1.1. See [the local license](../assets/OFL-SpaceMono.txt). The portfolio keeps its existing local font assets.', '',
         '## Shared palette', '',
         '| Role | Value | Use |', '| --- | --- | --- |',
         '| Background | `#000000` | Main identity canvas and portfolio |',
         '| Foreground | `#F5F7FA` | Name and primary filled shapes |',
         '| Neutral | `#B8B8B8` | Panel outlines, rails and supporting rules |',
         '| Accent | `#4C70F0` | One cursor, plane or terminal per mark |', '',
         'Use the full-color assets on black. Use the black single-color assets on a plain light background. Preserve transparent margins and the native viewBox; use width with height:auto, never stretch, crop or apply object-fit:cover.', '',
         '## Shared restrictions and motion', '',
         'Do not add gradients, glow, shadows, rounded corners, extra accent colors, slogans, mirrored geometry or artificial letter spacing to an exported lockup. Keep symbol and wordmark proportions fixed. The route names Panel, Fold and Baseline label this study; they are not part of the brand name.', '',
         'Motion is optional. Use 200ms transform or opacity feedback on hover and keyboard focus, and restore the resting state on exit. Do not animate name lettering, layout dimensions or logos continuously. Under prefers-reduced-motion:reduce, use the complete static identity.', '',
         '## About the generated boards', '',
         'The PNGs are AI-generated exploration boards. Their lighting effects and any extra specimen labels are not identity rules. Use the flat SVG assets for implementation. No preview, rendering or validation run was performed; the marks are new constructions for this study.', '']
for route in ROUTES:
    guide += ['## ' + route['number'] + ' / ' + route['name'], '', route['idea'], '',
              '**Wordmark:** ' + route['type'] + '.', '', '**Color:** ' + route['color'], '',
              f'**Clear space:** reserve at least {route["clear"]} design units around the visible symbol on its 200-unit canvas. This is one structural unit; the SVG already includes more than this margin. For lockups, keep the exported padding and add at least one capital height of whitespace around neighboring text or controls.', '',
              f'**Minimum displayed sizes:** full-color symbol {route["minimum"]}px wide; single-color symbol {route["mono_minimum"]}px; standalone wordmark {route["word_minimum"]}px; horizontal lockup 240px; stacked lockup 200px. These are construction rules, not claims of rendered testing.', '',
              '**Small-size treatment:** ' + route['small'], '', '**Optional interaction:** ' + route['motion'], '',
              '**Files:**', '']
    guide += [f'- [{label}](../assets/identity/{route["id"]}/{filename})' for filename, label in FILES]
    guide += ['', '**Use in the portfolio header after selecting this route:**', '', '```html',
              '<a href="#home" class="brand" aria-label="Zeyad Omran, home">',
              f'  <img class="brand-logo" src="assets/identity/{route["id"]}/symbol.svg"',
              '       width="200" height="200" alt="">', '</a>', '```', '',
              '```css', '.brand-logo { display: block; width: 48px; height: auto; }', '```', '']
guide += ['## Choosing a route', '',
          '- Panel preserves the most continuity with the existing outlined ZO mark.',
          '- Fold gives the compact symbol the strongest visual weight.',
          '- Baseline puts the person and the name ahead of the monogram.', '',
          'The companion page presents all three. No direction is automatically installed in the portfolio.', '']
write('identity/guide.md', '\n'.join(guide))

def asset_image(route, filename, css='', alt=''):
    relative = f'assets/identity/{route["id"]}/{filename}'
    size = assets[relative]
    return f'<img class="od-media {css}" src="../{relative}" width="{n(size["width"])}" height="{n(size["height"])}" alt="{html.escape(alt, quote=True)}" decoding="async">'

sections = []
for route in ROUTES:
    rid, name = route['id'], route['name']
    downloads = ''.join(f'<a class="download" href="../assets/identity/{rid}/{filename}" download aria-label="Download {name} {label.lower()} SVG"><span>{label}</span><span aria-hidden="true">&#8600;</span></a>' for filename, label in FILES)
    code = f'<img class="brand-logo" src="assets/identity/{rid}/symbol.svg"\n     width="200" height="200" alt="Zeyad Omran">'
    image = images[rid]
    sections.append(f'''
<section class="direction" id="{rid}" aria-labelledby="{rid}-title">
  <div class="direction-heading od-row-top"><span class="number od-fixed">{route['number']}</span><div class="od-field od-fill"><h2 id="{rid}-title">{name}</h2><p class="character">{route['character']}</p></div><a class="section-link od-fixed" href="#overview">All directions <span aria-hidden="true">&#8593;</span></a></div>
  <div class="rationale"><p class="lead">{route['role']}</p><p>{route['idea']}</p></div>
  <div class="hero-specimens">
    <figure class="symbol-specimen od-stack"><div class="specimen-field">{asset_image(route,'symbol.svg','symbol',route['alt'])}</div><figcaption>Symbol <span>Full color</span></figcaption></figure>
    <figure class="word-specimen od-stack"><div class="specimen-field">{asset_image(route,'wordmark.svg','wordmark',name+' wordmark: Zeyad Omran')}</div><figcaption>Wordmark <span>{route['type']}</span></figcaption></figure>
  </div>
  <div class="usage-row">
    <figure class="horizontal-sample od-stack"><p class="eyebrow">Horizontal lockup</p><div class="lockup-field">{asset_image(route,'lockup-horizontal.svg','horizontal',name+' horizontal symbol and name lockup')}</div><figcaption>A complete mark for wider placements.</figcaption></figure>
    <div class="usage-note od-stack"><h3>Keep the system clear.</h3><p>{route['color']}</p><dl class="dimensions"><div class="od-field"><dt>Symbol minimum</dt><dd>{route['minimum']}px</dd></div><div class="od-field"><dt>Single-color minimum</dt><dd>{route['mono_minimum']}px</dd></div><div class="od-field"><dt>Clear-space unit</dt><dd>{route['clear']} / 200</dd></div></dl></div>
  </div>
  <details class="format-disclosure"><summary><span>Stacked and single-color formats</span><span class="plus" aria-hidden="true"></span></summary><div class="secondary-specimens">
    <figure class="od-stack"><div class="variant-field">{asset_image(route,'lockup-stacked.svg','stacked',name+' stacked symbol and name lockup')}</div><figcaption>Stacked lockup</figcaption></figure>
    <figure class="od-stack"><div class="variant-field light">{asset_image(route,'symbol-mono.svg','mono-symbol',name+' black single-color symbol on a light surface')}</div><figcaption>Single-color symbol</figcaption></figure>
    <figure class="od-stack"><div class="variant-field light">{asset_image(route,'lockup-mono.svg','horizontal',name+' black single-color horizontal lockup on a light surface')}</div><figcaption>Single-color lockup</figcaption></figure>
  </div></details>
  <div class="downloads"><h3>SVG files</h3><div class="download-grid">{downloads}</div></div>
  <details class="text-disclosure"><summary><span>Usage and portfolio integration</span><span class="plus" aria-hidden="true"></span></summary><div class="detail-copy od-stack"><h3>Small sizes</h3><p>{route['small']}</p><h3>Optional motion</h3><p>{route['motion']} Use 200ms feedback and a static reduced-motion state.</p><h3>Header asset</h3><p>After choosing this direction, use this image inside the existing home link. Set its alt to empty when the link already has the accessible name.</p><pre><code>{html.escape(code)}</code></pre><pre><code>.brand-logo {{ display: block; width: 48px; height: auto; }}</code></pre><p>Keep the native ratio and the clear space included in the file. Never crop or stretch a lockup.</p></div></details>
  <details class="concept-disclosure"><summary><span>Generated exploration</span><span class="plus" aria-hidden="true"></span></summary><figure class="concept-figure od-stack"><img class="od-media" src="../{image['path']}" width="{image['width']}" height="{image['height']}" loading="lazy" decoding="async" alt="AI-generated {name} identity concept board showing symbol, lettering and lockup explorations."><figcaption>Exploration image. Its lighting and specimen labels are not part of the flat SVG identity.</figcaption></figure></details>
</section>''')

page_css = '''
@font-face{font-family:Space Mono;src:url('../assets/SpaceMono-Regular.ttf') format('truetype');font-weight:400;font-display:swap}
@font-face{font-family:Space Mono;src:url('../assets/SpaceMono-Bold.ttf') format('truetype');font-weight:700;font-display:swap}
:root{color-scheme:dark;--bg:#000;--ink:#f5f7fa;--muted:#b8b8b8;--surface:#101416;--blue:#4c70f0;--rule:1px;--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:32px;--s6:48px;--s7:64px;--s8:96px;--gutter:32px;--duration:200ms;--ease:cubic-bezier(.16,1,.3,1);--font:'Space Mono',monospace}
*{box-sizing:border-box;border-radius:0}html{scroll-padding-top:80px}body{margin:0;background:var(--bg);color:var(--ink);font:400 1rem/1.65 var(--font)}h1,h2,h3,p,figure,dl,dd{margin:0}h1,h2,h3{line-height:1.2;text-wrap:balance}p{text-wrap:pretty}a{color:inherit;text-underline-offset:6px;text-decoration-thickness:var(--rule)}a,summary{touch-action:manipulation;cursor:pointer}a:focus-visible,summary:focus-visible{outline:var(--rule) solid var(--ink);outline-offset:4px}a,summary{scroll-margin-block:var(--s3)}::selection{background:var(--ink);color:var(--bg)}.wrap{width:min(calc(100% - 2 * var(--gutter)),1344px);margin-inline:auto}.skip{position:fixed;top:var(--s3);left:var(--s3);z-index:5;background:var(--ink);color:var(--bg);padding:var(--s3);transform:translateY(-200%)}.skip:focus{transform:none}
.site-header{position:sticky;top:0;background:var(--bg);border-bottom:var(--rule) solid var(--muted);z-index:3}.header-inner{display:flex;justify-content:space-between;align-items:center;gap:var(--s4);min-height:64px}.home-link{display:flex;align-items:center;min-height:44px;gap:var(--s3);text-decoration:none}.current-logo{display:block;width:48px;height:auto}.portfolio-link{display:flex;align-items:center;min-height:44px;gap:var(--s3);text-decoration:none}.portfolio-link span:last-child{transition:transform var(--duration) var(--ease)}.intro{padding-block:var(--s8) var(--s7)}.eyebrow,.number{font-size:1rem;color:var(--muted)}.intro h1{font-size:clamp(2.75rem,7vw,6.5rem);font-weight:400;letter-spacing:-.06em;margin-block:var(--s4) var(--s5)}.intro h1 span{display:block}.intro-copy{max-width:68ch;color:var(--muted)}.status-note{margin-top:var(--s4);max-width:68ch;color:var(--muted)}.status-note strong{color:var(--ink);font-weight:400}.route-nav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s4);margin-top:var(--s6)}.route-nav a{display:flex;align-items:center;justify-content:space-between;gap:var(--s3);padding-block:var(--s4);min-height:64px;text-decoration:none;border-top:var(--rule) solid var(--muted)}.route-nav .od-field{--od-gap:var(--s2)}.route-nav .nav-name{font-size:clamp(1.25rem,2.5vw,2rem)}.nav-arrow{display:block;font-size:1.5rem;transition:transform var(--duration) var(--ease)}
.direction{padding-block:var(--s7);border-top:var(--rule) solid var(--muted);scroll-margin-top:64px}.direction-heading{--od-gap:var(--s4);align-items:baseline}.direction-heading h2{font-size:clamp(2.5rem,5.5vw,5rem);font-weight:400;letter-spacing:-.05em}.direction-heading .od-field{--od-gap:var(--s3)}.character{color:var(--muted)}.section-link{display:flex;align-items:center;gap:var(--s2);min-height:44px;text-decoration:none;margin-left:auto}.rationale{margin-block:var(--s5) var(--s6);max-width:72ch}.rationale .lead{font-size:clamp(1.125rem,2vw,1.5rem);color:var(--ink);margin-bottom:var(--s3)}.rationale p{color:var(--muted)}.hero-specimens{display:grid;grid-template-columns:minmax(0,.4fr) minmax(0,.6fr);gap:var(--s5);padding-bottom:var(--s6)}.hero-specimens figure{--od-gap:var(--s3)}.specimen-field{display:grid;place-items:center;min-height:288px;padding:var(--s4);background:var(--surface)}.specimen-field .symbol{width:min(100%,240px)}.specimen-field .wordmark{width:min(100%,520px)}figcaption{display:flex;flex-wrap:wrap;justify-content:space-between;gap:var(--s2) var(--s3);font-size:1rem;color:var(--muted)}figcaption span{display:block}.usage-row{display:grid;grid-template-columns:1.1fr 1fr;gap:var(--s6);padding-block:var(--s5);border-top:var(--rule) solid var(--muted)}.horizontal-sample,.usage-note{--od-gap:var(--s4)}.lockup-field{display:grid;place-items:center;min-height:152px}.horizontal{width:min(100%,520px)}h3{font-size:1.125rem;font-weight:700}.usage-note p{max-width:60ch;color:var(--muted)}.dimensions{display:flex;flex-wrap:wrap;gap:var(--s4)}.dimensions>div{--od-gap:var(--s2)}dt{color:var(--muted);font-size:1rem}dd{font-size:1.25rem}details{border-top:var(--rule) solid var(--muted)}summary{display:flex;align-items:center;justify-content:space-between;gap:var(--s4);padding-block:var(--s4);min-height:56px;list-style:none}summary::-webkit-details-marker{display:none}summary>span:first-child{display:block;min-width:0}.plus{display:block;position:relative;flex:none;width:16px;height:16px}.plus::before,.plus::after{content:'';position:absolute;background:var(--muted)}.plus::before{left:0;top:7px;width:16px;height:var(--rule)}.plus::after{left:7px;top:0;width:var(--rule);height:16px;transition:transform var(--duration) var(--ease)}details[open] .plus::after{transform:scaleY(0)}.secondary-specimens{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s4);padding-block:var(--s3) var(--s5)}.secondary-specimens figure{--od-gap:var(--s3)}.variant-field{display:grid;place-items:center;min-height:240px;padding:var(--s4);background:var(--surface)}.variant-field.light{background:var(--ink)}.stacked{width:min(100%,240px)}.mono-symbol{width:min(100%,160px)}.downloads{padding-block:var(--s5)}.downloads h3{margin-bottom:var(--s4)}.download-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s2) var(--s4)}.download{display:flex;justify-content:space-between;align-items:center;gap:var(--s3);min-height:48px;text-decoration:none;padding-block:var(--s2)}.download span{display:block}.download span:last-child{transition:transform var(--duration) var(--ease)}.detail-copy{--od-gap:var(--s3);max-width:72ch;padding-block:var(--s3) var(--s5);color:var(--muted)}.detail-copy h3{color:var(--ink);margin-top:var(--s3)}pre{display:block;max-width:100%;padding:var(--s3);margin:0;background:var(--surface);color:var(--ink);font:inherit;white-space:pre-wrap;overflow-wrap:anywhere}code{font:inherit}.concept-figure{--od-gap:var(--s3);padding-block:var(--s3) var(--s5)}.palette-section{padding-block:var(--s7);border-top:var(--rule) solid var(--muted)}.palette-section h2,.choose h2{font-size:clamp(1.75rem,3.5vw,3rem);font-weight:400;margin-bottom:var(--s4)}.palette-section>p{max-width:72ch;color:var(--muted)}.swatches{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--s4);margin-top:var(--s5)}.swatch{--od-gap:var(--s3)}.swatch-sample{display:block;width:100%;height:64px;border:var(--rule) solid var(--muted)}.swatch .od-field{--od-gap:var(--s1)}.swatch .od-field span{color:var(--muted)}.choose{padding-block:var(--s6) var(--s7)}.comparison{display:grid;gap:var(--s4)}.comparison .od-row-top{--od-gap:var(--s4)}.comparison strong{min-width:9ch;flex:none;font-weight:400}.comparison p{color:var(--muted);max-width:65ch}.resource-links{display:flex;flex-wrap:wrap;gap:var(--s3) var(--s5);margin-top:var(--s5)}.resource-links a{display:flex;align-items:center;min-height:44px;gap:var(--s2)}.site-footer{border-top:var(--rule) solid var(--muted);padding-block:var(--s4);color:var(--muted)}.footer-inner{display:flex;flex-wrap:wrap;justify-content:space-between;gap:var(--s3)}.footer-inner a{display:inline-flex;align-items:center;min-height:44px}.footer-inner p{max-width:64ch}
@media(hover:hover){.route-nav a:hover .nav-arrow{transform:translateY(4px)}.download:hover span:last-child{transform:translate(4px,4px)}.portfolio-link:hover span:last-child{transform:translate(4px,-4px)}summary:hover>span:first-child,.download:hover>span:first-child,.section-link:hover{text-decoration:underline;text-underline-offset:6px}}
.route-nav a:focus-visible .nav-arrow{transform:translateY(4px)}.download:focus-visible span:last-child{transform:translate(4px,4px)}.portfolio-link:focus-visible span:last-child{transform:translate(4px,-4px)}.route-nav a:active .nav-arrow,.download:active span:last-child,.portfolio-link:active span:last-child{transform:none}
@media(max-width:1023px){.secondary-specimens{grid-template-columns:repeat(2,minmax(0,1fr))}.secondary-specimens figure:last-child{grid-column:1/-1}.usage-row{gap:var(--s5)}.download-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:767px){:root{--gutter:16px}.header-inner{gap:var(--s3)}.home-link{gap:var(--s2)}.header-title{display:none}.intro{padding-block:var(--s6)}.route-nav{grid-template-columns:1fr;gap:0;margin-top:var(--s5)}.route-nav a{padding-block:var(--s3)}.route-nav .od-field{display:flex;gap:var(--s4);align-items:baseline}.direction{padding-block:var(--s6)}.direction-heading{flex-wrap:wrap;--od-gap:var(--s3)}.section-link{margin-left:0;flex-basis:100%}.hero-specimens,.usage-row{grid-template-columns:1fr;gap:var(--s4)}.specimen-field{min-height:200px;padding:var(--s4)}.specimen-field .symbol{width:min(100%,200px)}.hero-specimens{padding-bottom:var(--s4)}.secondary-specimens{grid-template-columns:1fr}.secondary-specimens figure:last-child{grid-column:auto}.variant-field{min-height:200px}.download-grid{grid-template-columns:1fr}.swatches{grid-template-columns:repeat(2,minmax(0,1fr))}.palette-section{padding-block:var(--s6)}.comparison .od-row-top{flex-wrap:wrap;--od-gap:var(--s2)}.comparison strong{flex-basis:100%}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}html{scroll-behavior:auto}}
@media(forced-colors:active){a,summary{color:LinkText}.specimen-field,.variant-field,.lockup-field{forced-color-adjust:none}.plus::before,.plus::after{background:ButtonText}.swatch-sample{forced-color-adjust:none}}
h1,h2,h3{overflow-wrap:anywhere}.download span{min-width:0;overflow-wrap:anywhere}
'''

palette_html = ''.join(f'<div class="swatch od-stack"><span class="swatch-sample" style="background:{value}" aria-hidden="true"></span><div class="od-field"><strong>{label}</strong><span>{value}</span></div></div>' for label,value in [('Black','#000000'),('White','#F5F7FA'),('Neutral','#B8B8B8'),('Royal blue','#4C70F0')])
nav_html = ''.join(f'<a href="#{r["id"]}"><span class="od-field"><span class="number">{r["number"]}</span><span class="nav-name">{r["name"]}</span></span><span class="nav-arrow" aria-hidden="true">&#8595;</span></a>' for r in ROUTES)
page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#000000"><meta name="description" content="Three identity directions for Zeyad Omran: Panel, Fold and Baseline. Compare symbols, wordmarks, lockups and editable SVG assets."><title>Zeyad Omran / Identity directions</title><link rel="icon" href="../assets/zo-logo.svg" type="image/svg+xml"><style>
{layout}
{page_css}
</style></head><body><a class="skip" href="#main">Skip to identity directions</a>
<header class="site-header"><div class="header-inner wrap"><a class="home-link" href="#overview"><img class="current-logo" src="../assets/zo-logo.svg" width="100" height="100" alt="Zeyad Omran"><span class="header-title">Identity directions</span></a><a class="portfolio-link" href="../index.html"><span>Portfolio</span><span aria-hidden="true">&#8599;</span></a></div></header>
<main class="wrap" id="main"><section class="intro" id="overview" aria-labelledby="page-title"><p class="eyebrow">Zeyad Omran / Identity studies</p><h1 id="page-title"><span>One name.</span><span>Three directions.</span></h1><p class="intro-copy">A modular system, a compact monogram, and an identity led by the name. Each starts from the same black canvas, Space Mono lettering and one blue accent.</p><p class="status-note"><strong>Three proposals, ready to compare.</strong> The current portfolio mark stays in place. Each direction below includes editable SVGs and usage rules.</p><nav class="route-nav" aria-label="Identity directions">{nav_html}</nav></section>
{''.join(sections)}
<section class="palette-section" id="palette" aria-labelledby="palette-title"><p class="eyebrow">Shared palette</p><h2 id="palette-title">One accent. A different role.</h2><p>The palette remains consistent with the portfolio. The distinction comes from geometry, typography and where the blue square belongs.</p><div class="swatches">{palette_html}</div></section>
<section class="choose" aria-labelledby="choose-title"><h2 id="choose-title">What each direction brings.</h2><div class="comparison"><div class="od-row-top"><strong>Panel</strong><p>Continuity with the current outlined mark and the modular scene geometry.</p></div><div class="od-row-top"><strong>Fold</strong><p>A compact silhouette with more visual weight in a small header placement.</p></div><div class="od-row-top"><strong>Baseline</strong><p>A more personal emphasis on the name, with a restrained supporting symbol.</p></div></div><div class="resource-links"><a href="guide.md">Usage guide <span aria-hidden="true">&#8599;</span></a><a href="prompts.md">Generation prompts <span aria-hidden="true">&#8599;</span></a><a href="../assets/identity/manifest.json" download>Asset manifest <span aria-hidden="true">&#8600;</span></a><a href="../assets/OFL-SpaceMono.txt">Font license <span aria-hidden="true">&#8599;</span></a></div></section></main>
<footer class="site-footer"><div class="footer-inner wrap"><p>Zeyad Omran / Panel, Fold, Baseline</p><a href="#overview">Back to directions &#8593;</a></div></footer>
</body></html>
'''
write('identity/index.html', page)

# The canonical entry is finalized last. No post-write checks or previews follow.
favicon = '  <link rel="icon" href="assets/zo-logo.svg" type="image/svg+xml">\n'
entry = entry.replace('  <link rel="preload"', favicon + '  <link rel="preload"', 1)
ENTRY.write_bytes(entry.replace('\n', '\r\n').encode('utf-8'))
print('Delivered identity/index.html, 18 SVG assets, three localized concept boards, the usage guide and exact prompts. Updated index.html with the existing logo favicon.')
