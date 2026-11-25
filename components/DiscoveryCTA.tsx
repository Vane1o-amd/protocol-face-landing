"use client";

import { motion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { CTA_PRIMARY, CTA_TURNAROUND } from "@/components/cta-strings";

const POINTS = [
  "Разбор фото и осанки — что мешает лицу раскрыться",
  "Калькулятор реального потенциала на 90 дней",
  "Чек-лист первых шагов, которые можно сделать сегодня",
] as const;

export default function DiscoveryCTA() {
  return (
    <section id="discovery" className="alt" aria-labelledby="discovery-head">
      <div className="wrap">
        <div className="discovery-grid">
          <div>
            <div className="eyebrow">Первый шаг</div>
            <h2 id="discovery-head">
              Узнай реальный потенциал лица
            </h2>
            <p className="sub">
              Без обязательств. Получи персональную
              оценку и чек-лист первых шагов за один день.
            </p>
          </div>

          <motion.ul
            className="discovery-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {POINTS.map((p) => (
              <motion.li key={p} variants={fadeUp}>
                <span className="check" aria-hidden="true">
                  <img
                    src="/images/galochka.svg"
                    alt=""
                    width={14}
                    height={11}
                    className="check-img"
                  />
                </span>
                <span>{p}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div className="discovery-cta">
            <a href="#apply" className="btn-primary">
              {CTA_PRIMARY}
            </a>
            <span className="note">{CTA_TURNAROUND}</span>
          </div>
        </div>
      </div>
    </section>
  );
}