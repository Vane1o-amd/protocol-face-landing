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
    if (!banner || choice !== null) return;
    // Navigating to or from /privacy switches the mode: reopen the open dialog in the new one.
    if (banner.open) {
      if (modal === banner.matches(":modal")) return;
      banner.close();
    }
    if (modal) banner.showModal();
    else banner.show();
    /* Focus the dialog itself, not its first control (Chrome would autofocus
       the privacy link and draw its ring mid-sentence). tabindex=-1 keeps it
       out of the tab cycle. */
    banner.focus({ preventScroll: true });
  }, [choice, modal]);

  // Non-modal: the fixed banner would cover the page bottom (footer links), so reserve its height.
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner || choice !== null || modal) return;
    // Track the height: text rewraps on resize or rotation.
    const observer = new ResizeObserver(() => {
      document.body.style.paddingBottom = `${banner.offsetHeight}px`;
    });
    observer.observe(banner);
    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = "";
    };
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