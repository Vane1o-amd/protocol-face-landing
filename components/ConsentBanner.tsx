"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentValue } from "@/lib/consent";

export default function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setChoice(getConsent());
  }, []);

  if (choice !== null) return null;

  return (
    <dialog className="consent-banner" open aria-label="Согласие на обработку">
      <p>
        Мы используем cookies для аналитики и подбора рекламы. Продолжая, вы соглашаетесь с
        обработкой данных согласно политике конфиденциальности.
      </p>
      <div className="actions">
        <button
          type="button"
          className="btn-decline"
          onClick={() => {
            setConsent("denied");
            setChoice("denied");
          }}
        >
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