# alex-markin.com

Personal site for alex markin. Static HTML + CSS, no build step, no framework.

## Files
- `index.html` — page content and structure
- `coffee.html`, `coffee.css`, `coffee.js` — the fixed-design coffee calculator; presets, adjustable quantities, live instructions, and text copying and native picture sharing
- `louppe/` — legacy redirect to the standalone site at `louppe.eu`
- `trials/` — the site-native trials index and immersive webdesign experiments
- `styles.css` — all styling; everything derives from the tokens at the top
- `robots.txt` — crawler permissions and sitemap discovery
- `sitemap.xml` — canonical, indexable pages submitted to search engines
- `llms.txt` — concise identity and work index for answer engines
- `2c7267903a2bdde7663e587ea92e8d3f.txt` — IndexNow ownership key
- `DESIGN-SYSTEM.md` — the design source of truth: color/type tokens, layout, and the
  reusable patterns. Read this before any UI change.
- `CLAUDE.md` — instructs any editor (human or LLM) to read `DESIGN-SYSTEM.md` first.
- `photo.jpg` — black-and-white portrait source; square-framed with a 20% closer inner crop
  and blended with the real appearance backdrop beneath it (148px desktop, 116px mobile)
- `photo-720.webp` — 62 KB, quality-90 portrait used on the homepage and CV;
  preserves the source aspect ratio and lets CSS own the crop and color
- `fonts.css`, `fonts/` — local font definitions, files, and licenses for the seven fixed
  typographic identities on the homepage and the calculator’s fixed serif/mono pairing
- `favicon.svg`, `apple-touch-icon.png` — tab/home-screen icons
- `CNAME` — custom domain config for GitHub Pages (contains `alex-markin.com`)

## Design
The original appearance is dark, serif, and quiet, with subtle web-1.0 details:
**Source Serif 4** for reading text and **IBM Plex Mono** for the "machine voice"
(name, section headings, tags, footer). The seven generative styles each have their own
fixed type identity, documented in `DESIGN-SYSTEM.md`, and load fonts locally on demand.

All the specifics — color tokens, type scale, layout grid, and the signature link-row
pattern (title, dotted leader, mono tag) — live in `DESIGN-SYSTEM.md`. Don't add new
fonts, hues, or font sizes outside that spec, and extend `styles.css` via its tokens
rather than hard-coding values or using inline styles.

The homepage uses fixed fonts per style and the seeded appearance system: composer, visual
layers, controls, and status. The active look and seed are held for the current browsing session.
The coffee calculator uses fixed dark styling and separate CSS/JS; returning home restores
the homepage edition. Text copies directly to the clipboard. PNG sharing uses the native share menu when available,
with file downloads as a fallback. It remains static and has no build step.
Phones use an expandable appearance grid and shuffle control at the shared utility-text size.
Controls wrap and grow with larger text settings; desktop always keeps the original direct-choice row.

The trials index uses the main site system. Individual experiments use the scoped
`trials/_shared/trial.css` and `trial-ui.js` layer so their full-screen rendering and
controls cannot affect the homepage or CV. The site remains build-free.

## Hosting
Served by **GitHub Pages** from the `main` branch of this repo. Every push to `main`
redeploys automatically — no build step, no manual deploy.

The root `.nojekyll` marker publishes the static tree verbatim. Keep it in place so
underscore-prefixed asset directories such as `trials/_shared/` are not omitted.

DNS (at Namecheap) points the apex `alex-markin.com` at GitHub Pages via four `A` records
(`185.199.108–111.153`). The site is apex-only — there is intentionally no `www` record.

## Preview locally
```
python3 -m http.server 8787
# open http://localhost:8787
```
