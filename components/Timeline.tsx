"use client";

import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";
import { CTA_PRIMARY } from "@/components/cta-strings";

const ROWS = [
  {
    when: "Неделя 0",
    what: "Старт. Фото до, замеры, постановка цели.",
  },
  {
    when: "Недели 1–2",
    what: "Перестройка. Осанка, тонус, привычки начинают меняться.",
  },
  {
    when: "Неделя 4",
    what: "Первые видимые изменения. Лицо становится выразительнее.",
  },
  {
    when: "Неделя 8",
    what: "Устойчивые изменения. Результат заметен окружающим.",
  },
  {
    when: "День 90",
    what: "Итог. Фото после, план поддержки и самостоятельной работы.",
  },
] as const;

export default function Timeline() {
  return (
    <section id="timeline" className="alt" aria-labelledby="timeline-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Таймлайн</div>
            <h2 id="timeline-head">Что происходит за 90 дней</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Не за неделю. Не через год. Постепенно — и результат остаётся.
          </motion.p>
        </div>

        <motion.div className="timeline" {...inViewOnce}>
          {ROWS.map((r) => (
            <div className="t-row" key={r.when}>
              <span className="t-when">{r.when}</span>
              <span className="t-what">{r.what}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className="section-cta" {...inViewOnce}>
          <a href="#apply" className="btn-primary">{CTA_PRIMARY}</a>
        </motion.div>
      </div>
    </section>
  );
}