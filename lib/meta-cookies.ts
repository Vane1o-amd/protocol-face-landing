const FBP_COOKIE = "_fbp";
const FBP_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
const FBCLID_KEY = "pf_fbclid";
const FBCLID_AT_KEY = "pf_fbclid_at"; // click time: Meta wants it as the fbc creation time

function newFbpValue(): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 1e10);
  return `fb.1.${ts}.${rand}`;
}

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
      sessionStorage.setItem(FBCLID_AT_KEY, String(Date.now()));
    }
  } catch {
    /* ignore */
  }
}

export function readFbclid(): { fbclid?: string; fbclidAt?: number } {
  if (typeof window === "undefined") return {};
  try {
    const fbclid = sessionStorage.getItem(FBCLID_KEY) ?? undefined;
    const at = Number(sessionStorage.getItem(FBCLID_AT_KEY));
    return { fbclid, fbclidAt: fbclid && at > 0 ? at : undefined };
  } catch {
    return {};
  }
}

// Read-only accessor for the _fbp cookie Meta's Pixel manages (or that
// ensureFbp seeded on consent). Needed server-side: CAPI user_data.fbp.
export function readFbp(): string | undefined {
  return readCookie(FBP_COOKIE);
}
