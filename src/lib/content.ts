import { getCollection, type CollectionEntry } from "astro:content";
import { deriveSlug } from "./content-rules.mjs";

export type BlogPost = CollectionEntry<"blog">;
export type Project = CollectionEntry<"projects">;
export type Entry = BlogPost | Project;

/**
 * Drafts (`published: false`) are visible while developing so you can preview
 * before committing, but never appear in a production build / feed / sitemap.
 */
const includeDrafts = import.meta.env.DEV;

/** Strip a leading `YYYY-MM-DD-` date prefix and any folder from a glob id. */
function idToSlug(id: string): string {
  return deriveSlug(id);
}

/** Canonical URL slug for an entry: explicit frontmatter `slug` wins. */
export function postSlug(entry: BlogPost | Project): string {
  return entry.data.slug ?? idToSlug(entry.id);
}

/** Words-per-minute reading estimate derived from the raw source. */
export function readingTime(body: string | undefined): string {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

function byDateDesc(a: { data: { date: Date } }, b: { data: { date: Date } }): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

/** All publishable blog posts, newest first. */
export async function getPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => includeDrafts || data.published);
  return posts.sort(byDateDesc);
}

/** All publishable projects, newest first. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => includeDrafts || data.published);
  return projects.sort(byDateDesc);
}

export type TagCount = { tag: string; count: number };

export function entryUrl(entry: Entry): string {
  return `/${entry.collection === "blog" ? "writing" : "projects"}/${postSlug(entry)}`;
}

export async function getEntries(): Promise<Entry[]> {
  return [...(await getPosts()), ...(await getProjects())].sort(
    (a, b) => byDateDesc(a, b) || entryUrl(a).localeCompare(entryUrl(b)),
  );
}

/** Distinct tags across notebook entries with their counts, most first. */
export async function getTags(): Promise<TagCount[]> {
  const posts = await getEntries();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const t of post.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Notes and projects carrying a given tag, newest first. */
export async function getPostsByTag(tag: string): Promise<Entry[]> {
  return (await getEntries()).filter((p) => p.data.tags.includes(tag));
}

export type Adjacent = { post: BlogPost; slug: string } | null;

/** Previous (older) and next (newer) post relative to a slug, for article nav. */
export async function getAdjacentPosts(slug: string): Promise<{ prev: Adjacent; next: Adjacent }> {
  const posts = await getPosts();
  const i = posts.findIndex((p) => postSlug(p) === slug);
  if (i === -1) return { prev: null, next: null };
  // posts are newest-first: index+1 is older ("prev"), index-1 is newer ("next")
  const older = posts[i + 1];
  const newer = posts[i - 1];
  return {
    prev: older ? { post: older, slug: postSlug(older) } : null,
    next: newer ? { post: newer, slug: postSlug(newer) } : null,
  };
}
