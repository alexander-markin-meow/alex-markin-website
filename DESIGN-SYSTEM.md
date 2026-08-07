# alex-markin.com design system

Quiet, typographic, and lowercase, with subtle web-1.0 details. The homepage is a seeded
generative edition; all other standard pages use its original dark serif/mono appearance.
Static HTML + CSS, no build step.
This file is the source of truth. If you (human or LLM) are editing the site, read this first;
every visual decision below is deliberate.

## voice

- **all lowercase, everywhere** — headings, name, links, tags, footer. The only exception is
  proper nouns inside descriptions where lowercase would be confusing.
- Compact, understated, no exclamation marks, no emoji.

## base color tokens (defined in `styles.css :root`)

These are the permanent palette for the cv and trials catalogue and the starting palette for
the homepage's `simple` appearance. Homepage editions may override them only through the
bounded palettes in `appearance.js` and `appearances.css`.

| token | value | use |
|---|---|---|
| `--bg` | `#000000` | base page background |
| `--ink` | `#ccc6b9` | body text and link default |
| `--ink-bright` | `#eae5da` | display text (the name) only |
| `--ink-hover` | `#ffffff` | link hover |
| `--muted` | `#847e70` | descriptions, taglines, secondary text |
| `--faint` | `#66614f` | mono tags, metadata |
| `--footnote` | `#5c574a` | footer text |
| `--accent` | `#7d8f5c` | olive. section headings and compact meta/subheader lines ONLY. never for body text or backgrounds |
| `--hairline` | `#35322a` | dotted leader lines |
| `--rule` | `#24221d` | solid horizontal rules |
| `--border` | `#2a2822` | 1px borders on images and chips |
| `--chip-bg` | `#131311` | chip/inset backgrounds |

Rules for non-generative pages:
- The palette is warm grey on black plus one olive accent. Do not introduce new hues.
- Need a new shade? Stay between `--footnote` and `--ink-bright` on the same warm axis.
- Accent is scarce by design — if more than headings + compact meta lines are olive, it's wrong.

## type tokens

Two families, loaded from Google Fonts:
- `--serif` = **Source Serif 4** — all reading text (links, descriptions, taglines).
- `--mono` = **IBM Plex Mono** — the "machine voice": the name, section headings, tags,
  metadata, footer. Anything that annotates rather than reads.

Scale (don't invent sizes; pick the closest):
- `--fs-display` 44px / mono 600 / lowercase — the name (32px on mobile)
- `--fs-body` 16px / serif 400 / line-height 1.55 — links, body
- `--fs-desc` 14.5px / serif — descriptions under links
- `--fs-heading` 12px / mono 500 / letter-spacing 0.14em / lowercase — section headings
- `--fs-meta` 11.5px / mono / letter-spacing 0.08em — header meta line
- `--fs-tag` 11px / mono — leader-line tags
- `--fs-footer` 10.5px / mono / letter-spacing 0.06em — footer

## layout

- `.page`: max-width 1100px, centered, padding 36px 48px 12px (36/24/12 mobile). The
  12px bottom padding mirrors the footer's 12px divider-to-text spacing.
- `.page--narrow`: max-width 780px with the same padding and mobile behaviour. Use it for
  a single reading or catalogue column that should not stretch across a wide display.
- On the homepage and cv, the identity header keeps its side-by-side desktop layout, then
  centers the portrait, name, tagline, and meta line as one stacked block at 640px and below.
- `.columns`: CSS grid, `repeat(auto-fit, minmax(340px, 1fr))`, gap 44px 64px.
  Columns collapse to a single stack below ~750px automatically — no media query needed.
  New sections go inside `.columns` as another `<section>`; the grid handles placement.
- Spacing rhythm: 48px between major blocks, 14px after headings, 8px between list rows,
  18px between publication entries.

## core patterns (copy these verbatim)

### link row with dotted leader + tag
The signature pattern. Title left, dotted line fills the middle, lowercase mono tag right.

```html
<li class="row"><a href="…">title of thing</a><span class="leader"></span><span class="tag">tag</span></li>
```

- Tags are one lowercase word: `phone` `mail` `ig` `photos` `social` `books` `work`
  `code` `project` `press` `video` `film` `cv` `bar` `brew` `service` `guests`
  `photo`. Reuse before inventing.
- The first link's hit area covers the full row, including the dotted leader and tag.
- Links: no underline, `--ink`, hover to pure white. Nothing else changes on hover. External
  links append a compact mono `↗︎` marker with a narrow gap and the Unicode text-presentation
  selector; never permit emoji presentation. Deliberate internal navigation uses
  `.internal-link` and a mono `→`; identity, image, and back links remain unmarked because their
  direction is already clear. Photo links are also unmarked because the image signals interaction.

### publication entry (row + description)
```html
<li>
  <div class="row"><a href="…">title</a><span class="leader"></span><span class="tag">press</span></div>
  <div class="desc">one-line lowercase description</div>
</li>
```
Inline links inside `.desc` render in `--accent`.

### identity header (`/` and `/cv` only)
The portrait-and-name identity block belongs only on the homepage and cv. On the cv, the
portrait and name link back to `/`. Product and catalogue pages omit the identity block and
use the footer's `alex-markin.com` link as their route home.

```html
<!-- generative homepage -->
<span class="appearance-image appearance-image--portrait">
  <img class="photo" src="photo.jpg?v=YYYYMMDD-N" alt="…" />
</span>

<!-- non-generative cv -->
<a class="photo-link" href="/"><img class="photo" src="photo.jpg?v=YYYYMMDD-N" alt="…" /></a>
<h1 class="name"><a href="/">alex markin</a></h1>
```

The anchors are layout-neutral: `.photo-link` is `display: block; flex: none; line-height: 0`
so the portrait keeps its square, and `.name a` inherits `--ink-bright` rather than the
default link `--ink`, hovering to white like everything else. The portrait itself gets no
hover treatment — its grayscale and border are unchanged.

### cv entry (`cv.html`)
Role on the left, dotted leader, date range on the right; the workplace on the line
below, then optional detail lines. Used by both `experience` and `education`.

```html
<li>
  <div class="row"><span>barista</span><span class="leader"></span><span class="dates">jun 2025 – present</span></div>
  <div class="desc">darcy's kaffe, copenhagen</div>
  <ul class="notes">
    <li>one lowercase point per line</li>
  </ul>
</li>
```

- `.dates` occupies the `.tag` slot and shares its mono `--faint` voice, but holds
  free-form text instead of a one-word tag, so it never wraps. Use it only for date
  ranges — a categorical label is still a `.tag`.
- `.entries` shares the `.pubs` 18px rhythm; the two are one rule in `styles.css`.
- `.notes` are `.desc` voice with no bullet markers. Keep each to one line where possible.
- A `.row` does not need a link. Without one it simply loses the full-row hit area —
  used by the cv `skills` list, where the row is a statement, not a destination.

### section
```html
<section>
  <h2 class="heading">section name</h2>
  <ul class="links">…</ul>
</section>
```

### stacked sections in one column
Two short sections sharing a single grid cell (e.g. contact above social).
Wrap them in `.stack`; it stacks with the standard `--gap-row` (44px) between them.

```html
<div class="stack">
  <section>…</section>
  <section>…</section>
</div>
```

### footer
Solid `--rule` top border and a three-column mono grid: an `upd YYYY-MM-DD` link to the
site repository at left, the document utility centered, and an optional affiliation or return
link at right. The trials catalogue uses `alex-markin.com` to return home. Update the date when
you ship a change. Footer links
inherit the muted footer color and turn white on hover. The `copy as markdown` control uses a
thin `--border` outline with no fill; the outline, pointer cursor, and color-only hover make it
legible as clickable without drawing focus. On mobile it reads `copy`, then switches to a copy
glyph only when the measured footer cannot fit all three items on one line; an exceptionally
narrow viewport uses a deliberate second row rather than allowing text to collide. It builds its
output from the live semantic HTML at click time; do not add or maintain a separate Markdown copy
of the page.

### images
Source photographs are black-and-white. On generative homepage images, wrap the `<img>` in
`.appearance-image`; add `.appearance-image--portrait` to the identity portrait. The wrapper
owns the standard 1px `--border`, 2px radius, and crop, while the image stays semantically real
and source-resolution independent. The portrait remains a 148px square (116px mobile).
Non-generative pages retain the standard slight `grayscale(0.25)` image treatment.

## web-1.0 flavor — the boundaries

Allowed (subtle, typographic): dotted leaders, mono tags and timestamps,
"upd" footer, optional visitor-counter chip
(`<span class="counter-chip">004821</span>`).

**Live "how long ago" timestamp (`.ago`)** — a mono `--faint` span placed inside a
`.row` between the link and the `.leader`, filled from the GitHub API on load by the
inline script at the end of `index.html`. Reads as machine annotation (e.g. `upd 3
days ago`). Drive it with a data attribute, never hard-code the text:
`data-repo="owner/name"` → repo `pushed_at`; `data-user="login"` → latest public event.
GitHub-backed spans also carry `data-fallback-updated="<ISO timestamp>"`. `site.js` renders
the latest successful value cached in local storage, otherwise this authored timestamp,
before requesting fresh API data. A rate limit or offline request must never make a previously
known update label disappear; refresh authored fallbacks whenever the site itself is shipped.
Minute values use the compact `min` abbreviation for both singular and plural (e.g.
`upd 1 min ago`, `upd 3 min ago`), never `minute` or `minutes`. Live update statuses use
the compact `upd` prefix, never `updated`; the footer uses `upd YYYY-MM-DD`.
The span starts empty and `.ago:empty` hides it, so a failed or slow fetch leaves no gap.

**Live local clock (`.clock`)** — an empty span at the end of the header `.meta` line,
filled by the same inline script in compact 12-hour form (for example ` · 1:13pm`) in
`Europe/Copenhagen` time (copenhagen
and berlin share a timezone) and re-ticked every 30s. Inherits the meta line's mono olive;
add no color. Empty (and invisible) if `Intl` is unavailable.

The flickr `.ago` (id `flickr-ago`, `data-flickr="NSID"`) remains tied to the general public
photostream. Its JSONP callback fills the span from the newest public upload's `published`
date.

The `.flickr-latest` section is independent and uses the public album feed configured by
`data-flickr-set` and `data-flickr-nsid`. A separate JSONP callback takes the first album-feed
item and refreshes the photo, link, and title. The HTML includes the newest known album item
as a crawlable fallback, so a feed failure still leaves a working image and non-JavaScript
crawlers can understand the photography. Refresh that fallback whenever the site itself is
updated; adding a photo to the configured album remains the only action needed to update the
displayed image for visitors. The displayed image follows the standard content-photo border,
radius, and grayscale treatment.
Not allowed: bevels, marquees, animated gifs, table layouts, coloured link-visited states,
under-construction banners. The nostalgia is a seasoning, not the dish.

## generative homepage appearances

The homepage separates content from presentation. `index.html` remains the single semantic
content source. `appearance.js` composes an edition before CSS paints, and `appearances.css`
renders it. Do not duplicate, reorder, or rewrite content for an appearance.

Seven appearances have equal default probability:

- `smpl` (`simple` internally) — the original Source Serif + IBM Plex Mono layout, with seeded olive, slate blue,
  muted terracotta, dusty violet, or aged brass palettes and bounded changes to scale, width,
  and spacing.
- `paper` — an all-Source-Serif editorial edition on ivory, cream, or newsprint stock, with
  bounded ink temperature, scale, width, heading treatment, and rule style. Its generated
  `feTurbulence` grain is always a top layer over the complete edition. A second, much lighter
  seeded SVG stock texture is chosen independently from three families: directional `laid`
  fibres, smooth `vellum` pulp, or softly lit `watercolour` tooth. An explicit layer follows the
  full rendered document height, so it scrolls with the sheet while printing consistently over
  text and photographs; it never tracks the viewport. The stock field is remapped toward
  paper-white before a `multiply` pass, keeping the sheet bright while selective fibres remain
  legible. Texture opacity stays within `0.10–0.23`; laid stock uses the quietest range, while
  vellum receives larger pulp variation and watercolour the strongest shallow relief.
- `blob` (`blobs` internally) — bold type over 3–5 diffuse color fields. Each edition selects
  one readability-tested pairing from sans, Source Serif, and IBM Plex Mono; body, display,
  and annotations may vary, but no edition contains more than two font families. Its accent is
  independently chosen from readable violet, blue, mint, coral, rose, gold, or sage families.
  Every blob
  independently varies in hue, saturation, lightness, opacity, size, blur, and autonomous
  drift path. As on `louppe.eu`, autonomous drift runs on a cached inner surface, while a
  lightweight outer track compensates page scroll so each blob travels at its seeded `0.45–0.85`
  scroll-speed multiplier. Keeping those compositor layers separate prevents large blurred
  fields from being re-rasterized on mobile scroll. Mobile editions reveal one or two additional seeded fields from a
  seven-field pool to cover their longer document. A separate atmospheric grain layer prints over all content. Both
  motions become static under `prefers-reduced-motion`. Text and image links bloom on hover/focus
  using only the selected edition accent; near strength, far strength, and radius are tightly seeded.
- `eno` — the complete responsive document is one luminous lightbox rather than a collection of
  decorative objects. A seed selects a vertical, horizontal, quartered, central-window, or
  softened concentric core-and-ring halo composition; one light or dark contrast family;
  bounded divisions, diffusion, and color saturation capped at `80%`,
  and curated turquoise/pink/crimson, amber/orange/red, green/lime/cyan, or
  blue/violet/magenta schemes. Three related edge-to-edge color states crossfade over
  `180–480s` with bounded `±24°` hue travel. Montserrat supplies the geometric album-art voice:
  the display name and headings render uppercase through CSS with wide tracking, while authored
  content remains lowercase. Text colors remain fixed inside the selected contrast family.
  The absolute lightbox recalculates to the body's full height at every mobile, tablet, and
  desktop layout, so scrolling travels through one continuous artwork instead of keeping a
  viewport-sized pattern fixed behind the content. The root repeats the first state only as an
  elastic-overscroll fallback. Controls remain transparent so the lightbox itself is their fill.
  A fine topmost diffuser grain remains visible at a restrained `0.035–0.060` opacity.
  Reduced motion shows the first seeded state.
- `70mm` — a projected-film edition with the content framed between two horizontal perforation
  strips. The appearance selector remains above the top strip and the footer remains below the
  bottom strip, keeping both utilities outside the picture gate. Every seed independently chooses
  one restrained tungsten, warm-print, or silver palette; one serif from Source Serif 4,
  Cormorant Garamond, or Georgia; one mono from IBM Plex Mono, Courier Prime, or Roboto Mono;
  and one of three readable serif/mono role assignments that always uses both voices. Page width,
  spacing, display scale, grain, vignette, bloom, red halation radius, perforation pitch and height,
  light-leak positions, and image development vary inside bounded brackets. Three large blurred
  light fields remain behind the semantic content. Bright display elements receive a quiet white
  bloom; link hover/focus, selected appearance controls, and utility-button hover use a brighter
  white core with a restrained red Cinestill-like halation fringe. High-resolution grain remains
  above all type, photographs, controls, and perforation bands.
- `crt` — VT323 bitmap type throughout, using a fixed hardware-aligned signal treatment based on
  `/trials/scanline/`: one-device-pixel horizontal beam gaps and vertical RGB phosphor cells,
  a visible rolling refresh band, restrained seeded per-phosphor convergence/bloom and signal
  noise, tube vignette, and a square-cell pixel pointer. The seed chooses from restrained green,
  amber, blue, violet, rose, cyan-phosphor, and cool monochrome families; all retain tested text
  contrast and avoid high saturation. Each edition rotates the RGB-cell phase and moves only the
  red/blue phosphor fringes by at most one physical cell; layout and source glyphs never move.
  Native text selection uses the RGB inverse of the selected accent (amber selects blue, green
  selects magenta, and blue selects brown). The page is never passed through a whole-page filter:
  glyphs are pixel-shaped at the source, the portrait is rendered at half resolution with
  nearest-neighbour expansion, and the screen grid sits directly on device-pixel boundaries.
  Text links invert into a clear phosphor selection block on hover/focus, and their unchanged
  text-presentation `↗︎` / `→` markers render at body scale. Footer selection blocks remain
  content-width instead of stretching across their grid cells; the `appearance ↻` and `copy as
  markdown` utilities receive bounded phosphor glow. A fixed seed-colored signal layer covers
  elastic overscroll outside the document; reduced motion removes the rolling band. Never add
  flicker or text displacement.
- `>...` (`terminal` internally) — one seeded technical face is used throughout each edition:
  DEC-inspired VT323, workstation-like Fira Mono, or modern-console Roboto Mono. The family,
  tuned size, weight, tracking, and line spacing vary together as a bounded preset rather than
  mixing faces inside one view. Quiet prompt prefixes, solid leaders, restrained green/blue/amber
  palettes, slight grain, and a narrower reading measure vary independently. Fira Mono and
  Roboto Mono use an `18–19px` body / `44–48px` display scale; VT323 uses a larger
  `20–22px` body / `54–62px` display scale to compensate for its raster-style x-height. Text
  links invert against the selected terminal accent on hover/focus, using a content-width
  selection block without CRT glow.

Grain must use the procedural system shared with `/trials/background/` and `louppe.eu`: a
seeded SVG `feTurbulence` tile, never a repeating dot or halftone gradient. The shared reference
is a 512px seamless sRGB `fractalNoise` tile at `0.65` base frequency and four octaves, processed
near `contrast(2.4) brightness(0.72)` and shifted in discrete steps around every `840ms`.
Every tile is at least 512 CSS pixels, uses four or five octaves, and is internally rasterized at
four times that resolution without changing its apparent noise size. Noise is converted to
monochrome before blending to prevent colored raster artifacts; lower-resolution grain is not
allowed. Each grain-bearing edition independently randomizes tile size, noise frequency, octave
count, contrast, brightness, strength, and stepped shift rate inside tight brackets around that
reference. Paper uses a slightly lower `0.50–0.62` frequency range for larger physical grain and blends the
grain over the complete page with `multiply`; blobs use a topmost `screen` surface;
Eno uses a very light, slightly finer topmost diffuser grain; 70mm uses a visible projected-film
surface; terminal and CRT keep their lighter surface treatment.
Reduced motion freezes the tile.

The shared random brackets are: `512–560px` tile, `0.60–0.72` frequency, four or five
octaves, `2.20–2.60` contrast, `0.68–0.78` brightness, and `720–960ms` step rate. Paper
may extend to `576px`; Eno uses `0.65–0.76`, 70mm uses `0.54–0.68`, CRT uses `0.62–0.76`,
and terminal uses `0.58–0.72`. Opacity stays appearance-specific: paper `0.10–0.17`, blob
`0.08–0.14`, Eno `0.035–0.060`, 70mm `0.07–0.12`, CRT `0.026–0.042`, and terminal
`0.030–0.055`.

All random values are derived from one edition seed. `?seed=<value>` reproduces an edition;
`?look=<name>&seed=<value>` pins both its appearance and values. Both the displayed aliases
(`smpl`, `blob`, `70mm`, `>...`) and the existing internal names remain accepted so old links keep working.
An ordinary load without these
parameters generates a new seed. The first utility row on the homepage switches immediately,
does not persist, and removes pinned parameters so the next reload is random again. Its reload
glyph composes a new random appearance and edition without requiring a page refresh. The word
`appearance` and the reload glyph are one compact outlined button, not separate controls. The
control's top inset matches the footer's bottom inset. It and `copy as markdown` share the same
fixed height while their widths remain content-sized and never force either label to wrap.
On mobile, seed/status text is hidden and all seven style choices form a compact left cluster in
one row, beginning exactly at the content divider's left edge. The symbol-only randomize button
is pushed to the opposite side with its right edge aligned exactly to the divider's right edge.

Readability is not random: semantic order, links, click areas, responsive behaviour, accessible
contrast, and the minimum type sizes stay fixed. Decorative noise never receives pointer events.
Every text link on the generative homepage changes tone or color on hover/focus; do not add
underlines or baseline effects because the layout already uses leader lines and rules. Image links
answer with an accent border. CRT uses a phosphor selection block, Terminal uses a clean selection
inversion, Blob adds its documented seed-colored bloom, and 70mm uses red halation.
The blob layer never contains content. Generated columns use an appearance-aware minimum width;
long rows may wrap instead of clipping, and the display name scales against its actual identity
text container so it remains on one line. The homepage uses `viewport-fit=cover`: visual layers
paint through mobile safe areas, while page padding incorporates every safe-area inset so content
remains clear of device controls. Keep stronger texture reduced on small screens and honor the
visitor's motion preference.

Image geometry is invariant across appearances: retain the standard border, radius, crop, and
dimensions from `styles.css`. Color development is appearance-aware and operates non-destructively
on the black-and-white source. The wrapper is transparent and must not isolate blending or
reconstruct a miniature appearance inside the frame. Paper uses `multiply` against the actual
stock beneath it, replacing photographic whites with paper while the page grain prints across
the image. Blob, Eno, and 70mm use `luminosity` against the real pixels physically behind the image, so
color appears only where the live page artwork is present at that position. Simple applies only
the baseline black-and-white conversion: no contrast, opacity, tint, or blend treatment. CRT and
terminal retain bounded monochrome development, with the CRT page mask above the result. The
homepage portrait alone uses a `120%` absolutely positioned inner image inside its clipped,
unchanged frame for a closer face crop; do not use a transformed image layer. Do not
use per-file color edits or change image-frame geometry for a look.

## pages

- `/` → `index.html` — the generative identity page. It alone loads `appearance.js` and
  `appearances.css` and includes the manual appearance control.
- `/cv` → `cv.html` — the working cv. GitHub Pages resolves the extensionless `/cv` to
  `cv.html` on its own; no redirect or folder is needed. Reachable from the homepage
  `contact` list via the `cv` tag.
- `/louppe/` → `louppe/index.html` — legacy redirect to the standalone louppe site at
  `https://louppe.eu/`. The homepage project entry links directly to the new domain.
- `/trials/` → `trials/index.html` — a standalone, one-column catalogue of interactive
  webdesign experiments. It omits the portrait and personal identity block so the trials
  remain the page's only subject. It uses the narrow page shell, one muted explanatory line,
  standard publication rows, and an `alex-markin.com` footer link back to the homepage.
- `/trials/<name>/` → an immersive experiment. These pages use the scoped
  `trials/_shared/` layer described below.

## immersive experiment pages

Experiments are artwork presented by the site, not alternate site shells. Their chrome
uses the site's black, warm-grey, olive, Source Serif, and IBM Plex Mono tokens, while the
rendered effect may introduce whatever colors, gradients, or motion its concept requires.

To protect the experiment and the rest of the site from each other:

- Load only `trials/_shared/trial.css` and `trial-ui.js`; never load them on `/`, `/cv`,
  or `/trials/`, and never load the main `styles.css` inside an immersive experiment.
- Keep experiment-specific CSS and rendering JavaScript in that experiment's page.
- Build panel ranges, color pickers, text fields, and toggles through `TrialUI` so labels,
  reset syncing, keyboard focus, and disabled states remain consistent across experiments.
- Use the minimal `← trials` link back to the collection. The standard identity header
  and footer are intentionally omitted on these full-screen or effect-led pages.
- Use the main favicon, fonts, analytics id, canonical metadata, and lowercase voice.
- Keep experimental colors inside the effect. Site chrome and controls stay within the
  main palette.

## shared behaviour (`site.js`)

All page behaviour lives in one file loaded by every page: the live `.ago` timestamps,
the header clock, both flickr feeds, and `copy as markdown`. Each block no-ops when its
elements are absent, so the same file is safe on any page — a page without a flickr
section simply skips it. Do not re-inline this script into a page; add to `site.js`
instead, and bump its `?v=` alongside the stylesheet's.

`copy as markdown` walks the live semantic HTML, so a new page is handled automatically
provided it uses the documented patterns. It reads a row's right-hand annotation from
either `.tag` or `.dates`, renders `.notes` as nested bullets, and picks up a
`section > .tagline`, `section > .meta`, or `section > .desc` as prose. A product
section may use `.name` instead of `.heading` for its display-sized subject; the copier
recognizes either.

Immersive experiments are the exception: their shared panel construction lives in
`trials/_shared/trial-ui.js`, which is never loaded by standard site pages.

Homepage appearance behaviour is a second deliberate exception: it lives in `appearance.js`
because it must run synchronously in the document head before CSS paints. Do not merge it into
the deferred shared behaviour in `site.js`.

## adding a new page

1. Copy `cv.html`'s standard `<head>` (fonts + `styles.css`) and `.page` shell, and load
   `site.js` at the end of `<body>`.
2. Reuse `.columns` / `.heading` / `.row` patterns, and `.intro` only for identity pages —
   do not write new CSS unless a pattern is genuinely missing.
3. If a new pattern is needed: build it from tokens only, add it to `styles.css` under a
   commented section, and document it in this file.
4. Keep every page's footer format identical.

## cache-busting

`index.html` links the stylesheet as `styles.css?v=YYYYMMDD` (append `-N` for additional
changes shipped on the same day). GitHub Pages serves
`styles.css` with `Cache-Control: max-age=600`, so without the query a returning visitor
can load new HTML against a stale cached stylesheet. **Bump the `?v=` date whenever you
edit `styles.css`** (keep it in sync with the footer's `upd` date).

Apply the same dated `?v=` convention to `trials/_shared/trial.css` and `trial-ui.js` on
every immersive experiment page whenever either shared trial asset changes.

The homepage additionally versions `appearance.js` and `appearances.css`. Bump each asset's
own dated query whenever it changes; neither generative file belongs on the other pages.
The profile photograph uses the same dated query in the visible HTML and structured data; bump
both occurrences together whenever `photo.jpg` is replaced. Social cards use the independent
`social-preview.png` asset so its crop and typography can remain stable when the live portrait
changes. That preview places `#arts #photography #specialty-coffee` in white serif type across the
top of the photograph. Version its Open Graph and X metadata URL independently whenever it changes.

## don'ts

- On non-generative pages, no new fonts, hues, or font sizes outside the base scale.
- No borders/underlines on links (hover is a color change only).
- No rounded corners beyond `--radius: 2px`, shadows, gradients, or uppercase on non-generative
  pages. The bounded `blobs`, `70mm`, and `crt` appearances are documented exceptions.
- Authored content remains lowercase everywhere; CRT and Eno may render the name and headings
  uppercase with CSS only.
- Don't restyle with inline `style=""` attributes — extend `styles.css` via tokens.
- Experimental gradients, colors, and motion are allowed inside immersive trial effects and the
  documented generative homepage appearances only.
