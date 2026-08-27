export const FBP_COOKIE = "_fbp";
export const FBP_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
export const FBCLID_KEY = "pf_fbclid";

export function newFbpValue(): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 1e10);
  return `fb.1.${ts}.${rand}`;
}

export function ensureFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const existing = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${FBP_COOKIE}=`));
  if (existing) {
    const val = existing.split("=")[1];
    if (val) return val;
  }
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