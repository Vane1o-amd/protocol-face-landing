import type { Metadata } from "next";
import { OG_BASE, TWITTER_BASE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — MenFace",
  description: "Как MenFace обрабатывает твои персональные данные. GDPR.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    ...OG_BASE,
    title: "Политика конфиденциальности — MenFace",
    description: "Как MenFace обрабатывает твои персональные данные. GDPR.",
    url: "/privacy",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Политика конфиденциальности — MenFace",
    description: "Как MenFace обрабатывает твои персональные данные. GDPR.",
  },
  robots: { index: true, follow: true },
};

const sectionH2: React.CSSProperties = {
  fontSize: "22px",
  marginTop: "40px",
  marginBottom: "12px",
};
const dim: React.CSSProperties = { color: "var(--color-ink-soft)" };
const list: React.CSSProperties = { ...dim, paddingLeft: "20px", lineHeight: 1.8 };
const accent = { color: "var(--color-mark)", textDecoration: "underline" } as const;

export default function PrivacyPage() {
  return (
    <main
      className="wrap"
      style={{
        paddingTop: "120px",
        paddingBottom: "120px",
        maxWidth: "720px",
      }}
    >
      <h1 style={{ marginBottom: "48px" }}>Политика конфиденциальности</h1>

      <h2 style={sectionH2}>Контроллер данных</h2>
      <p style={dim}>
        Контроллер данных этого сайта — Roman Derkach (menface). Контакт:{" "}
        <a href="mailto:roman.derkach.business@gmail.com" style={accent}>
          roman.derkach.business@gmail.com
        </a>
        .
      </p>

      <h2 style={sectionH2}>Данные, которые я собираю</h2>
      <ul style={list}>
        <li>Имя, телефон или Telegram</li>
        <li>
          После согласия на маркетинг: идентификатор рекламного клика{" "}
          <code>fbclid</code> и cookie <code>_fbp</code>
        </li>
        <li>
          IP-адрес (для защиты от спама; в базе хранится только его хеш)
        </li>
        <li>Отметка времени согласия</li>
      </ul>
      <p style={{ ...dim, marginTop: "12px" }}>
        Ты можешь передать эти данные через сайт, Instagram, Facebook или другие
        площадки, где работает MenFace.{" "}
        <strong>Я не продаю твои персональные данные третьим лицам.</strong>
      </p>

      <h2 style={sectionH2}>Цель и правовое основание</h2>
      <ul style={list}>
        <li>
          <strong>Ответ на твою заявку</strong> — действия по твоему запросу до
          заключения договора (GDPR Art 6(1)(b)).
        </li>
        <li>
          <strong>Защита формы от спама</strong> (хеш IP-адреса) — законный
          интерес (GDPR Art 6(1)(f)).
        </li>
        <li>
          <strong>Измерение конверсии через Meta и аналитика Microsoft
          Clarity</strong> — согласие (GDPR Art 6(1)(a)), которое ты даёшь на
          баннере. Без согласия эти инструменты не запускаются. Имя и телефон передаются в
          Meta в виде SHA-256-хеша; IP-адрес, браузер (user agent) и{" "}
          <code>_fbp</code>/<code>_fbc</code> — без хеширования.
        </li>
      </ul>

      <h2 style={sectionH2}>Хранение</h2>
      <p style={dim}>
        Данные заявки хранятся, пока они нужны, чтобы ответить на твой запрос.
        Ты можешь в любой момент запросить их удаление, написав на адрес выше.
        Сообщения в Telegram хранятся согласно настройкам чата
        MenFace; удаление из Telegram выполняется вручную по запросу.
      </p>

      <h2 style={sectionH2}>Сторонние обработчики</h2>
      <ul style={list}>
        <li>
          <strong>Vercel</strong> — хостинг сайта. Также предоставляет{" "}
          <strong>Vercel Analytics</strong> (агрегированная статистика
          посещений, без cookie, без персональных данных) и{" "}
          <strong>Vercel Speed Insights</strong> (метрики производительности
          страницы). Оба инструмента не устанавливают cookie и не собирают
          персональные данные, поэтому не требуют согласия GDPR, но раскрываются
          здесь для прозрачности. Регулируется{" "}
          <a href="https://vercel.com/legal/privacy-policy" style={accent}>
            Политикой конфиденциальности Vercel
          </a>
          .
        </li>
        <li>
          <strong>Telegram</strong> — доставка сообщений по твоей заявке
        </li>
        <li>
          <strong>Supabase</strong> — хранение заявок (имя, контакт, хеш
          IP-адреса, рекламные идентификаторы при согласии)
        </li>
        <li>
          <strong>Microsoft Clarity</strong> — аналитика поведения на сайте,
          включая запись сессий (клики, прокрутка, движения мыши; поля формы
          маскируются), только после согласия на баннере. Устанавливает
          cookie <code>_clck</code> и <code>_clsk</code>. Регулируется{" "}
          <a href="https://privacy.microsoft.com/privacystatement" style={accent}>
            Заявлением о конфиденциальности Microsoft
          </a>
          .
        </li>
        <li>
          <strong>Meta Platforms Ireland Ltd.</strong> — измерение конверсии
          (Meta Pixel и Conversions API). Pixel загружается с серверов Meta и
          устанавливает cookie <code>_fbp</code> и <code>_fbc</code>. Conversions
          API отправляет хешированные (SHA-256) идентификаторы (имя,
          телефон) и события конверсии на сервер. Использование этих данных
          Meta регулируется{" "}
          <a href="https://www.facebook.com/privacy/policy" style={accent}>
            Политикой данных Meta
          </a>
          .
        </li>
      </ul>
      <p style={dim}>
        Шрифты размещены на этом домене. Внешние запросы: Vercel Analytics и
        Speed Insights (агрегированные метрики, без cookie), Supabase
        (хранение заявок), Telegram Bot API (доставка заявки); после согласия
        также Meta и Microsoft Clarity (см. раздел «Cookie и согласие»).
      </p>

      <h2 style={sectionH2}>Передача данных в третью страну</h2>
      <p style={dim}>
        Твоя заявка доставляется в MenFace через Telegram Bot API, чьи
        серверы управляются Telegram (зарегистрирован на Британских Виргинских
        островах) с маршрутами доставки, которые могут проходить через США. Это
        является передачей персональных данных в третью страну вне ЕС/ЕЭЗ.
        Риск: эту передачу не покрывает ни решение ЕС об адекватности, ни другие
        гарантии, поэтому защита данных и твои права на уровне ЕС там не
        гарантированы. Передача основана на твоём явном согласии (GDPR
        Art 49(1)(a)), данном при отправке формы. Ты можешь отозвать согласие и
        запросить удаление в любой момент, написав на адрес выше; отзыв не
        влияет на уже выполненную обработку.
      </p>
      <p style={dim}>
        Vercel (США), Meta (Meta Platforms Inc., США) и Microsoft (США) могут
        обрабатывать данные в США. Такая передача основана на решении об
        адекватности EU-US Data Privacy Framework (GDPR Art 45) для
        сертифицированных компаний, а также на стандартных договорных условиях
        Еврокомиссии (GDPR Art 46(2)(c)).
      </p>

      <h2 style={sectionH2}>Раскрытие ИИ</h2>
      <p style={dim}>
        По умолчанию каждую заявку читает человек и отвечает на неё. Автоматический
        ИИ-респондер не используется. Если будет введён ИИ-ассистент для обработки
        заявок, эта политика будет обновлена с раскрытием согласно EU AI Act,
        статья 50.
      </p>

      <h2 style={sectionH2}>Твои права</h2>
      <ul style={list}>
        <li>Доступ, исправление, удаление, переносимость, возражение</li>
        <li>Отзыв согласия в любой момент</li>
        <li>
          Требование к MenFace прекратить связываться с тобой в любой момент —
          напиши на адрес выше, и запрос будет выполнен
        </li>
        <li>
          Подать жалобу в надзорный орган по защите данных твоей юрисдикции
        </li>
      </ul>

      <h2 style={sectionH2}>Cookie и согласие</h2>
      <p style={dim}>
        Сайт использует Meta Pixel для измерения конверсии (cookie{" "}
        <code>_fbp</code> и <code>_fbc</code>) и Microsoft Clarity для аналитики
        (cookie <code>_clck</code> и <code>_clsk</code>). Conversions API
        отправляет хешированные идентификаторы с сервера и не устанавливает
        cookie.{" "}
        <strong>
          Pixel, Clarity и их cookie запускаются только после того, как ты
          нажмёшь «Принять» на баннере согласия.
        </strong>{" "}
        Если ты откажешься, ни они, ни Conversions API не запустятся и данные в
        Meta не отправятся. Твой выбор хранится локально в браузере (запись{" "}
        <code>pf_marketing_consent</code>) и может быть изменён или отозван кнопкой
        «Настройки cookie» внизу любой страницы. Идентификатор клика{" "}
        <code>fbclid</code> появляется только после согласия: до отправки формы он
        хранится в сессии браузера, после отправки — вместе с заявкой. Управлять этими cookie и удалять их
        можно также в настройках своего браузера.
      </p>

      <p
        style={{
          marginTop: "48px",
          fontSize: "13px",
          color: "var(--color-ink-soft)",
        }}
      >
        Последнее обновление: 2026-11-25.
      </p>
    </main>
  );
}