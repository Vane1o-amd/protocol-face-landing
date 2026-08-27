"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp, inViewOnce } from "@/lib/motion";
import Carousel from "@/components/Carousel";

const CLIENTS = [
  {
    name: "Денис",
    days: "84 дня",
    image: "/images/case-denis.jpg",
    alt: "Денис — результат протокола",
  },
  {
    name: "Артур",
    days: "91 день",
    image: "/images/case-artur.jpg",
    alt: "Артур — результат протокола",
  },
  {
    name: "Эмиль",
    days: "30 дней",
    image: "/images/case-3.webp",
    alt: "Эмиль — результат протокола",
  },
  {
    name: "Даниил",
    days: "90 дней",
    image: "/images/case-4.webp",
    alt: "Даниил — результат протокола",
  },
] as const;

export default function CaseStudies() {
  return (
    <section id="cases" aria-labelledby="cases-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Клиенты</div>
            <h2 id="cases-head">Реальные результаты — от 30 дней</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Не ретушь. Не фильтры. Фотографии до и после — без монтажа.
          </motion.p>
        </div>

        <Carousel trackClassName="clients-grid" ariaLabel="Результаты клиентов" wrapperClassName="clients-carousel">
          {CLIENTS.map((c) => (
            <motion.article className="client-card" key={c.name} variants={fadeUp}>
              <div className="meta">
                <span className="cname">{c.name}</span>
                <span className="days">{c.days}</span>
              </div>
              <figure>
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  loading="lazy"
                />
              </figure>
            </motion.article>
          ))}
        </Carousel>
      </div>
    </section>
  );
}