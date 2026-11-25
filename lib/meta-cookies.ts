export const FBP_COOKIE = "_fbp";
export const FBP_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
export const FBCLID_KEY = "pf_fbclid";

export function newFbpValue(): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 1e10);
  return `fb.1.${ts}.${rand}`;
}

// Local cookie reader shared by ensureFbp/readFbp: returns the cookie value
// or undefined when absent. Replaces two duplicated split/find blocks.
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  try {
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1];
  } catch {
    return undefined;
  }
}

export function ensureFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const existing = readCookie(FBP_COOKIE);
  if (existing) return existing;
  const value = newFbpValue();
  document.cookie = `${FBP_COOKIE}=${value}; max-age=${FBP_MAX_AGE}; path=/; SameSite=Lax; Secure`;
  return value;
}

export function captureFbclid(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get("fbclid");
    if (fbclid) {
      sessionStorage.setItem(FBCLID_KEY, fbclid);
    }
  } catch {
    /* ignore */
  }
}

export function readFbclid(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return sessionStorage.getItem(FBCLID_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

// Read-only accessor for the _fbp cookie Meta's Pixel manages (or that
// ensureFbp seeded on consent). Needed server-side: CAPI user_data.fbp.
export function readFbp(): string | undefined {
  return readCookie(FBP_COOKIE);
}
