"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";

export default function Detail() {
  return (
    <section id="detail" className="alt" aria-labelledby="detail-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Деталь</div>
            <h2 id="detail-head">До и после — крупным планом</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Структурные изменения: тонус, осанка, выражение. Без косметики и фильтров.
          </motion.p>
        </div>

        <motion.div className="detail" {...inViewOnce}>
          <figure>
            <Image
              src="/images/detail-before.jpg"
              alt="До протокола — деталь"
              fill
              sizes="(max-width: 768px) 100vw, 520px"
              loading="lazy"
            />
            <figcaption>До</figcaption>
          </figure>
          <figure>
            <Image
              src="/images/detail-after.jpg"
              alt="После протокола — деталь"
              fill
              sizes="(max-width: 768px) 100vw, 520px"
              loading="lazy"
            />
            <figcaption className="after">После</figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  );
}