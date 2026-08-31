"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp, inViewOnce, staggerContainer } from "@/lib/motion";

const POINTS = [
  "Разбор фото и осанки — что мешает лицу раскрыться",
  "Калькулятор реального потенциала на 30 дней",
  "Чек-лист первых шагов, которые можно сделать сегодня",
] as const;

export default function DiscoveryCTA() {
  return (
    <section id="discovery" className="alt" aria-labelledby="discovery-head">
      <div className="wrap">
        <div className="discovery-grid">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Бесплатно</div>
            <h2 id="discovery-head">
              Узнай реальный потенциал лица — бесплатно
            </h2>
            <motion.p className="sub" {...inViewOnce}>
              100% бесплатный разбор. Без обязательств. Получи персональную
              оценку и чек-лист первых шагов за один день.
            </motion.p>
          </motion.div>

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
                  <Image
                    src="/images/galochka.png"
                    alt=""
                    width={14}
                    height={14}
                    className="check-img"
                  />
                </span>
                <span>{p}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="discovery-cta" {...inViewOnce}>
            <a href="#apply" className="btn-primary">
              Записаться на разбор →
            </a>
            <span className="note">Ответ в течение 24 часов</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}