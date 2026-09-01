"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { fadeUp, inViewOnce } from "@/lib/motion";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Личный протокол лица</div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible">
              Мужское, выразительное лицо за 90 дней
            </motion.h1>
            <motion.p className="sub" variants={fadeUp} initial="hidden" animate="visible">
              Уберём отёки, жир и прыщи, добавим контраст и чёткую челюсть —
              без диет, инъекций и спортзала. Всего 15 минут в день.
            </motion.p>
            <motion.p className="hero-subtitle" variants={fadeUp} initial="hidden" animate="visible">
              Персональный протокол по фото и разбору. Первые изменения — уже
              через 7 дней. Система встраивается в любой график: командировки,
              тренировки, ресторан — без исключений.
            </motion.p>
            <motion.ul className="hero-points" variants={fadeUp} initial="hidden" animate="visible">
              <li>
                <Image
                  src="/images/galochka.png"
                  alt=""
                  width={29}
                  height={16}
                  className="point-check"
                />
                <span className="point-body">
                  <b>Не косметика, а причина.</b>
                  <span>
                    Работаем не с симптомами (крем, филлер), а с первопричиной:
                    осанка, тонус мышц лица, мимические привычки.
                  </span>
                </span>
              </li>
              <li>
                <Image
                  src="/images/galochka.png"
                  alt=""
                  width={29}
                  height={16}
                  className="point-check"
                />
                <span className="point-body">
                  <b>Без стресса и голода.</b>
                  <span>
                    Изменения копятся постепенно, шаг за шагом. Никаких жёстких
                    диет, уколов и тяжёлых тренировок — 15 минут в день.
                  </span>
                </span>
              </li>
              <li>
                <Image
                  src="/images/galochka.png"
                  alt=""
                  width={29}
                  height={16}
                  className="point-check"
                />
                <span className="point-body">
                  <b>Результат остаётся.</b>
                  <span>
                    Протокол меняет привычки, а не даёт разовый эффект — после
                    завершения работы форма и тонус лица не откатываются назад.
                  </span>
                </span>
              </li>
            </motion.ul>
            <div className="cta-row">
              <a href="#apply" className="btn-primary">
                Записаться на разбор →
              </a>
              <span className="note">
                Ответ в течение 24 часов · разбор бесплатный · веду клиентов
                лично, мест на месяц ограниченное количество
              </span>
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