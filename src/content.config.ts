import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Content collections are the single source of truth for site content.
 *
 * Every field below is validated by Zod at build time. If a post has a missing
 * or malformed frontmatter field (e.g. a bad date, a non-boolean `published`),
 * `astro build` and `astro check` fail with a precise error naming the file and
 * field — which is exactly the "invalid metadata fails the build" guarantee.
 *
 * To add a field: extend the schema here, and it becomes type-safe everywhere
 * it is consumed (`entry.data.<field>` is fully typed).
 */

const tag = z
  .string()
  .min(1)
  .transform((t) => t.trim().toLowerCase());

const blog = defineCollection({
  // Markdown/MDX files live under content/blog. Nothing outside that folder is
  // treated as a post, so drafts-in-progress elsewhere never leak in.
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/blog" }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(tag).default([]),
      // published:false keeps a post out of production listings, feeds, sitemap
      // and page generation. It still renders in `npm run dev` for previewing.
      published: z.boolean().default(true),
      // featured posts are surfaced on the homepage.
      featured: z.boolean().default(false),
      // Optional explicit URL slug. If omitted, the slug is derived from the
      // filename with any leading `YYYY-MM-DD-` date prefix stripped.
      slug: z.string().optional(),
      // Optional social/OG image path (relative to /public or absolute URL).
      image: z.string().optional(),
    })
    .strict(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/projects" }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      // Rough status of the work — shown as a small label, not a progress bar.
      status: z.enum(["active", "maintained", "archived", "experiment"]).default("active"),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(tag).default([]),
      published: z.boolean().default(true),
      featured: z.boolean().default(false),
      slug: z.string().optional(),
      // Optional outbound links for a project.
      repo: z.string().url().optional(),
      url: z.string().url().optional(),
    })
    .strict(),
});

export const collections = { blog, projects };
