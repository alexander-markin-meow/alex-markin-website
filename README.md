# alex-markin.com

Personal site for alex markin. Static HTML + CSS, no build step, no framework.

## Files
- `index.html` — page content and structure
- `coffee.html` — alex's specialty coffee recipes; inherits the active homepage look and seed
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
- `favicon.svg`, `apple-touch-icon.png` — tab/home-screen icons
- `CNAME` — custom domain config for GitHub Pages (contains `alex-markin.com`)

## Design
Dark, serif, quiet, with subtle web-1.0 details. Two font families loaded from Google
Fonts: **Source Serif 4** for reading text and **IBM Plex Mono** for the "machine voice"
(name, section headings, tags, footer). Warm grey on pure black with a single olive accent.

All the specifics — color tokens, type scale, layout grid, and the signature link-row
pattern (title, dotted leader, mono tag) — live in `DESIGN-SYSTEM.md`. Don't add new
fonts, hues, or font sizes outside that spec, and extend `styles.css` via its tokens
rather than hard-coding values or using inline styles.

The homepage and coffee page share the complete seeded appearance system: composer, visual
layers, controls, and status. The active look and seed are held for the current browsing session,
while their cross-page links also carry the edition for deterministic navigation and sharing.

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
