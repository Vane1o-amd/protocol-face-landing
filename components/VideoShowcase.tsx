"use client";

import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";

export default function VideoShowcase() {
  return (
    <section id="video" aria-labelledby="video-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Видео</div>
            <h2 id="video-head">Как меняется лицо за 60 дней</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Короткое видео: реальная трансформация, процесс и результат.
            Никаких фильтров и монтажа.
          </motion.p>
        </div>

        <motion.figure className="video-frame" {...inViewOnce}>
          {/* TODO: replace with real video file in /public/videos/showcase.mp4 */}
          <video
            controls
            playsInline
            preload="none"
            poster="/images/video-poster.jpg"
            className="video-el"
            aria-label="Видео трансформации лица за 60 дней"
          >
            <source src="/videos/showcase.mp4" type="video/mp4" />
            <track kind="captions" srcLang="ru" label="Русский" />
          </video>
        </motion.figure>
      </div>
    </section>
  );
}