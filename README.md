# alex-markin.com

Personal site for alex markin. Static HTML + CSS, no build step, no framework.

## Files
- `index.html` — page content and structure
- `styles.css` — all styling; everything derives from the tokens at the top
- `DESIGN-SYSTEM.md` — the design source of truth: color/type tokens, layout, and the
  reusable patterns. Read this before any UI change.
- `CLAUDE.md` — instructs any editor (human or LLM) to read `DESIGN-SYSTEM.md` first.
- `photo.jpg` — portrait, a 148px square (116px on mobile) cropped to the face
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

## Hosting
Served by **GitHub Pages** from the `main` branch of this repo. Every push to `main`
redeploys automatically — no build step, no manual deploy.

DNS (at Namecheap) points the apex `alex-markin.com` at GitHub Pages via four `A` records
(`185.199.108–111.153`). The site is apex-only — there is intentionally no `www` record.

## Preview locally
```
python3 -m http.server 8787
# open http://localhost:8787
```
