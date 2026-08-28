"use client";

import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";

export default function FinalCTA() {
  return (
    <section id="final" className="final" aria-labelledby="final-head">
      <div className="wrap">
        <motion.div {...inViewOnce}>
          <div className="eyebrow">Начать</div>
          <h2 id="final-head">Готовы изменить лицо — за 12 недель?</h2>
        </motion.div>
        <motion.a href="#apply" className="btn-primary" {...inViewOnce}>
          Оставить заявку
        </motion.a>
        <motion.span className="note" {...inViewOnce}>
          Ответ в течение 24 часов
        </motion.span>
      </div>
    </section>
  );
}