export const CONSENT_KEY = "pf_marketing_consent";
export type ConsentValue = "granted" | "denied";

type Listener = (value: ConsentValue) => void;
const listeners = new Set<Listener>();

export function getConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable — proceed */
  }
  listeners.forEach((fn) => fn(value));
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function consentGranted(): boolean {
  return getConsent() === "granted";
}