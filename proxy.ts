import { NextResponse, type NextRequest } from "next/server";

// Per-request nonce CSP. Next reads the nonce from the request's CSP header and puts it on its
// own scripts; app/layout.tsx passes it to the consent-gated Pixel and Clarity loaders.
// 'strict-dynamic' lets those nonced scripts load fbevents.js, clarity.js and Vercel Analytics,
// so script-src needs no host list. style-src keeps 'unsafe-inline' for React style attributes.
// React dev mode evals for stack traces; production builds never do.
const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

export function csp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devEval}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://www.facebook.com https://*.clarity.ms",
    "font-src 'self'",
    "connect-src 'self' https://connect.facebook.net https://www.facebook.com https://va.vercel-scripts.com https://*.clarity.ms",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = csp(nonce);
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    {
      // Skips only non-documents, so every HTML response (a 404 for /x.php included) gets the CSP.
      source: "/((?!api/|_next/static/|_next/image|images/|videos/|robots\\.txt$|sitemap\\.xml$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
