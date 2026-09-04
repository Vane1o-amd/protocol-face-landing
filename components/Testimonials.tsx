"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { fadeUp, inViewOnce } from "@/lib/motion";
import Carousel from "@/components/Carousel";

type VideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

const QUOTES = [
  {
    name: "Денис",
    role: "Протокол лица — 90 дней",
    quote:
      "За месяц ушли отёки, челюсть стала чётче. Главное — понял, что дело в привычках, а не в кремах.",
    video: "/videos/testimonial-denis.mp4",
  },
  {
    name: "Марк",
    role: "Протокол лица — 90 дней",
    quote:
      "Не верил, пока не увидел своё фото до и после. Теперь 15 минут в день — просто привычка, как чистить зубы.",
    video: "/videos/testimonial-2.mp4",
  },
  {
    name: "Насрулла",
    role: "22 года, Алматы",
    quote:
      "Прыщи ушли за три недели. Сон и питание оказались важнее всего остального.",
    video: "/videos/testimonial-3.mp4",
  },
] as const;

function TestimonialVideo({ src, name }: { src: string; name: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current as VideoElement | null;
    if (!v) return;
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        v.pause();
        v.controls = false;
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function open() {
    const v = ref.current as VideoElement | null;
    if (!v) return;
    v.controls = true;
    if (typeof v.requestFullscreen === "function") {
      v.requestFullscreen()
        .then(() => v.play())
        .catch(() => v.play());
    } else if (typeof v.webkitEnterFullscreen === "function") {
      v.webkitEnterFullscreen();
      v.play();
    } else {
      v.play();
    }
  }

  return (
    <button
      type="button"
      className="video-thumb"
      onClick={open}
      aria-label={`Смотреть видео-отзыв: ${name} на весь экран`}
    >
      <video
        ref={ref}
        src={`${src}#t=0.1`}
        playsInline
        preload="metadata"
      />
      <span className="thumb-play" aria-hidden="true">
        ▶
      </span>
    </button>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Отзывы</div>
            <h2 id="testimonials-head">Что говорят те, кто прошёл протокол</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Реальные результаты реальных людей. Без фильтров и рекламы.
          </motion.p>
        </div>

        <Carousel
          trackClassName="testimonials"
          wrapperClassName="testimonials-carousel"
          ariaLabel="Отзывы клиентов"
        >
          {QUOTES.map((q) => (
            <motion.figure className="quote-card" key={q.name} variants={fadeUp}>
              <TestimonialVideo src={q.video} name={q.name} />
              <blockquote className="quote-body">{q.quote}</blockquote>
              <figcaption className="quote-author">
                <span className="avatar" aria-hidden="true">
                  {q.name.charAt(0)}
                </span>
                <span className="author-meta">
                  <b>{q.name}</b>
                  <span className="role">{q.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}