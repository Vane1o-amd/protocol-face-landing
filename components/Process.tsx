"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import Carousel from "@/components/Carousel";
import { CTA_PRIMARY } from "@/components/cta-strings";

const STEPS = [
  {
    num: "01",
    title: "Диагностика",
    text: "Разбор фото, осанки, мимических привычек. Определяю, что мешает лицу раскрыться.",
  },
  {
    num: "02",
    title: "Протокол",
    text: "Персональный план на 90 дней. Конкретные упражнения, привычки и режим.",
  },
  {
    num: "03",
    title: "Внедрение",
    text: "Пошаговое выполнение с поддержкой. Каждый шаг разбираем вместе.",
  },
  {
    num: "04",
    title: "Калибровка",
    text: "Еженедельная сверка: что тяжело, что понравилось, что нет. Меняю продукты, упражнения, ставлю напоминания. Чат 24/7 — план подстраивается под тебя, а не наоборот.",
  },
] as const;

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-head">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Как это работает</div>
            <h2 id="process-head">Четыре этапа работы с лицом</h2>
          </div>
          <p>
            Уберу отёки, жир, прыщи, добавлю контраст и подчеркну челюсть, чтобы черты
            лица стали мужскими. Всего 15 минут в день: питание, упражнения и
            привычки в одной системе.
          </p>
        </div>

        <Carousel trackClassName="process" ariaLabel="Этапы работы" wrapperClassName="process-carousel">
          {STEPS.map((s) => (
            <motion.div className="p-step" key={s.num} variants={fadeUp}>
              <div className="p-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.div>
          ))}
        </Carousel>

        <div className="section-cta">
          <a href="#apply" className="btn-primary">{CTA_PRIMARY}</a>
        </div>
      </div>
    </section>
  );
}