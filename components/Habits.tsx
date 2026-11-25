"use client";

import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";

export default function Habits() {
  return (
    <section id="habits" className="alt" aria-labelledby="habits-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Привычки</div>
            <h2 id="habits-head">Система, встроенная в обычный день</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Встраиваю фундаментальную систему привычек в твой обычный день. Без
            жёстких диет: убираю только ультраобработанную еду, настраиваю
            глубокий природный сон, снижаю уровень стресса, добавляю всего 15
            минут утренних упражнений для лица и подбираю добавки.
          </motion.p>
        </div>
      </div>
    </section>
  );
}