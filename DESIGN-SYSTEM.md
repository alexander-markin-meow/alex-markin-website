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
<a class="photo-link" href="/"><img class="photo" src="photo.jpg" alt="…" /></a>
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
Solid `--rule` top border and a three-column mono grid: a `last upd YYYY-MM-DD` link to the
site repository at left, the document utility centered, and an optional affiliation or return
link at right. The trials catalogue uses `alex-markin.com` to return home. Update the date when
you ship a change. Footer links
inherit the muted footer color and turn white on hover. The `copy as markdown` control uses a
thin `--border` outline with no fill; the outline, pointer cursor, and color-only hover make it
legible as clickable without drawing focus. It builds its output from the live semantic HTML at
click time; do not add or maintain a separate Markdown copy of the page.

### images
1px `--border`, 2px radius, slight `grayscale(0.25)`. The portrait is a 148px square
(116px mobile), `object-position` tuned to the face. Content photos may be wider but keep
the border + radius + grayscale treatment.

## web-1.0 flavor — the boundaries

Allowed (subtle, typographic): dotted leaders, mono tags and timestamps,
"last upd" footer, optional visitor-counter chip
(`<span class="counter-chip">004821</span>`).

**Live "how long ago" timestamp (`.ago`)** — a mono `--faint` span placed inside a
`.row` between the link and the `.leader`, filled from the GitHub API on load by the
inline script at the end of `index.html`. Reads as machine annotation (e.g. `upd 3
days ago`). Drive it with a data attribute, never hard-code the text:
`data-repo="owner/name"` → repo `pushed_at`; `data-user="login"` → latest public event.
Minute values use the compact `min` abbreviation for both singular and plural (e.g.
`upd 1 min ago`, `upd 3 min ago`), never `minute` or `minutes`. Live update statuses use
the compact `upd` prefix, never `updated`; the footer reads `last upd`.
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

Six appearances have equal default probability:

- `smpl` (`simple` internally) — the original Source Serif + IBM Plex Mono layout, with seeded olive, slate blue,
  muted terracotta, dusty violet, or aged brass palettes and bounded changes to scale, width,
  and spacing.
- `paper` — an all-Source-Serif editorial edition on ivory, cream, or newsprint stock, with
  bounded ink temperature, scale, width, heading treatment, and rule style. Its generated
  `feTurbulence` grain is always a top layer over the complete edition.
- `blob` (`blobs` internally) — bold type over 3–5 diffuse color fields. Each edition selects
  one readability-tested pairing from sans, Source Serif, and IBM Plex Mono; body, display,
  and annotations may vary, but no edition contains more than two font families. Its accent is
  independently chosen from readable violet, blue, mint, coral, rose, gold, or sage families.
  Every blob
  independently varies in hue, saturation, lightness, opacity, size, blur, and autonomous
  drift path. As on `louppe.eu`, autonomous drift uses `transform`, while the separate
  `translate` property compensates page scroll so each blob travels at its seeded `0.45–0.85`
  scroll-speed multiplier. A separate atmospheric grain layer stays behind all content. Both
  motions become static under `prefers-reduced-motion`.
- `eno` — the complete fixed viewport is one luminous lightbox rather than a collection of
  decorative objects. A seed selects a vertical, horizontal, quartered, central-window, or
  softened concentric core-and-ring halo composition; one light or dark contrast family;
  bounded divisions, diffusion, saturation,
  and curated turquoise/pink/crimson, amber/orange/red, green/lime/cyan, or
  blue/violet/magenta schemes. Three related edge-to-edge color states crossfade over
  `180–480s` with bounded `±24°` hue travel. Montserrat supplies the geometric album-art voice:
  the display name and headings render uppercase through CSS with wide tracking, while authored
  content remains lowercase. Text colors remain fixed inside the selected contrast family.
  The document canvas repeats the first seeded state beneath the fixed animation so mobile
  safe-area and elastic-scroll reveals stay inside the lightbox. Controls remain transparent
  so the lightbox itself is their fill. Reduced motion shows the first seeded state.
- `crt` — IBM Plex Mono throughout at 500–600 weight, using the complete fixed mask from
  `/trials/scanline/`: horizontal beam gaps, vertical RGB phosphor triads, rolling refresh band,
  tube vignette, beam boost, and saturation. Its finer pixel pitch and enlarged type hierarchy
  are seed-bounded for homepage readability. Text links invert into a clear phosphor selection
  block on hover/focus, and their unchanged text-presentation `↗︎` / `→` markers render at body
  scale. Footer selection blocks remain content-width instead of stretching across their grid
  cells; the `appearance ↻` and `copy as markdown` utilities receive bounded phosphor glow.
  A fixed seed-colored signal layer covers elastic overscroll outside the document; reduced
  motion removes the rolling band. Never add flicker or text displacement.
- `>...` (`terminal` internally) — IBM Plex Mono throughout at 400–500 weight, with quiet prompt prefixes, solid
  leaders, restrained green/blue/amber palettes, slight grain, and a narrower reading measure.

Grain must use the procedural system shared with `/trials/background/` and `louppe.eu`: a
seeded SVG `feTurbulence` tile, never a repeating dot or halftone gradient. Every tile is at
least 512 CSS pixels with five or six octaves and is internally rasterized at four times that
resolution without changing its apparent noise size. Noise is converted to monochrome before
blending to prevent colored raster artifacts; lower-resolution grain is not allowed. Each grain-bearing
edition independently randomizes tile size, noise frequency, octave count (quality), contrast,
brightness, strength, and stepped shift rate within readability-safe brackets. Paper uses a
lower frequency range for slightly larger physical grain and blends the
grain over the complete page with `multiply`; blobs blend it behind content with `screen`;
Eno uses a very light diffuser grain; terminal and CRT keep their lighter surface treatment.
Reduced motion freezes the tile.

All random values are derived from one edition seed. `?seed=<value>` reproduces an edition;
`?look=<name>&seed=<value>` pins both its appearance and values. Both the displayed aliases
(`smpl`, `blob`, `>...`) and the existing internal names remain accepted so old links keep working.
An ordinary load without these
parameters generates a new seed. The first utility row on the homepage switches immediately,
does not persist, and removes pinned parameters so the next reload is random again. Its reload
glyph composes a new random appearance and edition without requiring a page refresh. The word
`appearance` and the reload glyph are one compact outlined button, not separate controls. The
control's top inset matches the footer's bottom inset. It and `copy as markdown` share the same
fixed height while their widths remain content-sized and never force either label to wrap.
On mobile, seed/status text is hidden and all six style choices share one row with a
symbol-only randomize button aligned at the right edge.

Readability is not random: semantic order, links, click areas, responsive behaviour, accessible
contrast, and the minimum type sizes stay fixed. Decorative noise never receives pointer events.
The blob layer never contains content. Generated columns use an appearance-aware minimum width;
long rows may wrap instead of clipping, and the display name scales against its actual identity
text container so it remains on one line. The homepage uses `viewport-fit=cover`: visual layers
paint through mobile safe areas, while page padding incorporates every safe-area inset so content
remains clear of device controls. Keep stronger texture reduced on small screens and honor the
visitor's motion preference.

Images are invariant across appearances: retain the standard border, radius, grayscale, crop,
and dimensions from `styles.css`. Whole-page overlays such as paper grain or the CRT mask may sit
above them, but no appearance may apply an image-specific filter or geometry change.

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
edit `styles.css`** (keep it in sync with the footer's "last updated" date).

Apply the same dated `?v=` convention to `trials/_shared/trial.css` and `trial-ui.js` on
every immersive experiment page whenever either shared trial asset changes.

The homepage additionally versions `appearance.js` and `appearances.css`. Bump each asset's
own dated query whenever it changes; neither generative file belongs on the other pages.

## don'ts

- On non-generative pages, no new fonts, hues, or font sizes outside the base scale.
- No borders/underlines on links (hover is a color change only).
- No rounded corners beyond `--radius: 2px`, shadows, gradients, or uppercase on non-generative
  pages. The bounded `blobs` and `crt` appearances are the documented exceptions.
- Authored content remains lowercase everywhere; CRT and Eno may render the name and headings
  uppercase with CSS only.
- Don't restyle with inline `style=""` attributes — extend `styles.css` via tokens.
- Experimental gradients, colors, and motion are allowed inside immersive trial effects and the
  documented generative homepage appearances only.
