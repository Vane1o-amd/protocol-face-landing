"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp, inViewOnce } from "@/lib/motion";
import Carousel from "@/components/Carousel";

type CaseImage = { src: string; alt: string };

const CLIENTS: { name: string; days: string; images: CaseImage[] }[] = [
  {
    name: "Денис",
    days: "30 дней",
    images: [{ src: "/images/case-denis.jpg", alt: "Денис — результат протокола" }],
  },
  {
    name: "Артур",
    days: "91 день",
    images: [{ src: "/images/case-artur.jpg", alt: "Артур — результат протокола" }],
  },
  {
    name: "Эмиль",
    days: "30 дней",
    images: [
      { src: "/images/case-emil-front.jpg", alt: "Эмиль — результат протокола, вид спереди" },
      { src: "/images/case-emil-side.jpg", alt: "Эмиль — результат протокола, вид сбоку" },
    ],
  },
];

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
              <figure className={c.images.length > 1 ? "pair" : undefined}>
                {c.images.map((img) => (
                  <span key={img.src}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      loading="lazy"
                    />
                  </span>
                ))}
              </figure>
            </motion.article>
          ))}
        </Carousel>

        <motion.div className="section-cta" {...inViewOnce}>
          <a href="#apply" className="btn-primary">Записаться на разбор →</a>
        </motion.div>
      </div>
    </section>
  );
}