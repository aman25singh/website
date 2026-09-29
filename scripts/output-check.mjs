import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "parse5";
import { site } from "../src/lib/site.ts";
import { deriveSlug, hasPlaceholder } from "../src/lib/content-rules.mjs";
import { readEntries } from "./content-check.mjs";

function nodes(tree) {
  const result = [];
  const visit = (node) => {
    result.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(tree);
  return result;
}

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

export async function validateOutput(root, entries = [], origin = site.url) {
  root = resolve(root);
  const errors = [],
    documents = new Map();
  for (const file of (await readdir(root, { recursive: true })).filter((file) =>
    file.endsWith(".html"),
  )) {
    const text = await readFile(join(root, file), "utf8");
    const elements = nodes(parse(text));
    documents.set(resolve(root, file), {
      text,
      elements,
      ids: new Set(
        elements.flatMap((n) => (n.attrs ?? []).filter((a) => a.name === "id").map((a) => a.value)),
      ),
    });
  }
  for (const [file, doc] of documents) {
    const label = relative(root, file).replaceAll("\\", "/");
    const pagePath = `/${label.replace(/index\.html$/, "")}`;
    // Only reader-facing text is checked, not comments or script source.
    if (
      hasPlaceholder(
        doc.elements
          .filter((n) => n.nodeName === "#text")
          .map((n) => n.value)
          .join(" "),
      )
    )
      errors.push(`${label}: placeholder text in production output`);
    for (const node of doc.elements) {
      const attrs = Object.fromEntries((node.attrs ?? []).map((a) => [a.name, a.value]));
      const refs = [attrs.href, attrs.src];
      if (
        node.tagName === "meta" &&
        ["og:image", "twitter:image"].includes(attrs.property ?? attrs.name)
      )
        refs.push(attrs.content);
      for (const ref of refs.filter(Boolean)) {
        let url;
        try {
          url = new URL(ref, new URL(pagePath, origin));
        } catch {
          errors.push(`${label}: invalid URL ${ref}`);
          continue;
        }
        if (!["http:", "https:"].includes(url.protocol)) {
          if (!["mailto:", "tel:"].includes(url.protocol))
            errors.push(`${label}: unsupported URL scheme in ${ref}`);
          continue;
        }
        if (url.origin !== new URL(origin).origin) continue;
        let target;
        try {
          target = resolve(root, `.${decodeURIComponent(url.pathname)}`);
        } catch {
          errors.push(`${label}: invalid encoded URL ${ref}`);
          continue;
        }
        if (relative(root, target).startsWith("..")) {
          errors.push(`${label}: URL leaves output directory: ${ref}`);
          continue;
        }
        if (!(await isFile(target))) target = join(target, "index.html");
        if (!(await isFile(target))) {
          errors.push(`${label}: missing local target ${ref}`);
          continue;
        }
        if (url.hash && documents.has(target)) {
          let id;
          try {
            id = decodeURIComponent(url.hash.slice(1));
          } catch {
            errors.push(`${label}: invalid fragment ${ref}`);
            continue;
          }
          if (!documents.get(target).ids.has(id)) errors.push(`${label}: missing fragment ${ref}`);
        }
      }
    }
  }
  const syndication = (
    await Promise.all(
      (await readdir(root))
        .filter((file) => file.endsWith(".xml"))
        .map((file) => readFile(join(root, file), "utf8")),
    )
  ).join("\n");
  for (const entry of entries) {
    const route = `/${entry.collection === "blog" ? "writing" : "projects"}/${entry.data.slug ?? deriveSlug(entry.id)}`;
    const generated = await isFile(join(root, route.slice(1), "index.html"));
    if (
      entry.data.published !== true &&
      (generated ||
        syndication.includes(`${origin}${route}<`) ||
        syndication.includes(`${origin}${route}/<`))
    )
      errors.push(`${entry.file}: draft exposed at ${route}`);
    if (entry.data.published === true && !generated)
      errors.push(`${entry.file}: published route missing: ${route}`);
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const errors = await validateOutput(process.env.ASTRO_OUT_DIR || "dist", await readEntries());
    if (errors.length) throw new Error([...new Set(errors)].join("\n"));
    const cname = (await readFile("public/CNAME", "utf8")).trim();
    const robots = await readFile("public/robots.txt", "utf8");
    if (cname !== new URL(site.url).hostname || !robots.includes(`${site.url}/sitemap-index.xml`))
      throw new Error("CNAME/robots.txt must match src/lib/site.ts");
    console.log(
      "Output checks passed: local links, fragments, metadata assets, publishing, and domain configuration.",
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
