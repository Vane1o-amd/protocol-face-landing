import { useSyncExternalStore } from "react";

const CONSENT_KEY = "pf_marketing_consent";
type ConsentValue = "granted" | "denied";

type Listener = (value: ConsentValue) => void;
const listeners = new Set<Listener>();
// The answer of this page view, for browsers where localStorage throws or drops the write.
let session: ConsentValue | null = null;

function getConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    // storage unavailable: fall back to this page view's answer
  }
  return session;
}

export function setConsent(value: ConsentValue): void {
  session = value;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // storage unavailable: the answer lasts for this page view only
  }
  listeners.forEach((fn) => fn(value));
}

// Withdraw (GDPR Art 7(3)): forget the answer and drop the cookies Meta and Clarity set on this site.
// The caller reloads, so the already-loaded scripts stop and the banner asks again.
export function resetConsent(): void {
  session = null;
  try {
    localStorage.removeItem(CONSENT_KEY);
    sessionStorage.clear();
  } catch {
    // storage unavailable: nothing was kept
  }
  const domain = location.hostname.replace(/^www\./, "");
  for (const name of ["_fbp", "_fbc", "_clck", "_clsk"]) {
    document.cookie = `${name}=; max-age=0; path=/`;
    document.cookie = `${name}=; max-age=0; path=/; domain=.${domain}`;
  }
}

function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function consentGranted(): boolean {
  return getConsent() === "granted";
}

// The visitor's answer as React state; null on the server and before an answer.
export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}
