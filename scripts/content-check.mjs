import { readdir, readFile } from "node:fs/promises";
import { resolve, relative, join } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "yaml";
import { deriveSlug, segmentPattern, hasPlaceholder } from "../src/lib/content-rules.mjs";

export async function readEntries(root = process.cwd()) {
  const entries = [];
  for (const collection of ["blog", "projects"]) {
    const base = join(root, "content", collection);
    for (const filename of await readdir(base, { recursive: true })) {
      if (!/\.mdx?$/.test(filename)) continue;
      const file = join(base, filename);
      if (filename.endsWith(".mdx"))
        throw new Error(`${relative(root, file)}: use Markdown (.md); MDX is not enabled`);
      const text = await readFile(file, "utf8");
      const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
      if (!match) throw new Error(`${relative(root, file)}: missing YAML frontmatter`);
      let data;
      try {
        data = parse(match[1]);
      } catch (error) {
        throw new Error(`${relative(root, file)}: ${error.message}`);
      }
      if (!data || typeof data !== "object" || Array.isArray(data))
        throw new Error(`${file}: frontmatter must be a mapping`);
      entries.push({
        file: relative(root, file),
        collection,
        id: filename.replaceAll("\\", "/"),
        data,
        body: match[2],
      });
    }
  }
  return entries;
}

export function validateEntries(entries) {
  const errors = [],
    routes = new Map();
  for (const entry of entries) {
    const slug = entry.data.slug ?? deriveSlug(entry.id);
    const route = `/${entry.collection === "blog" ? "writing" : "projects"}/${slug}`;
    if (typeof slug !== "string" || !segmentPattern.test(slug))
      errors.push(`${entry.file}: invalid URL slug ${JSON.stringify(slug)}`);
    if (routes.has(route))
      errors.push(`${entry.file}: duplicate route ${route}; already used by ${routes.get(route)}`);
    routes.set(route, entry.file);
    if (entry.data.published === true && hasPlaceholder(entry.body))
      errors.push(`${entry.file}: published entry contains unfinished placeholder text`);
    if (entry.data.updated && new Date(entry.data.updated) < new Date(entry.data.date))
      errors.push(`${entry.file}: updated date precedes publication date`);
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const entries = await readEntries();
    const errors = validateEntries(entries);
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(`Content checks passed (${entries.length} entries, including drafts).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
