import Link from "next/link";
import CookieSettings from "@/components/CookieSettings";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap">
        <span>© {year} MenFace. Все права защищены.</span>
        <nav className="footer-nav">
          <Link href="/">Главная</Link>
          <Link
            href="/privacy"
          >
            Политика конфиденциальности
          </Link>
          <a
            href="https://instagram.com/roman.ascend"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@Roman_DDD1"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
          <a
            href="mailto:roman.derkach.business@gmail.com"
          >
            Email
          </a>
          <CookieSettings />
        </nav>
      </div>
    </footer>
  );
}