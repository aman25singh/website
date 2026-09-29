import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { segmentPattern } from "./lib/content-rules.mjs";

const segment = z.string().regex(segmentPattern, "Use lowercase words separated by hyphens");
const tag = z.string().trim().toLowerCase().pipe(segment);
const webUrl = z
  .url()
  .refine((value) => ["https:", "http:"].includes(new URL(value).protocol), "Use an HTTP(S) URL");
const fields = {
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z
    .array(tag)
    .default([])
    .transform((tags) => [...new Set(tags)]),
  // Publishing is deliberate; omitted flags remain drafts.
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  slug: segment.optional(),
};
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/blog" }),
  schema: z.object({ ...fields, image: z.string().trim().min(1).optional() }).strict(),
});
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/projects" }),
  schema: z
    .object({
      ...fields,
      status: z.enum(["active", "maintained", "archived", "experiment"]).default("active"),
      repo: webUrl.optional(),
      url: webUrl.optional(),
    })
    .strict(),
});
export const collections = { blog, projects };
