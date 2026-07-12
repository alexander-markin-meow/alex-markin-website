# alex-markin.com design system

Dark, serif, quiet, with subtle web-1.0 details. Static HTML + CSS, no build step.
This file is the source of truth. If you (human or LLM) are editing the site, read this first;
every visual decision below is deliberate.

## voice

- **all lowercase, everywhere** — headings, name, links, tags, footer. The only exception is
  proper nouns inside descriptions where lowercase would be confusing (e.g. "Echo").
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

- `.page`: max-width 1100px, centered, padding 64px 48px 48px (40/24/36 mobile).
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

- Tags are one lowercase word: `phone` `mail` `ig` `photos` `social` `reading` `work`
  `code` `project` `press` `video` `film`. Reuse before inventing.
- Links: no underline, `--ink`, hover to pure white. Nothing else changes on hover.

### publication entry (row + description)
```html
<li>
  <div class="row"><a href="…">title</a><span class="leader"></span><span class="tag">press</span></div>
  <div class="desc">one-line lowercase description</div>
</li>
```
Inline links inside `.desc` render in `--accent`.

### section
```html
<section>
  <h2 class="heading">section name</h2>
  <ul class="links">…</ul>
</section>
```

### footer
Solid `--rule` top border, mono, space-between. Always contains
`✳ last updated YYYY-MM-DD` (update the date when you ship a change) and the domain.

### images
1px `--border`, 2px radius, slight `grayscale(0.25)`. The portrait is a 148px square
(116px mobile), `object-position` tuned to the face. Content photos may be wider but keep
the border + radius + grayscale treatment.

## web-1.0 flavor — the boundaries

Allowed (subtle, typographic): dotted leaders, mono tags and timestamps,
"last updated" footer, the ✳ dingbat, optional visitor-counter chip
(`<span class="counter-chip">004821</span>`).
Not allowed: bevels, marquees, animated gifs, table layouts, coloured link-visited states,
under-construction banners. The nostalgia is a seasoning, not the dish.

## adding a new page

1. Copy `index.html`'s `<head>` (fonts + `styles.css`) and `.page` shell.
2. Reuse `.intro` / `.columns` / `.heading` / `.row` patterns — do not write new CSS
   unless a pattern is genuinely missing.
3. If a new pattern is needed: build it from tokens only, add it to `styles.css` under a
   commented section, and document it in this file.
4. Keep every page's footer format identical.

## don'ts

- No new fonts, hues, or font sizes outside the scale.
- No borders/underlines on links (hover is a color change only).
- No rounded corners beyond `--radius: 2px`, no shadows, no gradients.
- No uppercase anywhere.
- Don't restyle with inline `style=""` attributes — extend `styles.css` via tokens.
