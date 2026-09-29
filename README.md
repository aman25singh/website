# The Cognitive Kombucha

The personal engineering notebook of Aman Singh: notes, projects, and things I am learning.

It is a static Astro site. Content lives in Markdown, Git is the CMS, and GitHub Pages hosts the
generated site at [thecognitivekombucha.com](https://thecognitivekombucha.com).

## Run locally

Use Node 24 LTS, as specified in `.nvmrc`.

```sh
npm ci
npm run dev
```

The development server is available at `http://localhost:4321`. Drafts are visible locally.

Before reviewing a change, run:

```sh
npm run verify
npm run format:check
```

`verify` runs the regression tests, validates content, type-checks Astro, builds the production
site, and checks the generated output.

## Write a note or project

```sh
npm run blog:new
npm run blog:new -- --project
```

Entries are stored in `content/blog/` and `content/projects/`. The shared `/notebook` archive has
Notes and Projects filters. Existing `/writing/` and `/projects/` detail URLs remain stable.

The scaffolder creates a draft with validated YAML. A minimal note looks like this:

```yaml
title: My note
description: A short summary for the archive and social sharing.
date: "2026-09-29"
tags: [engineering]
published: false
featured: false
slug: my-note
```

Titles, descriptions, dates, tags, and slugs are checked during the build. Tags are normalized and
deduplicated. Slugs use lowercase letters, numbers, and hyphens. Duplicate routes fail validation.

Entries are drafts unless `published: true` is set. Drafts appear in local development but are
excluded from production pages, RSS, and the sitemap. A draft in a public repository is still
public source code, so do not put private material in it.

## Publishing

Pull requests run formatting, tests, content validation, Astro checks, a production build, output
validation, and the high and critical npm audit gate. Only a verified build from `main` is uploaded
to GitHub Pages. The deployment job has the Pages permissions; the build job does not.

Dependabot proposes weekly updates for npm dependencies and GitHub Actions. Review the local site
and the generated diff before pushing to `main`.

## Project layout

```text
content/              Markdown notes and projects
src/components/       Shared archive, cards, layout, and navigation UI
src/layouts/          Site and article layouts
src/lib/              Site metadata and content helpers
scripts/              Scaffolding and publishing checks
.github/workflows/    Verification and GitHub Pages deployment
```

For contributor-specific conventions and the full maintenance notes, see [CLAUDE.md](CLAUDE.md).

## License

Content copyright Aman Singh. Code is free to reference.
