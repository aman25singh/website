---
title: "Building This Site"
description: "Why I wanted my website to function as a living engineering notebook — and how Git became the CMS."
date: "2026-08-24"
updated: "2026-08-24"
tags:
  - engineering
  - web
  - meta
published: true
featured: true
slug: "building-this-site"
---

I wanted a home on the internet that behaves less like a résumé and more like a
workbench. Somewhere to think in public, keep notes, and document projects —
without a CMS, a database, or a login screen standing between me and the page.

The rule I set myself: **publishing should be a `git push`.** Write a Markdown
file, commit it, push it, and the article appears. That's the whole workflow.

## The stack

The site is a static build. No client-side framework runs in the reader's
browser for an ordinary post — the HTML is generated ahead of time and served
as files.

| Concern            | Choice                          |
| ------------------ | ------------------------------- |
| Generator          | Astro (static output)           |
| Content            | Markdown / MDX in `content/`    |
| Frontmatter        | Zod-validated at build time     |
| Highlighting       | Shiki (build-time, zero JS)     |
| Hosting            | GitHub Pages via GitHub Actions |

## Git as the CMS

Every post is a file. The repository *is* the content database, which means the
full history of everything I publish is versioned, diffable, and portable. If a
build can't parse a post's metadata, it fails loudly:

```ts
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    published: z.boolean().default(true),
    // ...
  }),
});
```

A malformed `date:` or a non-boolean `published:` stops the deploy before it can
ship a broken page. That guarantee is worth more than any dashboard.

> The best content management system is the one you never have to log into.

## What I care about here

- **Typography over chrome.** Whitespace and a good reading measure do the work.
- **Speed.** Pages are static; the only JavaScript is a small theme toggle.
- **Longevity.** Plain Markdown outlives any framework I might pick.

There's more to build — search, the occasional interactive demo — but the
foundation is deliberately boring. Boring lasts.
