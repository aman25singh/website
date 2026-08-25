// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// The canonical production origin. Used for canonical URLs, sitemap, RSS, and
// OpenGraph absolute URLs. Change this single value if the domain ever moves.
const SITE = "https://thecognitivekombucha.com";

/**
 * Wrap every Markdown <table> in a horizontally-scrollable container so wide
 * tables never break the layout on small screens. Written inline to avoid
 * pulling in a dependency for a dozen lines of tree-walking.
 */
function rehypeResponsiveTables() {
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((/** @type {any} */ child) => {
        walk(child);
        if (child.type === "element" && child.tagName === "table") {
          return {
            type: "element",
            tagName: "div",
            properties: { className: ["table-scroll"] },
            children: [child],
          };
        }
        return child;
      });
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Optional build-output override. Handy on Windows, where Node 24 can hit a
  // libuv crash in Astro's post-build empty-dir cleanup (harmless to output, and
  // absent on the Linux CI runner / Node 20 LTS). CI leaves this unset → ./dist.
  outDir: process.env.ASTRO_OUT_DIR || undefined,
  trailingSlash: "ignore",
  integrations: [mdx(), sitemap()],
  markdown: {
    // Shiki ships with Astro — no client JS, highlighting happens at build time.
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: false,
    },
    // Slugged heading ids + a quiet anchor link on each heading (for deep links
    // and the table of contents).
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
      rehypeResponsiveTables,
    ],
  },
});
