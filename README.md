# The Cognitive Kombucha

My personal website and engineering notebook: [thecognitivekombucha.com](https://thecognitivekombucha.com).

A minimal, fast, static site built with [Astro](https://astro.build). **Git is the CMS:** every
post is a Markdown file in this repository. Write a file, commit it, push it, and it publishes
automatically. No dashboard, no database, no login.

```
Markdown file → git commit → git push → CI build → production deploy
```

## Local development

Use **Node 20 or 22 LTS** (see `.nvmrc`). CI uses Node 20. On Windows, Node 24 can crash Astro's
post-build cleanup with a `libuv` assertion; output is still correct and CI is unaffected, but an
LTS release avoids it locally. `npm run dev` is fine on any recent Node.

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:4321
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run check     # type-check (also validates all frontmatter)
npm run verify    # check + build (what CI runs)
npm run format    # format source with Prettier
```

Drafts (`published: false`) are visible in `npm run dev` so you can preview them, but are excluded
from `npm run build` output, the RSS feed, and the sitemap.

## Creating a blog post

The fastest way:

```bash
npm run blog:new
```

It interactively asks for a title, description, tags, and publish status, then generates a correctly
named file with valid frontmatter under `content/blog/`, dated today, with a safe slug, e.g.
`content/blog/2026-08-24-thoughts-on-ai-agents.md`.

To create a **project** entry instead:

```bash
npm run blog:new -- --project     # writes to content/projects/
```

### Manual creation

You can also just add the file yourself. Create `content/blog/YYYY-MM-DD-your-slug.md`:

```markdown
---
title: "Your Post Title"
description: "One-sentence summary used for previews and SEO."
date: "2026-08-24"
updated: "2026-08-24"
tags:
  - engineering
  - systems
published: true
featured: false
slug: "your-post-slug"
---

Your content starts here. Standard Markdown (and MDX) is supported.
```

## Frontmatter

Validated by Zod at build time. **Invalid metadata fails the build with a precise error** naming the
file and field.

### Blog (`content/blog/`)

| Field         | Type                | Required | Default | Notes                                                                        |
| ------------- | ------------------- | :------: | ------- | ---------------------------------------------------------------------------- |
| `title`       | string              |   yes    | -       | Post title.                                                                  |
| `description` | string              |   yes    | -       | Summary for listings, `<meta>`, OpenGraph, and RSS.                          |
| `date`        | date (`YYYY-MM-DD`) |   yes    | -       | Publication date. Controls ordering (newest first).                          |
| `updated`     | date                |    no    | -       | Last-updated date; shown on the article if present.                          |
| `tags`        | string[]            |    no    | `[]`    | Lower-cased automatically. Each generates a `/tags/<tag>` page.              |
| `published`   | boolean             |    no    | `true`  | `false` = draft (dev-only; excluded from prod, feed, sitemap).               |
| `featured`    | boolean             |    no    | `false` | Surfaces the post in the homepage "Featured" block.                          |
| `slug`        | string              |    no    | derived | URL slug. If omitted, derived from the filename (leading `YYYY-MM-DD-` cut). |
| `image`       | string              |    no    | default | Path/URL to a social share image for this post.                              |

### Projects (`content/projects/`)

Same as above, minus `image`, plus:

| Field    | Type                                                   | Default  | Notes                          |
| -------- | ------------------------------------------------------ | -------- | ------------------------------ |
| `status` | `active` \| `maintained` \| `archived` \| `experiment` | `active` | Small label shown on the card. |
| `repo`   | url                                                    | -        | Optional link to the repo.     |
| `url`    | url                                                    | -        | Optional link to a live site.  |

## Draft articles

Set `published: false`. The post then:

- **is visible** at `npm run dev` (with a "Draft" banner) so you can preview it, and
- **is excluded** from the production build, the RSS feed, the sitemap, and search engines.

Flip it to `published: true` and push when you're ready to publish.

## Images

Put article images under `public/assets/` (or a subfolder like `public/assets/posts/`). Reference
them with an absolute path from the site root:

```markdown
![Diagram of the pipeline](/assets/posts/pipeline.png)
```

Anything in `public/` is copied verbatim to the site root at build time. Prefer optimized formats
(WebP/AVIF) and include descriptive alt text.

## Publishing workflow

```
1. write        content/blog/2026-08-24-my-post.md   (npm run blog:new)
2. preview      npm run dev        → check it locally
3. stage        git add content/blog/2026-08-24-my-post.md
4. commit       git commit -m "post: my post"
5. push         git push origin main
6. deploy       GitHub Actions builds and deploys automatically
```

Within a minute or two of the push, the article is live. That's the whole system, reproducible from
any computer where you can clone the repo and authenticate to GitHub.

## Deployment

- **Host:** GitHub Pages, custom domain `thecognitivekombucha.com` (set by `public/CNAME`).
- **Pipeline:** `.github/workflows/deploy.yml` runs on every push to `main`: install → type-check →
  build → deploy the static `dist/` to Pages.
- **Portability:** the build output is plain static HTML/CSS/JS, so it can be moved to Netlify,
  Cloudflare Pages, Vercel, or any static host with no code changes; only the deploy step differs.

### One-time setup (required)

The repo previously served from the `docs/` branch folder. To use the new build pipeline, in the
GitHub repo settings go to **Settings → Pages → Build and deployment → Source** and set it to
**GitHub Actions**. After that, every push to `main` deploys automatically.

## SEO & feeds

Generated automatically: per-page titles and meta descriptions, canonical URLs, OpenGraph and
Twitter cards, article JSON-LD structured data, an RSS feed at `/rss.xml`, `sitemap-index.xml`, and
`robots.txt`.

## Project structure

```
.
├── content/               # ← your writing lives here (Git-as-CMS)
│   ├── blog/              #    blog posts (Markdown/MDX)
│   └── projects/          #    project write-ups
├── public/                # static assets copied as-is (images, CNAME, robots.txt, favicon)
│   └── assets/
├── scripts/
│   └── new-post.mjs       # `npm run blog:new` scaffolder
├── src/
│   ├── components/        # BaseHead, Header, Footer, PostCard, TableOfContents, Dots, …
│   ├── layouts/           # BaseLayout, PostLayout
│   ├── lib/               # content loading + helpers (content.ts, site.ts, format.ts)
│   ├── pages/             # routes: /, /writing, /writing/[slug], /tags, /projects, /about, rss.xml
│   ├── styles/            # global.css (tokens + base), prose.css (article typography)
│   └── content.config.ts  # Zod-validated collection schemas
├── .github/workflows/
│   └── deploy.yml         # build + deploy to GitHub Pages
└── astro.config.mjs
```

## License

Content © Aman Singh. Code is free to reference.
