"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { staggerContainer } from "@/lib/motion";

type CarouselProps = {
  children: ReactNode;
  trackClassName: string;
  ariaLabel: string;
  wrapperClassName?: string;
};

/* scroll-snap horizontal carousel with prev/next arrows.
   The track is the motion stagger parent; each child uses fadeUp variants.
   Arrows disable at scroll edges. Native scroll/drag + snap still work. */
export default function Carousel({ children, trackClassName, ariaLabel, wrapperClassName }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    /* Force first item on mount — browser may restore prior horizontal scroll on reload. */
    el.scrollLeft = 0;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={`carousel${wrapperClassName ? ` ${wrapperClassName}` : ""}`}>
      <motion.div
        ref={trackRef}
        className={`car-track ${trackClassName}`}
        role="list"
        aria-label={ariaLabel}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {children}
      </motion.div>
      <div className="car-nav">
        <button
          type="button"
          className="car-arrow car-prev"
          aria-label="Назад"
          onClick={() => go(-1)}
          disabled={atStart}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M11 3 L6 9 L11 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="car-bar" aria-hidden="true">
          <div
            className="car-bar-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <button
          type="button"
          className="car-arrow car-next"
          aria-label="Вперёд"
          onClick={() => go(1)}
          disabled={atEnd}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M7 3 L12 9 L7 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}