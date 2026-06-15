# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal portfolio/blog site for thecognitivekombucha.com. No build system, framework, or dependencies — pure HTML, CSS, and vanilla JavaScript. Deployed via GitHub Pages from the `docs/` directory.

## Running Locally

Serve `docs/` with any static HTTP server, e.g.:
```bash
python -m http.server 8000 --directory docs
```
Then open `http://localhost:8000`. Or just open `docs/index.html` directly in a browser.

## Architecture

All deployable content lives in `docs/`:

- **`css/base.css`** — main layout and component styles
- **`css/theme.css`** — all CSS custom properties (colors, fonts); edit here for theming
- **`js/app.js`** — navigation and mode-switching logic
- **`js/dots.js`** — canvas-based animated particle background (60–180 particles, cursor exclusion, edge-wrapping, respects `prefers-reduced-motion`)
- **`blog/`** — self-contained blog system with a two-column layout (collapsible left sidebar + right content viewer), a regex-based markdown renderer in `blog.js`, and posts stored as `.md` files in `blog/logs/`

## Key Patterns

**Theming:** All colors are CSS variables in `theme.css`. The dots particle system reads `--dots`, `--dots-link`, and `--bg-fallback` at runtime, so color changes flow through automatically.

**Blog posts:** Add a new `.md` file to `docs/blog/logs/` and register it in the series list inside `blog/blog.js`.

**Deployment:** Push to `main` → GitHub Pages auto-deploys. The `CNAME` file sets the custom domain.
