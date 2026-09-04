"use client";

import { useEffect, useState } from "react";

const LETTERS = ["M", "e", "n", "F", "a", "c", "e"] as const;

type Phase = "show" | "hide" | "gone";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    let unmountTimer: number | undefined;

    const minDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 900);
    });
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      window.addEventListener("load", () => resolve(), { once: true });
    });

    Promise.all([minDelay, loaded]).then(() => {
      setPhase("hide");
      unmountTimer = window.setTimeout(() => setPhase("gone"), 600);
    });

    return () => window.clearTimeout(unmountTimer);
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`loading-screen${phase === "hide" ? " is-hidden" : ""}`}
      aria-hidden="true"
    >
      <div className="loading-mark">
        <span className="dot" />
        <span className="loading-word">
          {LETTERS.map((letter, index) => (
            <span key={index} style={{ animationDelay: `${0.1 * index}s` }}>
              {letter}
            </span>
          ))}
        </span>
        <span className="loading-bar" />
      </div>
    </div>
  );
}