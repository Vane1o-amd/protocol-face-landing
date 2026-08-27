"use client";

import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";

const ITEMS = [
  {
    q: "Для кого это?",
    a: "Для мужчин 20–40 лет, кто хочет изменить лицо без операций и косметики. Подходит, если есть отёки, слабый контур, прыщи, усталый вид — но нет системного подхода.",
  },
  {
    q: "Как быстро виден результат?",
    a: "Первые изменения — через неделю: уходят отёки, кожа становится ровнее. Заметный контур лица — к третьей неделе. Полная трансформация — за 12 недель.",
  },
  {
    q: "Это луксмаксинг?",
    a: "Нет. Это структурная работа: осанка, тонус мышц лица, привычки, питание, сон. Не косметика и не инъекции. Результат остаётся, потому что меняются причины, а не симптомы.",
  },
  {
    q: "Нужно ли быть в Осло?",
    a: "Нет. Вся работа удалённо: разбор по фото, чат 24/7, еженедельная калибровка. Ты можешь быть где угодно в Норвегии или за её пределами.",
  },
  {
    q: "Сколько стоит заявка?",
    a: "Заявка и первичный разбор — бесплатно. Стоимость самого протокола зависит от формата и обсуждается после разбора. Без скрытых платежей.",
  },
] as const;

export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Вопросы</div>
            <h2 id="faq-head">Частые вопросы</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Коротко о том, что чаще всего спрашивают перед стартом.
          </motion.p>
        </div>

        <motion.div className="faq-list" {...inViewOnce}>
          {ITEMS.map((item, i) => (
            <details className="faq-item" key={item.q} {...(i === 0 ? { open: true } : {})}>
              <summary className="faq-q">
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path
                      d="M3 5 L7 9 L11 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}