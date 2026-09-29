// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { site } from "./src/lib/site.ts";

// The canonical production origin. Used for canonical URLs, sitemap, RSS, and
// OpenGraph absolute URLs. Change this single value if the domain ever moves.
const SITE = site.url;

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
  compressHTML: true,
  site: SITE,
  // Optional output directory for isolated local verification.
  outDir: process.env.ASTRO_OUT_DIR || undefined,
  trailingSlash: "ignore",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404/") && !page.endsWith("/404") })],
  markdown: {
    // Shiki ships with Astro, so no client JS is needed; highlighting happens at build time.
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: false,
    },
    // Slugged heading ids + a quiet anchor link on each heading (for deep links
    // and the table of contents).
    processor: unified({
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
    }),
  },
});
