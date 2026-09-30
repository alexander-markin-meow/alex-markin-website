# playhtml 2.15.0

Published distribution from https://registry.npmjs.org/playhtml/-/playhtml-2.15.0.tgz.
MIT license included. Source: https://github.com/spencerc99/playhtml/tree/main/packages.

The runtime's injected stylesheet URL in `index-CGjnJNJD.js` is patched from
`https://unpkg.com/playhtml@latest/dist/style.css` to
`new URL("./style.css", import.meta.url).href`. This keeps the CSS and JavaScript
on the same pinned, locally served version. All other runtime code is unchanged.

The page connects to the public `api.playhtml.fun` service for shared state and
presence. GitHub Pages serves the frontend only.
