# alex-markin.com design system

Dark, serif, quiet, with subtle web-1.0 details. Static HTML + CSS, no build step.
This file is the source of truth. If you (human or LLM) are editing the site, read this first;
every visual decision below is deliberate.

## voice

- **all lowercase, everywhere** — headings, name, links, tags, footer. The only exception is
  proper nouns inside descriptions where lowercase would be confusing.
- Compact, understated, no exclamation marks, no emoji.

## color tokens (defined in `styles.css :root`)

| token | value | use |
|---|---|---|
| `--bg` | `#000000` | page background. always pure black, never tinted |
| `--ink` | `#ccc6b9` | body text and link default |
| `--ink-bright` | `#eae5da` | display text (the name) only |
| `--ink-hover` | `#ffffff` | link hover |
| `--muted` | `#847e70` | descriptions, taglines, secondary text |
| `--faint` | `#66614f` | mono tags, metadata |
| `--footnote` | `#5c574a` | footer text |
| `--accent` | `#7d8f5c` | olive. section headings and the header meta line ONLY. never for body text or backgrounds |
| `--hairline` | `#35322a` | dotted leader lines |
| `--rule` | `#24221d` | solid horizontal rules |
| `--border` | `#2a2822` | 1px borders on images and chips |
| `--chip-bg` | `#131311` | chip/inset backgrounds |

Rules:
- The palette is warm grey on black plus one olive accent. Do not introduce new hues.
- Need a new shade? Stay between `--footnote` and `--ink-bright` on the same warm axis.
- Accent is scarce by design — if more than headings + meta line are olive, it's wrong.

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

- `.page`: max-width 1100px, centered, padding 56px 48px 12px (36/24/12 mobile). The
  12px bottom padding mirrors the footer's 12px divider-to-text spacing.
- `.columns`: CSS grid, `repeat(auto-fit, minmax(340px, 1fr))`, gap 44px 64px.
  Columns collapse to a single stack below ~750px automatically — no media query needed.
  The identity header is the first item in the left `.stack`, so the right column begins level
  with it on desktop while the one-column reading order remains unchanged. New sections go
  inside `.columns` as another `<section>`; the grid handles placement.
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
- Links: no underline, `--ink`, hover to pure white. Nothing else changes on hover.

### publication entry (row + description)
```html
<li>
  <div class="row"><a href="…">title</a><span class="leader"></span><span class="tag">press</span></div>
  <div class="desc">one-line lowercase description</div>
</li>
```
Inline links inside `.desc` render in `--accent`.

### home link (pages other than `/`)
On any page but the homepage, the portrait and the name link back to `/`. This is the
only navigation a subpage gets — no nav bar, no back link in the body.

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
Solid `--rule` top border and a three-column mono grid: `last upd YYYY-MM-DD` at left,
the document utility centered, and the domain at right. Update the date when you ship a
change. The `copy as markdown` control uses a thin `--border` outline with no fill; the
outline, pointer cursor, and color-only hover make it legible as clickable without drawing
focus. It builds its output from the live semantic HTML at click time; do not add or
maintain a separate Markdown copy of the page.

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
days ago`, `active 3 days ago`). Drive it with a data attribute, never hard-code the text:
`data-repo="owner/name"` → repo `pushed_at`; `data-user="login"` → latest public event.
Minute values use the compact `min` abbreviation for both singular and plural (e.g.
`upd 1 min ago`, `active 3 min ago`), never `minute` or `minutes`. Live update statuses use
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
item and supplies the photo, link, and title. The entire section starts `hidden`, so an empty
album or failed request leaves no broken UI. The displayed image follows the standard
content-photo border, radius, and grayscale treatment. Keep this album-specific: adding a
photo to the configured flickr album should be the only content action needed to update the
displayed image.
Not allowed: bevels, marquees, animated gifs, table layouts, coloured link-visited states,
under-construction banners. The nostalgia is a seasoning, not the dish.

## pages

- `/` → `index.html` — the identity page.
- `/cv` → `cv.html` — the working cv. GitHub Pages resolves the extensionless `/cv` to
  `cv.html` on its own; no redirect or folder is needed. Reachable from the homepage
  `contact` list via the `cv` tag.

## shared behaviour (`site.js`)

All page behaviour lives in one file loaded by every page: the live `.ago` timestamps,
the header clock, both flickr feeds, and `copy as markdown`. Each block no-ops when its
elements are absent, so the same file is safe on any page — a page without a flickr
section simply skips it. Do not re-inline this script into a page; add to `site.js`
instead, and bump its `?v=` alongside the stylesheet's.

`copy as markdown` walks the live semantic HTML, so a new page is handled automatically
provided it uses the documented patterns. It reads a row's right-hand annotation from
either `.tag` or `.dates`, renders `.notes` as nested bullets, and picks up a
`section > .desc` as prose.

## adding a new page

1. Copy `index.html`'s `<head>` (fonts + `styles.css`) and `.page` shell, and load
   `site.js` at the end of `<body>`.
2. Reuse `.intro` / `.columns` / `.heading` / `.row` patterns — do not write new CSS
   unless a pattern is genuinely missing.
3. If a new pattern is needed: build it from tokens only, add it to `styles.css` under a
   commented section, and document it in this file.
4. Keep every page's footer format identical.

## cache-busting

`index.html` links the stylesheet as `styles.css?v=YYYYMMDD` (append `-N` for additional
changes shipped on the same day). GitHub Pages serves
`styles.css` with `Cache-Control: max-age=600`, so without the query a returning visitor
can load new HTML against a stale cached stylesheet. **Bump the `?v=` date whenever you
edit `styles.css`** (keep it in sync with the footer's "last updated" date).

## don'ts

- No new fonts, hues, or font sizes outside the scale.
- No borders/underlines on links (hover is a color change only).
- No rounded corners beyond `--radius: 2px`, no shadows, no gradients.
- No uppercase anywhere.
- Don't restyle with inline `style=""` attributes — extend `styles.css` via tokens.
