"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import Carousel from "@/components/Carousel";
import { CTA_PRIMARY } from "@/components/cta-strings";

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
    images: [{ src: "/images/case-emil.jpg", alt: "Эмиль — до и после, результат протокола" }],
  },
];

export default function CaseStudies() {
  return (
    <section id="cases" aria-labelledby="cases-head">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Клиенты</div>
            <h2 id="cases-head">Реальные результаты — от 30 дней</h2>
          </div>
          <p>
            Не ретушь. Не фильтры. Фотографии до и после — без монтажа.
          </p>
        </div>

        <Carousel trackClassName="clients-grid" ariaLabel="Результаты клиентов" wrapperClassName="clients-carousel">
          {CLIENTS.map((c) => (
            <motion.article className="client-card" key={c.name} variants={fadeUp}>
              <div className="meta">
                <span className="cname">{c.name}</span>
                <span className="days">{c.days}</span>
              </div>
              <figure>
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

        <div className="section-cta">
          <a href="#apply" className="btn-primary">{CTA_PRIMARY}</a>
        </div>
      </div>
    </section>
  );
}