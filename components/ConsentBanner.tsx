"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { setConsent, useConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const choice = useConsent();
  const bannerRef = useRef<HTMLDialogElement>(null);
  // On /privacy the banner is non-modal: the visitor must be able to read the policy before choosing.
  const modal = usePathname() !== "/privacy";

  /* Open as modal: free focus trap + inert page + Escape fires `cancel`.
     Guard = Strict Mode double-invoke (showModal throws if already open). */
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner || choice !== null || banner.open) return;
    if (modal) banner.showModal();
    else banner.show();
    /* Focus the dialog itself, not its first control (Chrome would autofocus
       the privacy link and draw its ring mid-sentence). tabindex=-1 keeps it
       out of the tab cycle. */
    banner.focus({ preventScroll: true });
  }, [choice, modal]);

  if (choice !== null) return null;

  const decline = () => setConsent("denied");

  return (
    <dialog
      ref={bannerRef}
      className="consent-banner"
      aria-label="Согласие на обработку"
      tabIndex={-1}
      onCancel={(e) => {
        e.preventDefault();
        decline();
      }}
    >
      <p>
        С твоего согласия я использую cookie Meta (Pixel, измерение рекламы) и
        Microsoft Clarity (аналитика и запись сессий). Обработка данных —
        согласно{" "}
        <a href="/privacy" className="privacy-link">
          политике конфиденциальности
        </a>
        .
      </p>
      <div className="actions">
        <button type="button" className="btn-decline" onClick={decline}>
          Отклонить
        </button>
        <button
          type="button"
          className="btn-allow"
          onClick={() => setConsent("granted")}
        >
          Принять
        </button>
      </div>
    </dialog>
  );
}