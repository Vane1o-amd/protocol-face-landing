"use client";

import { motion } from "motion/react";
import { fadeUp, inViewOnce } from "@/lib/motion";
import Carousel from "@/components/Carousel";

const STEPS = [
  {
    num: "01",
    title: "Диагностика",
    text: "Разбор фото, осанки, мимических привычек. Определяем, что мешит лицу раскрыться.",
  },
  {
    num: "02",
    title: "Протокол",
    text: "Персональный план на 12 недель. Конкретные упражнения, привычки и режим.",
  },
  {
    num: "03",
    title: "Внедрение",
    text: "Пошаговое выполнение с поддержкой. Каждый шаг разбираем вместе.",
  },
  {
    num: "04",
    title: "Калибровка",
    text: "Еженедельная сверка: что тяжело, что понравилось, что нет. Меняю продукты, упражнения, ставлю напоминания. Плюс чат 24/7 — план подстраивается под тебя, а не наоборот.",
  },
] as const;

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Как это работает</div>
            <h2 id="process-head">Четыре этапа работы с лицом</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            уберем отеки, жир, прыщи, добавим контраст, выразим челюсть. Сделаем
            мужские черты лица. Всего 15 минут в день, питание, упражнения,
            привычки в одной системе.
          </motion.p>
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

        <motion.div className="section-cta" {...inViewOnce}>
          <a href="#apply" className="btn-primary">Оставить заявку</a>
        </motion.div>
      </div>
    </section>
  );
}