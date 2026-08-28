"use client";

import { motion } from "motion/react";
import { fadeUp, inViewOnce } from "@/lib/motion";
import Carousel from "@/components/Carousel";

const QUOTES = [
  {
    name: "Артём",
    role: "27 лет, Москва",
    quote:
      "За месяц ушли отёки, челюсть стала чётче. Главное — понял, что дело в привычках, а не в кремах.",
  },
  {
    name: "Дмитрий",
    role: "34 года, Санкт-Петербург",
    quote:
      "Не верил, пока не увидел фото до/после. 15 минут в день реально работают, если система.",
  },
  {
    name: "Насрулла",
    role: "22 года, Алматы",
    quote:
      "Прыщи ушли за три недели. Сон и питание оказались важнее всего остального.",
  },
  {
    name: "Никита",
    role: "29 лет, Киев",
    quote:
      "Поддержка 24/7 — не маркетинг. На любой вопрос отвечали в тот же день. План подстраивался под меня.",
  },
  {
    name: "Игорь",
    role: "31 год, Харьков",
    quote:
      "Думал, нужен спортзал и косметолог. Оказалось — осанка, тонус и привычки. Намного дешевле и проще.",
  },
  {
    name: "Сергей",
    role: "26 лет, Тверь",
    quote:
      "Контур лица изменился так, что знакомые спрашивают, что я сделал. Ничего не делал — просто следовал протоколу.",
  },
] as const;

export default function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Отзывы</div>
            <h2 id="testimonials-head">Что говорят те, кто прошёл протокол</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Реальные результаты реальных людей. Без фильтров и рекламы.
          </motion.p>
        </div>

        <Carousel trackClassName="testimonials" ariaLabel="Отзывы клиентов">
          {QUOTES.map((q) => (
            <motion.figure className="quote-card" key={q.name} variants={fadeUp}>
              <blockquote className="quote-body">{q.quote}</blockquote>
              <figcaption className="quote-author">
                <span className="avatar" aria-hidden="true">
                  {q.name.charAt(0)}
                </span>
                <span className="author-meta">
                  <b>{q.name}</b>
                  <span className="role">{q.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}