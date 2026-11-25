"use client";

import { resetConsent } from "@/lib/consent";

export default function CookieSettings() {
  return (
    <button
      type="button"
      className="footer-link"
      onClick={() => {
        resetConsent();
        location.reload();
      }}
    >
      Настройки cookie
    </button>
  );
}
