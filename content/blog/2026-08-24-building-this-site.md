---
title: "Building This Site"
description: "Why I didn't want a resume site or a content management system, and how I ended up publishing with a git push."
date: "2026-08-24"
updated: "2026-08-29"
tags:
  - engineering
  - web
  - meta
published: true
featured: true
slug: "building-this-site"
---

When I first thought about building a personal website, the very first thing I did was buy a domain
and come up with a weird looking homepage. Then I was like, what now? I started doing a little bit
of research, and all the examples and formats I could find were more like job hunting portfolios.

I did not want a resume with a nice interface (trust me, there isn't much to add on it anyways :p).
There is nothing wrong with resume based websites, but it would make sense if the goal was to get
hired. I just wanted something more open-ended. Basically a place that could evolve with me instead
of being a static representation of my resume.

At the same time, a traditional blog was also out of the question. For a traditional blog the
obvious way is to use a content management service. That works perfectly fine. Millions of websites
work that way. But for my use case it felt like a lot. I'm just one person writing the text. I did
not want to build a database or an admin dashboard.

Why do I need to build or pay for a content management service when I already know how to create
and manage files? I also wanted to spend as little money as possible.

Another option was to use something like Medium. It takes care of almost all the technical problems
immediately. All you need to do is create an account, write, publish, and done. Naturally I did not
want that either.

I wanted full control on my corner of the internet (yes, I'm territorial lol), and I also wanted it
to stand out somehow.

A few rules I set for myself:

1. I needed a very simple workflow to post the content
2. I should be able to write using tools I already like
3. Low cost
4. The UI can become whatever I like
5. As minimal infrastructure as possible

After doing a little more research, and making ChatGPT and Claude argue with each other (this was
super fun), I found out about Astro. This was the last ingredient I needed for the kombucha.

Now a little about my setup.

## The stack

The site is a static build. No client-side framework runs in the reader's browser for an ordinary
post; the HTML is generated ahead of time and served as files.

| Concern            | Choice                          |
| ------------------ | ------------------------------- |
| Generator          | Astro (static output)           |
| Content            | Markdown / MDX in `content/`    |
| Frontmatter        | Zod-validated at build time     |
| Highlighting       | Shiki (build-time, zero JS)     |
| Hosting            | GitHub Pages via GitHub Actions |

## The workflow

```text
IDE / terminal
      |
   Markdown
      |
     Git
      |
    Build
      |
  My website
```

## Ease of use is relative

Normally, when people say something is "easy to use," they mean there is a nice graphical
interface.

For me, opening a Markdown file is easy. Running:

```bash
git add .
git commit -m "new post"
git push
```

is easy.

I already know how to do that. Building a separate content management interface would actually make
the workflow feel more complicated to me. That was an interesting realization. The easiest system
isn't necessarily the one with the fewest buttons. Sometimes it is the one that fits into tools you
already know, or what you are comfortable with.

## Git as the CMS

Every post is a file. The repository *is* the content database, which means the full history of
everything I publish is versioned, diffable, and portable. If a build can't parse a post's
metadata, it fails loudly:

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

A malformed `date:` or a non-boolean `published:` stops the deploy before it can ship a broken page.
That guarantee is worth more than any dashboard.

Will I get more publicity going this route? Definitely not, but the goal is building and having my
own space on the internet. So this setup is a winner for me.
