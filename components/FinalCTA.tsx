"use client";

import { CTA_PRIMARY, CTA_TURNAROUND } from "@/components/cta-strings";

export default function FinalCTA() {
  return (
    <section id="final" className="final" aria-labelledby="final-head">
      <div className="wrap">
        <div>
          <div className="eyebrow">Начать</div>
          <h2 id="final-head">Готов изменить лицо за 90 дней?</h2>
        </div>
        <a href="#apply" className="btn-primary">
          {CTA_PRIMARY}
        </a>
        <span className="note">
          {CTA_TURNAROUND}
        </span>
      </div>
    </section>
  );
}