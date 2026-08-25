import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, postSlug } from "../lib/content";
import { site } from "../lib/site";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: site.title,
    description: site.description,
    // context.site is the configured `site` origin.
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${postSlug(post)}`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
