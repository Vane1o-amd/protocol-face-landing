"use client";

import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";

const CARDS = [
  {
    tag: "01 / Подход",
    title: "Не косметика",
    text: "Структурная работа с лицом: осанка, тонус мышц, мимические привычки. Причина, а не симптом.",
  },
  {
    tag: "02 / Темп",
    title: "Постепенно",
    text: "Изменения накапливаются шаг за шагом. Тело перестраивается естественно, без стресса.",
  },
  {
    tag: "03 / Результат",
    title: "Остаётся",
    text: "Результат не уходит после прекращения. Новые привычки и тонус сохраняются надолго.",
  },
] as const;

export default function Why() {
  return (
    <section id="why" aria-labelledby="why-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Почему это работает</div>
            <h2 id="why-head">Три принципа протокола</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Система, а не разовая процедура. Поэтому результат держится.
          </motion.p>
        </div>

        <motion.div className="why" {...inViewOnce}>
          {CARDS.map((c) => (
            <div className="card" key={c.title}>
              <div className="tag">{c.tag}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}