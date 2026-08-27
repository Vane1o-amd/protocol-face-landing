import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="wrap"
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: "24px",
      }}
    >
      <h1 style={{ fontSize: "clamp(48px, 10vw, 96px)" }}>404</h1>
      <p style={{ color: "var(--color-ink-soft)", maxWidth: "480px" }}>
        Такой страницы нет. Работа продолжается на главной.
      </p>
      <Link
        href="/"
        className="touch btn-primary"
        style={{ padding: "16px 32px" }}
      >
        На главную
      </Link>
      <Link
        href="/#apply"
        style={{
          color: "var(--color-ink-soft)",
          textDecoration: "underline",
        }}
      >
        Или оставить заявку →
      </Link>
    </main>
  );
}