import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { parse } from "yaml";
import { scriptJson } from "../src/lib/content-rules.mjs";
import { createEntry } from "./frontmatter.mjs";
import { validateEntries } from "./content-check.mjs";
import { validateOutput } from "./output-check.mjs";

test("frontmatter preserves quotes, Windows paths and string tags", () => {
  const title = 'Paths: C:\\notes\\new "idea"';
  const result = createEntry({ title, description: title, tags: ["true", "null", "TRUE"] });
  const data = parse(result.text.split("---")[1]);
  assert.equal(data.title, title);
  assert.equal(data.description, title);
  assert.deepEqual(data.tags, ["true", "null"]);
  assert.equal(data.published, false);
  assert.throws(() => createEntry({ title: "hello", description: "" }));
  assert.throws(() => createEntry({ title: "!!!", description: "summary" }));
  assert.throws(() =>
    createEntry({ title: "test", description: "summary", project: true, status: "wrong" }),
  );
});

test("JSON-LD cannot close its script element", () => {
  const input = { headline: '</script><script>alert("x")</script>', description: "< & >" };
  const json = scriptJson(input);
  assert.equal(json.includes("<"), false);
  assert.deepEqual(JSON.parse(json), input);
});

test("routes collide after date/folder stripping and published placeholders fail", () => {
  const entries = [
    {
      file: "a.md",
      id: "2026-01-01-same.md",
      collection: "blog",
      data: { published: false },
      body: "Start writing here.",
    },
    {
      file: "b.md",
      id: "folder/2026-02-01-same.md",
      collection: "blog",
      data: { published: true },
      body: "Start writing here.",
    },
  ];
  const errors = validateEntries(entries);
  assert.equal(errors.length, 2);
  assert.ok(errors.some((error) => error.includes("duplicate route")));
  assert.ok(errors.some((error) => error.includes("b.md: published")));
});

test("production validation catches missing OG assets, fragments, and leaked drafts", async () => {
  const root = await mkdtemp(join(tmpdir(), "notebook-validation-"));
  try {
    await mkdir(join(root, "writing", "draft"), { recursive: true });
    await writeFile(join(root, "writing", "draft", "index.html"), "<h1>Draft</h1>");
    await writeFile(
      join(root, "index.html"),
      '<a href="#missing">Jump</a><meta property="og:image" content="/missing.png"><a href="/writing/draft">Draft</a>',
    );
    const entries = [
      { file: "draft.md", collection: "blog", id: "draft", data: { published: false } },
    ];
    const errors = await validateOutput(root, entries);
    assert.ok(errors.some((error) => error.includes("missing fragment")));
    assert.ok(errors.some((error) => error.includes("missing.png")));
    assert.ok(errors.some((error) => error.includes("draft exposed")));
    await writeFile(join(root, "index.html"), '<h1 id="ok">Home</h1><a href="#ok">Jump</a>');
    assert.deepEqual(await validateOutput(root), []);
  } finally {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    assert.ok(root.includes("notebook-validation-"));
    await rm(root, { recursive: true, force: true });
  }
});
