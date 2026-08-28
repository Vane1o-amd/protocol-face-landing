"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { inViewOnce } from "@/lib/motion";

// Video showcase with a custom control layer ported from romanderkach HeroVideo.
//
// Autoplays muted+looping on load; a centred "Click to unmute" box is shown.
// A control bar (seek, play/pause, mute, volume, fullscreen) shows for 3s,
// then auto-hides. Reappears on pointer move / after unmute. Keyboard
// accessible (Enter/Space on every button).
//
// TODO: Roman has no video yet — section is hidden in app/page.tsx.
// Drop a file at /public/videos/showcase.mp4 and uncomment <VideoShowcase />
// when ready. Controls work the same as romanderkach.com.
const SRC = "/videos/showcase.mp4";
const HIDE_DELAY = 3000;

function formatTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showOverlay, setShowOverlay] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFs, setIsFs] = useState(false);
  const [volume, setVolume] = useState(100); // 0..100

  // Auto-hide controls after HIDE_DELAY of inactivity (only while playing).
  const armHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowControls(true);
    hideTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && !v.paused) setShowControls(false);
    }, HIDE_DELAY);
  }, []);

  // First-load: show controls for 3s, then hide if still muted-autoplaying.
  useEffect(() => {
    armHide();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [armHide]);

  // Sync fullscreen state with the browser (Esc exits).
  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Wire <video> events for progress + state.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (v.duration) setProgress(v.currentTime / v.duration);
    };
    const onDur = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVol = () => {
      setMuted(v.muted);
      setVolume(Math.round(v.volume * 100));
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("durationchange", onDur);
    v.addEventListener("loadedmetadata", onDur);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVol);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("durationchange", onDur);
      v.removeEventListener("loadedmetadata", onDur);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", onVol);
    };
  }, []);

  // Keep overlay in sync: if sound comes on anywhere, drop the unmute box.
  useEffect(() => {
    if (!muted) setShowOverlay(false);
  }, [muted]);

  function unmute() {
    const v = videoRef.current;
    if (v) {
      // Restart from the top so the visitor hears the intro from the start.
      v.muted = false;
      v.volume = 1;
      setVolume(100);
      v.currentTime = 0;
      setProgress(0);
      void v.play().catch(() => {});
    }
    setShowOverlay(false);
    armHide();
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
    armHide();
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.volume = v.volume || 1;
    armHide();
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    const orient = window.screen?.orientation as
      | { lock?: (o: "landscape" | "portrait") => Promise<void>; unlock?: () => void }
      | undefined;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      try { orient?.unlock?.(); } catch { /* orientation API absent or locked by OS */ }
    } else {
      void el.requestFullscreen()
        .catch(() => {})
        .then(() => {
          // Ask the device to rotate to landscape so the 16:9 clip fills the
          // screen uncut. No-op where the API is missing (iOS Safari).
          try { void orient?.lock?.("landscape"); } catch { /* ignore */ }
        });
    }
    armHide();
  }

  // Sizes are CSS-var driven so the <style> block below can shrink the whole
  // control bar on mobile/tablet via media queries (inline styles would
  // otherwise win over stylesheet rules). Vars live on the frame container.
  const ctlStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#fff",
    padding: "var(--hv-pad)",
    margin: 0,
    cursor: "pointer",
    fontSize: "var(--hv-btn-font)",
    lineHeight: 1,
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "var(--hv-btn)",
    minHeight: "var(--hv-btn)",
  };

  return (
    <section id="video" aria-labelledby="video-head">
      <div className="wrap">
        <div className="section-head">
          <motion.div {...inViewOnce}>
            <div className="eyebrow">Видео</div>
            <h2 id="video-head">Как меняется лицо за 30 дней</h2>
          </motion.div>
          <motion.p {...inViewOnce}>
            Короткое видео: реальная трансформация, процесс и результат.
            Никаких фильтров и монтажа.
          </motion.p>
        </div>

        <motion.figure className="video-frame" {...inViewOnce}>
          <div
            ref={containerRef}
            className="hero-video-frame"
            onMouseMove={armHide}
            onMouseLeave={() => {
              const v = videoRef.current;
              if (v && !v.paused) setShowControls(false);
            }}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: isFs ? "0" : "34px",
              overflow: "hidden",
              background: isFs ? "#000" : "var(--color-ink)",
            }}
          >
            {/* TODO: drop a real file at /public/videos/showcase.mp4 */}
            <video
              ref={videoRef}
              src={SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/video-poster.jpg"
              aria-label="Видео трансформации лица за 30 дней — используйте элементы управления: воспроизвести, звук, перемотка, полный экран"
              onClick={togglePlay}
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: "16 / 9",
                borderRadius: isFs ? "0" : "34px",
                objectFit: isFs ? "contain" : "cover",
                objectPosition: "50% 50%",
                display: "block",
                background: "transparent",
              }}
            />

            {/* Click-to-unmute box */}
            {showOverlay && (
              <button
                type="button"
                aria-label="Видео воспроизводится без звука. Нажмите, чтобы включить звук."
                onClick={unmute}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 6,
                  padding: 0,
                  margin: 0,
                  border: "none",
                  background: "transparent",
                }}
              >
                <div
                  className="hero-unmute-box"
                  style={{
                    padding: "var(--hv-unmute-pad)",
                    background: "rgba(251, 251, 253, 0.92)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "16px",
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                >
                  <p style={{ margin: 0, color: "var(--color-ink-soft)", fontSize: "var(--hv-unmute-kicker)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Видео воспроизводится
                  </p>
                  <p style={{ margin: "10px 0 0", color: "var(--color-ink)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--hv-unmute-title)", letterSpacing: "-0.01em" }}>
                    Нажмите, чтобы включить звук
                  </p>
                </div>
              </button>
            )}

            {/* Control bar */}
            <div
              aria-hidden={!showControls}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                gap: "var(--hv-gap)",
                padding: "var(--hv-bar-pad)",
                background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
                opacity: showControls ? 1 : 0,
                transition: "opacity 0.25s ease",
                pointerEvents: showControls ? "auto" : "none",
                zIndex: 5,
              }}
            >
              <button type="button" style={ctlStyle} onClick={togglePlay} aria-label={playing ? "Пауза" : "Воспроизвести"} title={playing ? "Пауза" : "Воспроизвести"}>
                {playing ? "❚❚" : "►"}
              </button>
              <button type="button" style={ctlStyle} onClick={toggleMute} aria-label={muted ? "Включить звук" : "Выключить звук"} title={muted ? "Включить звук" : "Выключить звук"}>
                {muted ? "🔇" : "🔊"}
              </button>
              {/* Volume slider 0..100 — hidden on mobile */}
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                onChange={(e) => {
                  const v = videoRef.current;
                  const val = Number(e.target.value);
                  if (v) {
                    v.volume = val / 100;
                    v.muted = val === 0;
                  }
                  setVolume(val);
                  armHide();
                }}
                aria-label="Громкость"
                className="hv-vol"
                style={{
                  width: "var(--hv-vol)",
                  accentColor: "#fff",
                  cursor: "pointer",
                  height: "6px",
                }}
              />
              {/* Seek track */}
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress * 100}
                onChange={(e) => {
                  const v = videoRef.current;
                  if (!v || !v.duration) return;
                  const ratio = Number(e.target.value) / 100;
                  v.currentTime = ratio * v.duration;
                  setProgress(ratio);
                  armHide();
                }}
                aria-label="Перемотка"
                style={{
                  flex: 1,
                  minWidth: 0,
                  accentColor: "#fff",
                  cursor: "pointer",
                  height: "6px",
                }}
              />
              <span style={{ color: "#fff", fontSize: "var(--hv-time)", fontVariantNumeric: "tabular-nums", minWidth: "var(--hv-time-w)", textAlign: "right" }}>
                {formatTime(progress * duration)}
              </span>
              <button type="button" style={ctlStyle} onClick={toggleFullscreen} aria-label={isFs ? "Выйти из полного экрана" : "Полный экран"} title={isFs ? "Выйти из полного экрана" : "Полный экран"}>
                {isFs ? "⤡" : "⤢"}
              </button>
            </div>

            <style>{`
              .hero-video-frame {
                --hv-btn: 40px;
                --hv-pad: 8px 10px;
                --hv-btn-font: 16px;
                --hv-gap: 10px;
                --hv-bar-pad: 10px 14px;
                --hv-vol: 70px;
                --hv-time: 12px;
                --hv-time-w: 34px;
                --hv-unmute-pad: 22px 30px;
                --hv-unmute-title: 22px;
                --hv-unmute-kicker: 13px;
              }
              @media (max-width: 1023px) {
                .hero-video-frame { --hv-vol: 50px; }
              }
              @media (max-width: 767px) {
                .hero-video-frame {
                  --hv-btn: 32px;
                  --hv-pad: 6px 8px;
                  --hv-btn-font: 14px;
                  --hv-gap: 6px;
                  --hv-bar-pad: 8px 10px;
                  --hv-vol: 0px;
                  --hv-time: 11px;
                  --hv-time-w: 30px;
                  --hv-unmute-pad: 14px 20px;
                  --hv-unmute-title: 18px;
                  --hv-unmute-kicker: 11px;
                }
                .hero-video-frame .hv-vol { display: none; }
              }
              @keyframes hero-pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.82; transform: scale(0.985); }
              }
              .hero-unmute-box { animation: hero-pulse 2.4s ease-in-out infinite; }
              @media (prefers-reduced-motion: reduce) {
                .hero-unmute-box { animation: none; }
              }
            `}</style>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}