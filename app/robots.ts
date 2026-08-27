import type { MetadataRoute } from "next";

// TODO: replace placeholder domain once user confirms final domain
const BASE = "https://protocolface.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/success"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}