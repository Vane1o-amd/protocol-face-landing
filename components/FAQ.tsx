"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Для кого это?",
    a: "Для мужчин, которые хотят убрать отёки, прыщи, нечёткие контуры лица и добавить выраженные, мужские черты — без пластики и косметологии. Формат подходит и при плотном графике: 15 минут в день, всё встроено в обычную жизнь.",
  },
  {
    q: "Как быстро видны результаты?",
    a: "Отёки уходят уже в первую неделю, лицо становится свежее. Первые видимые изменения контура и кожи — к 4-й неделе, к 8-й их замечают окружающие. Устойчивый результат — к концу 90 дней.",
  },
  {
    q: "Нужны спортзал, жёсткие диеты или уколы?",
    a: "Нет. В питании я убираю только ультраобработанную еду. Система строится на привычках: питание, сон, осанка и 15-минутные упражнения для лица. Без голода, тяжёлых тренировок и инъекций.",
  },
  {
    q: "Это подходит, если я много путешествую / работаю без графика?",
    a: "Да. Протокол персонализируется под твой ритм жизни — командировки, ресторан, ненормированный день не мешают следовать системе.",
  },
  {
    q: "Что если мне не подойдёт часть упражнений или продуктов?",
    a: "Каждую неделю созваниваемся, и я калибрую протокол: меняю упражнения и продукты, ставлю напоминания под твои реальные условия.",
  },
] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-head">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Вопросы</div>
            <h2 id="faq-head">Частые вопросы</h2>
          </div>
          <p>
            Коротко о том, что чаще всего спрашивают перед стартом.
          </p>
        </div>

        <div className="faq-list">
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
        </div>
      </div>
    </section>
  );
}