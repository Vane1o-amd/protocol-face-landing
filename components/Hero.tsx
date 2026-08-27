"use client";

import Image from "next/image";
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
              Персональная диагностика и сопровождение
            </motion.h1>
            <motion.p className="sub" variants={fadeUp} initial="hidden" animate="visible">
              ИЗМЕНИ ЛИЦО ЗА 60 ДНЕЙ (1-вые изменения уже через неделю)
            </motion.p>
            <div className="cta-row">
              <a href="#apply" className="btn-primary">
                Оставить заявку
              </a>
              <span className="note">Ответ в течение 24 часов</span>
            </div>
          </motion.div>

          <motion.div className="hero-visual" {...inViewOnce}>
            <div className="transform-wrap">
              <div className="score-track">
                <svg viewBox="0 0 640 80" preserveAspectRatio="none" aria-hidden="true">
                  <path className="arc" d="M 10 70 Q 320 -10 630 70" />
                  <polygon className="arrowhead" points="630,70 622,64 622,76" />
                </svg>
                <span className="weeks-label hand">12 недель</span>
                <span className="score-badge before">До</span>
                <span className="score-badge after">После</span>
              </div>

              <div className="transform-imgs">
                <figure>
                  <Image
                    src="/images/hero-before.jpg"
                    alt="До начала протокола"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    loading="lazy"
                  />
                  <span className="photo-chip tl">Неделя 0</span>
                </figure>
                <span className="mid-arrow" aria-hidden="true">→</span>
                <figure>
                  <Image
                    src="/images/hero-after.jpg"
                    alt="После 12 недель протокола"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    loading="lazy"
                  />
                  <span className="photo-chip br">Неделя 12</span>
                </figure>
              </div>

              <div className="transform-labels">
                <span className="bad">До протокола</span>
                <span className="good">После протокола</span>
              </div>
            </div>

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