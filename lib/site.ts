// Canonical origin: the apex 308-redirects here, so canonicals, sitemap and robots must use www.
export const SITE_URL = "https://www.menface.pro";

// Next replaces nested metadata objects per page instead of merging: pages that override
// openGraph/twitter spread these so the shared fields survive.
export const OG_BASE = { type: "website", locale: "ru_RU", siteName: "MenFace" } as const;
export const TWITTER_BASE = { card: "summary_large_image" } as const;
