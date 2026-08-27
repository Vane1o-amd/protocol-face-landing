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
            Встраиваем фундаментальную систему привычек в твой обычный день. Мы
            убираем ультраобработанную еду, настраиваем глубокий природный сон,
            снижаем уровень стресса и добавляем всего 15 минут утренних
            упражнений для лица. принимаешь добавки. Всё встроено в обычный день.
          </motion.p>
        </div>
      </div>
    </section>
  );
}