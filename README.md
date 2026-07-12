# alex-markin.com

Personal site for alex markin. Static HTML + CSS, no build step, no framework.

## Files
- `index.html` — page content and structure
- `styles.css` — all styling (Spectral serif via Google Fonts, dark theme)
- `photo.jpg` — portrait, spans the full text column width
- `favicon.svg`, `apple-touch-icon.png` — tab/home-screen icons
- `CNAME` — custom domain config for GitHub Pages (contains `alex-markin.com`)

## Hosting
Served by **GitHub Pages** from the `main` branch of this repo. Every push to `main` redeploys automatically — no build step, no manual deploy.

DNS (at Namecheap) points `alex-markin.com` and `www.alex-markin.com` at GitHub Pages.

## Preview locally
```
python3 -m http.server 8787
# open http://localhost:8787
```

## Conventions
- All lowercase text throughout (headings, name, links) — this is a deliberate style choice, not an error.
- Link list items follow the pattern: `<a>clickable title</a><span class="desc">: muted description</span>`.
- Keep line spacing/sizing compact — desktop and mobile both use tightened padding (see `styles.css`), don't reintroduce large top padding or oversized type.
