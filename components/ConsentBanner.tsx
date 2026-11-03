"use client";

import { useEffect, useRef, useState } from "react";
import { getConsent, setConsent, type ConsentValue } from "@/lib/consent";

export default function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentValue | null>(null);
  const bannerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setChoice(getConsent());
  }, []);

  /* Open as modal: free focus trap + inert page + Escape fires `cancel`.
     Guard = Strict Mode double-invoke (showModal throws if already open). */
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner || choice !== null || banner.open) return;
    banner.showModal();
    /* Focus the dialog itself, not its first control (Chrome would autofocus
       the privacy link and draw its ring mid-sentence). tabindex=-1 keeps it
       out of the tab cycle. */
    banner.focus({ preventScroll: true });
  }, [choice]);

  if (choice !== null) return null;

  const decline = () => {
    setConsent("denied");
    setChoice("denied");
  };

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
        Мы используем cookies для аналитики и подбора рекламы. Обработка данных —
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
          onClick={() => {
            setConsent("granted");
            setChoice("granted");
          }}
        >
          Принять
        </button>
      </div>
    </dialog>
  );
}