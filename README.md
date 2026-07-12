# alex-markin.com

Personal site for alex markin — static, hand-coded (HTML + CSS). No build step.

## Files
- `index.html` — the page
- `styles.css` — all styling (Spectral serif via Google Fonts, dark theme)
- `photo.jpg` — portrait (**add this file** — see below)

## Still to do
1. **Add the portrait** as `photo.jpg` in this folder (square works best; it's cropped to a square with rounded corners).
2. **Fill in the real link URLs.** Placeholders are marked in `index.html` with `data-todo="..."` and `href="#"`:
   - instagram (personal), instagram (photography), flickr, bluesky, fable books, linkedin, facebook
   - new york times article, gulag documentary

## Preview locally
```
cd alex-markin-website
python3 -m http.server 8787
# open http://localhost:8787
```

## Deploy to Vercel + connect alex-markin.com
This is a static site, so Vercel needs zero config.

**Option A — reuse the existing Vercel project (recommended, keeps the domain):**
1. `npm i -g vercel` then `vercel login`
2. From this folder: `vercel link` and pick the existing alex-markin.com project.
3. `vercel --prod` to deploy this coded version over the old v0 one.
   The custom domain stays attached — no DNS change needed.

**Option B — fresh project:**
1. `vercel --prod` from this folder (creates a new project).
2. In the Vercel dashboard → Project → Settings → Domains, add `alex-markin.com`.
3. Point DNS at your registrar:
   - `A` record `@` → `76.76.21.21`, **or** `CNAME` `@`/`www` → `cname.vercel-dns.com`
   Vercel shows the exact records to add after you add the domain.
