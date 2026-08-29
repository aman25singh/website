---
title: "This Website"
description: "A statically-generated personal site and engineering notebook where Git is the CMS."
status: "active"
date: "2026-08-24"
tags:
  - web
  - astro
published: true
featured: true
slug: "this-website"
repo: "https://github.com/aman25singh/website"
url: "https://thecognitivekombucha.com"
---

The site you're reading. A minimal, static personal publication built with Astro
and published straight from Git.

## Highlights

- **Git-as-CMS**: every post is a Markdown file; pushing to `main` deploys.
- **Type-safe content**: frontmatter is validated with Zod at build time.
- **Zero-JS reading**: pages are static HTML; the only script is a theme toggle.
- **Built-in feeds**: RSS, sitemap, and per-article social metadata.

## Why it exists

I wanted one durable place to write and think, without the overhead of a CMS or
the lock-in of a hosted platform. Plain Markdown in a Git repository is about as
portable and long-lived as web content gets.

Projects like this one are themselves Markdown files under `content/projects/`,
so the same publishing workflow that powers the blog powers the project log.
