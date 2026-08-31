"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { inViewOnce } from "@/lib/motion";

const ITEMS = [
  {
    q: "Для кого это?",
    a: "Для мужчин, которые хотят убрать отёки, прыщи, нечёткие контуры лица и добавить выраженные, мужские черты — без пластики и косметологии. Формат подходит и при плотном графике: 15 минут в день, всё встроено в обычную жизнь.",
  },
  {
    q: "Как быстро видны результаты?",
    a: "Первые изменения — уже в первую неделю (уходят отёки, лицо свежее). Через 2–4 недели — заметнее контур и кожа. Устойчивый, видимый окружающим результат — к 8–12 неделе.",
  },
  {
    q: "Нужны спортзал, диеты или уколы?",
    a: "Нет. Система строится на привычках: питание, сон, осанка и 15-минутные упражнения для лица. Без голода, тяжёлых тренировок и инъекций.",
  },
  {
    q: "Это подходит, если я много путешествую / работаю без графика?",
    a: "Да. Протокол персонализируется под твой ритм жизни — командировки, ресторан, ненормированный день не мешают следовать системе.",
  },
  {
    q: "Что если мне не подойдёт часть упражнений или продуктов?",
    a: "Еженедельно созваниваемся и калибруем протокол: меняем упражнения, продукты, ставлю напоминания под твои реальные условия.",
  },
] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            <details
              className="faq-item"
              key={item.q}
              open={openIndex === i}
              onToggle={(e) => {
                if (e.currentTarget.open) setOpenIndex(i);
                else if (openIndex === i) setOpenIndex(null);
              }}
            >
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