import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap">
        <span>© {year} Protocol Face. Все права защищены.</span>
        <nav className="footer-nav">
          <Link
            href="/privacy"
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--color-line)",
            }}
          >
            Политика конфиденциальности
          </Link>
          <a
            href="https://instagram.com/roman.ascend"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--color-line)",
            }}
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@Roman_DDD1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--color-line)",
            }}
          >
            YouTube
          </a>
          <a
            href="mailto:roman.derkach.business@gmail.com"
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--color-line)",
            }}
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}