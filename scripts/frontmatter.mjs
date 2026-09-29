import { stringify } from "yaml";
import { slugify, segmentPattern } from "../src/lib/content-rules.mjs";

export function createEntry({
  title,
  description,
  tags = [],
  slug: inputSlug,
  published = false,
  project = false,
  status = "active",
  date = new Date().toISOString().slice(0, 10),
}) {
  if (!title?.trim() || !description?.trim())
    throw new Error("A title and description are required.");
  const slug = slugify(inputSlug || title);
  if (!slug) throw new Error("Enter a slug containing letters or numbers.");
  const normalizedTags = [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
  if (normalizedTags.some((tag) => !segmentPattern.test(tag)))
    throw new Error("Tags must use lowercase words separated by hyphens.");
  if (project && !["active", "maintained", "archived", "experiment"].includes(status))
    throw new Error("Choose a valid project status.");
  const data = {
    title: title.trim(),
    description: description.trim(),
    date,
    tags: normalizedTags,
    published,
    featured: false,
    slug,
    ...(project ? { status } : {}),
  };
  // YAML quoting handles backslashes, colons, quotes, and boolean-looking tags.
  return {
    slug,
    text: `---\n${stringify(data)}---\n\n${project ? "Write your project notes here." : "Start writing here."}\n`,
  };
}
