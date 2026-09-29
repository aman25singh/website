#!/usr/bin/env node
import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createEntry } from "./frontmatter.mjs";
import { slugify } from "../src/lib/content-rules.mjs";
import { readEntries, validateEntries } from "./content-check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
async function main() {
  const project = process.argv.includes("--project");
  const collection = project ? "projects" : "blog";
  const rl = createInterface({ input, output, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (prompt) => {
    output.write(prompt);
    return ((await lines.next()).value ?? "").trim();
  };
  let entry, date;
  try {
    const title = await ask("Title: ");
    const description = await ask("Description: ");
    const tags = (await ask("Tags (comma-separated): ")).split(",");
    const slug = await ask("Slug [" + slugify(title) + "]: ");
    // Always start as a draft; publishing requires an edit after writing.
    const status = project
      ? (await ask("Status (active/maintained/archived/experiment) [active]: ")) || "active"
      : "active";
    date = new Date().toISOString().slice(0, 10);
    entry = createEntry({ title, description, tags, slug, project, status, date });
  } finally {
    rl.close();
  }
  const filename = date + "-" + entry.slug + ".md";
  const errors = validateEntries([
    ...(await readEntries(root)),
    {
      file: filename,
      id: filename,
      collection,
      data: { slug: entry.slug, published: false },
      body: "",
    },
  ]);
  if (errors.length) throw new Error(errors.join("\n"));
  const dir = join(root, "content", collection);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), entry.text, { encoding: "utf8", flag: "wx" });
  console.log(
    "Created draft content/" + collection + "/" + filename + ". Preview with npm run dev.",
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
