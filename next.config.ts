import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // CSP allows the third-party resources this site loads:
          //   - 'unsafe-inline' script: Next.js inline runtime + any inline JSON-LD.
          //   - 'unsafe-eval' script: React dev mode (prod builds never eval).
          //   - https://connect.facebook.net + https://www.facebook.com: Meta Pixel + CAPI (consent-gated).
          //   - https://api.telegram.org: lead delivery to Telegram bot.
          //   - https://va.vercel-scripts.com: Vercel Analytics + Speed Insights.
          //   - https://fonts.googleapis.com / fonts.gstatic.com: Space Grotesk, IBM Plex, Caveat.
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://www.facebook.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.telegram.org https://connect.facebook.net https://www.facebook.com https://va.vercel-scripts.com; frame-src https://www.facebook.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://www.facebook.com" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;