# Portfolio Skeleton (MVP: Just the Dots)

This is a minimal structure for your site with **only** the interactive dots background.
Add sections/pages later without changing the base.

## Structure
```
/src
  index.html         # entry — uses just the dots
  /css
    base.css         # minimal reset + layout
    theme.css        # color tokens (light/dark)
  /js
    dots.js          # canvas background
    app.js           # future app code (empty now)
  /assets
    favicon.svg
netlify.toml         # (optional) publish from /src
```

## Local preview
Open `src/index.html` directly in your browser.

## Deploy (Netlify — fastest)
1. Create/login at Netlify.
2. **Add new site > Deploy manually**.
3. Drag the **src/** folder in.
4. Change site name to something clean (e.g., `aman-analytics`).

## Custom domain (later)
- Buy a domain (`amansingh.dev`, `aman-analytics.com`).
- Netlify: **Site settings > Domain management > Add domain** (follow DNS steps).

## Next steps
- Add a `components.css` or `pages/` folder when you introduce content.
- Keep the canvas as a full-page background; overlay glass cards later.
