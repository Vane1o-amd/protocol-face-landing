import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Спасибо — MenFace",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        background: "var(--color-paper-alt)",
      }}
    >
      <div className="wrap" style={{ maxWidth: "720px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 8vw, 88px)",
            lineHeight: 1.05,
            marginBottom: "24px",
          }}
        >
          Спасибо.
        </h1>
        <p
          style={{
            color: "var(--color-ink-soft)",
            fontSize: "clamp(16px, 2vw, 19px)",
            lineHeight: 1.6,
            marginBottom: "48px",
          }}
        >
          Мы свяжемся лично в течение 24 часов.
        </p>
        <Link
          href="/"
          className="touch btn-primary"
          style={{ display: "inline-block", padding: "18px 36px" }}
        >
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}