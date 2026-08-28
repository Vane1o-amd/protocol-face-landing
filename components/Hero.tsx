"use client";

import { motion } from "motion/react";
import { fadeUp, inViewOnce } from "@/lib/motion";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Личный протокол лица</div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible">
              ИЗМЕНИ ЛИЦО ЗА 30 ДНЕЙ
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeUp} initial="hidden" animate="visible">
              (1-вые изменения уже через неделю)
            </motion.p>
            <motion.p className="sub" variants={fadeUp} initial="hidden" animate="visible">
              уберем отеки, жир, прыщи, добавим контраст, выразим челюсть.
              Сделаем мужские черты лица. Всего 15 минут в день, питание,
              упражнения, привычки в одной системе.
            </motion.p>
            <div className="cta-row">
              <a href="#apply" className="btn-primary">
                Оставить заявку
              </a>
              <span className="note">Ответ в течение 24 часов</span>
            </div>
          </motion.div>

          <motion.div className="hero-visual" {...inViewOnce}>
            <figure>
              <img
                src="/images/hero-before.jpg"
                alt="Результат протокола лица"
                loading="lazy"
              />
            </figure>

            <p className="visual-note">
              <b>Не косметика.</b> Структурная работа с лицом: осанка, тонус,
              привычки. Результат накапливается постепенно и остаётся.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}