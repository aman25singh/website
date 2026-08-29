#!/usr/bin/env node
/**
 * Interactive post scaffolder.
 *
 *   npm run blog:new              → new blog post under content/blog/
 *   npm run blog:new -- --project → new project under content/projects/
 *
 * Uses only Node built-ins (no dependencies). It asks a few questions, builds a
 * safe slug, stamps today's date, and writes a Markdown file with a valid
 * frontmatter template ready to edit.
 */
import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isProject = process.argv.includes("--project");
const collection = isProject ? "projects" : "blog";
const dir = join(root, "content", collection);

/** Turn arbitrary text into a URL-safe slug. */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
    .replace(/-{2,}/g, "-"); // collapse repeats
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  // Async-iterator prompting works with both an interactive TTY and piped input
  // (readline/promises `question` can stall on piped EOF).
  const rl = createInterface({ input, output, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (prompt) => {
    output.write(prompt);
    const { value } = await lines.next();
    return (value ?? "").trim();
  };

  console.log(`\n  New ${collection} entry\n  ${"─".repeat(24)}`);

  const title = await ask("  Title: ");
  if (!title) {
    console.error("\n  ✗ A title is required.\n");
    rl.close();
    process.exit(1);
  }

  const description = await ask("  Description: ");
  const tagsRaw = await ask("  Tags (comma-separated): ");
  const slugInput = await ask(`  Slug [${slugify(title)}]: `);
  const publishAns = (await ask("  Publish now? (y/N): ")).toLowerCase();
  let statusAns = "active";
  if (isProject) {
    statusAns =
      (await ask("  Status (active/maintained/archived/experiment) [active]: ")).toLowerCase() ||
      "active";
  }
  rl.close();

  const date = todayISO();
  const slug = slugInput ? slugify(slugInput) : slugify(title);
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];
  const published = publishAns === "y" || publishAns === "yes";

  const tagBlock =
    tags.length > 0 ? `tags:\n${tags.map((t) => `  - ${t}`).join("\n")}` : "tags: []";

  const frontmatter = isProject
    ? `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
status: "${statusAns}"
date: "${date}"
updated: "${date}"
${tagBlock}
published: ${published}
featured: false
slug: "${slug}"
# repo: "https://github.com/..."
# url: "https://..."
---

Write your project notes here.
`
    : `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
date: "${date}"
updated: "${date}"
${tagBlock}
published: ${published}
featured: false
slug: "${slug}"
---

Start writing here.
`;

  const filename = `${date}-${slug}.md`;
  const target = join(dir, filename);

  if (await fileExists(target)) {
    console.error(`\n  ✗ ${collection}/${filename} already exists.\n`);
    process.exit(1);
  }

  await mkdir(dir, { recursive: true });
  await writeFile(target, frontmatter, "utf8");

  console.log(`\n  ✓ Created content/${collection}/${filename}`);
  console.log(`    ${published ? "Published" : "Draft"}. Preview with: npm run dev\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
