/**
 * Central site metadata. Keep author/bio details here (not scattered in
 * templates) so there is one place to edit as the site grows.
 */
export const site = {
  title: "The Cognitive Kombucha",
  // Short tagline used in the header/footer and default meta description.
  tagline: "Notes, experiments, and small things that matter",
  description:
    "Ideas, left to ferment: writing on software, systems, cloud, data, finance, life, and whatever I'm learning.",
  author: "Aman",
  // Canonical origin, shared with Astro config, SEO, feeds, and validation.
  url: "https://thecognitivekombucha.com",
  // Optional social handles; leave blank to omit. Do not invent these.
  social: {
    github: "https://github.com/aman25singh",
    // twitter: "https://twitter.com/...",
  },
  // The @handle used for Twitter card attribution, if any.
  twitterHandle: "",
  // Cloudflare Web Analytics site token (Cloudflare dashboard → Web Analytics →
  // Manage site → JS snippet). Leave blank to omit the beacon.
  cloudflareAnalyticsToken: "f0d7af3d8b0f4d4e82d8fdc856dfb392",
  navigation: [
    { label: "Notebook", href: "/notebook" },
    { label: "About", href: "/about" },
  ],
} as const;

export const OG_IMAGE = "/assets/og-image.png";
