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

## Publish a note or project

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

`published`, `featured`, and `draft` are optional booleans. They default to `false`; setting
`published: true` publishes an entry, while `draft: true` keeps it out of production even if
`published` is true. `featured` only controls the Featured marker and never publishes an entry.
Unpublished entries and drafts appear in local development but are excluded from production pages,
RSS, and the sitemap. A draft in a public repository is still public source code, so do not put
private material in it.

## Publishing

To publish from GitHub, create or edit a Markdown file under `content/blog/` or `content/projects/`,
set `published: true` when it is ready, and commit the change to `main`. You can do this in the
GitHub web editor with **Add file** or **Edit this file**, then **Commit changes**. To publish from
a Mac, edit the file locally and push the commit to `main`. For an unpublished draft, leave
`published: false` or set `draft: true`.

Every push to `main` runs formatting, tests, content validation, Astro checks, a production build,
and output validation, then deploys the verified site to GitHub Pages. The deploy job depends on
the successful build and upload; if validation or the build fails, deployment is skipped and the
last successfully deployed site stays live. Pull requests run the same checks but do not deploy.

Use Node 24 and `npm ci` for a reproducible local preview. Before pushing from a Mac, you can run
`npm run dev`, then `npm run verify` and `npm run format:check`. `package-lock.json` is committed;
use `npm ci` rather than `npm install` when setting up the project.

Dependency security audits run separately every week, manually on request, and on pull requests
that change the dependency manifests or audit workflow. High-severity findings fail that audit
workflow and remain visible in Actions, but do not block content deployments. This separation keeps
routine publishing reliable; it also means a security finding does not stop an otherwise valid
site deployment. Dependabot continues to propose weekly dependency and GitHub Actions updates.

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
