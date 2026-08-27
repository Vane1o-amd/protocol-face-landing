import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>Protocol Face © 2026</span>
        <nav style={{ display: "flex", gap: "18px" }}>
          <Link
            href="/privacy"
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--color-line)",
            }}
          >
            Политика конфиденциальности
          </Link>
        </nav>
        <span>Персональная диагностика и сопровождение</span>
      </div>
    </footer>
  );
}