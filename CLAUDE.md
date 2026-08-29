# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and engineering blog for **thecognitivekombucha.com**. Built with **Astro** (static
output). **Git is the CMS**: every post is a Markdown/MDX file under `content/`; pushing to `main`
triggers a GitHub Actions build that deploys the static site to GitHub Pages. No database, no CMS UI.

## Commands

```bash
npm run dev        # dev server (http://localhost:4321); drafts are visible here
npm run build      # production build → dist/
npm run preview    # serve the production build
npm run check      # astro check; type-checks and validates all frontmatter
npm run verify     # check + build (mirrors CI)
npm run format     # Prettier
npm run blog:new   # scaffold a new post (add `-- --project` for a project entry)
```

## Architecture

- **`content/blog/`, `content/projects/`**: the content. Markdown/MDX files with frontmatter. This
  is the source of truth; do not store content anywhere else.
- **`src/content.config.ts`**: Zod schemas for the collections. Frontmatter is validated at build
  time; invalid metadata fails `astro check` / `astro build` with a file+field error.
- **`src/lib/content.ts`**: all content loading and derived logic (published filtering, sorting,
  slug derivation, reading time, tags, adjacent posts). Keep content logic here, out of components.
- **`src/lib/site.ts`**: site-wide metadata (title, author, nav, social). Edit here, not in templates.
- **`src/layouts/`**: `BaseLayout` (head + header + footer + theme init) and `PostLayout` (article
  chrome: TOC, prev/next, draft banner).
- **`src/components/`**: reusable UI (`BaseHead` for all SEO/meta, `Header`, `Footer`, `PostCard`,
  `TableOfContents`, `PostNav`, `ThemeToggle`, `Dots` particle background).
- **`src/pages/`**: routes. `/`, `/writing`, `/writing/[slug]`, `/tags`, `/tags/[tag]`, `/projects`,
  `/projects/[slug]`, `/about`, `404`, and `rss.xml.ts`.
- **`src/styles/`**: `global.css` (design tokens as CSS variables + base) and `prose.css` (long-form
  article typography). All colors are CSS variables; light + dark are defined here.
- **`public/`** is copied verbatim to the site root: `assets/` (images, favicon, logo), `CNAME`,
  `robots.txt`. Sitemap and RSS are generated into the build.
- **`.github/workflows/deploy.yml`** runs CI: install → check → build → deploy to Pages on push to `main`.

## Key patterns

- **Adding a post:** `npm run blog:new`, or add `content/blog/YYYY-MM-DD-slug.md` with frontmatter.
  Ordering is by `date` (newest first). No manifest or registry to update.
- **Drafts:** `published: false` → visible in `dev`, excluded from prod build, RSS, and sitemap.
- **Slugs:** URL is `data.slug` if present, else the filename with a leading `YYYY-MM-DD-` stripped.
- **Theming:** edit CSS variables in `src/styles/global.css`. The `Dots` component reads `--dots*`
  and `--bg-fallback` at runtime and re-reads them on theme toggle, so color changes flow through.
- **SEO:** all `<head>` metadata is centralized in `src/components/BaseHead.astro`; article pages pass
  `type="article"` + `article={...}` to emit OpenGraph/JSON-LD from frontmatter.

## Conventions

- TypeScript is strict; don't suppress errors. `astro check` must pass.
- Keep client-side JS minimal. The site is static; only the theme toggle and (homepage-only) dots
  ship JS. Don't add framework/hydration for content pages.
- Separate content loading (`src/lib`) from presentation (`src/components`, `src/pages`).
