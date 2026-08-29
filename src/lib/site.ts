/**
 * Central site metadata. Keep author/bio details here (not scattered in
 * templates) so there is one place to edit as the site grows.
 */
export const site = {
  title: "The Cognitive Kombucha",
  // Short tagline used in the header/footer and default meta description.
  tagline: "Notes, experiments, and small things that matter",
  description:
    "An engineering notebook and personal publication: writing on software, systems, cloud, data, finance, and whatever I'm learning.",
  author: "Aman Singh",
  // Canonical origin. Mirrors astro.config `site`; imported by SEO + feeds.
  url: "https://thecognitivekombucha.com",
  // Optional social handles; leave blank to omit. Do not invent these.
  social: {
    github: "https://github.com/aman25singh",
    // twitter: "https://twitter.com/...",
  },
  // The @handle used for Twitter card attribution, if any.
  twitterHandle: "",
  navigation: [
    { label: "Writing", href: "/writing" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
  ],
} as const;

export const OG_IMAGE = "/assets/og-image.png";
