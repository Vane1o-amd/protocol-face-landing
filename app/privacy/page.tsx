import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — MenFace",
  description: "Как MenFace обрабатывает ваши персональные данные. GDPR.",
  alternates: { canonical: "/privacy" },
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
        MenFace является контроллером данных для этого сайта. Контакт:{" "}
        <a href="mailto:roman.derkach.business@gmail.com" style={accent}>
          roman.derkach.business@gmail.com
        </a>
        .
      </p>

      <h2 style={sectionH2}>Данные, которые мы собираем</h2>
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
        Вы можете передать эти данные через сайт, Instagram, Facebook или другие
        площадки, где работает MenFace.{" "}
        <strong>Мы не продаём ваши персональные данные третьим лицам.</strong>
      </p>

      <h2 style={sectionH2}>Цель и правовое основание</h2>
      <ul style={list}>
        <li>
          <strong>Ответ на вашу заявку</strong> — согласие (GDPR Art 6(1)(a)),
          даётся при отправке формы.
        </li>
        <li>
          <strong>Измерение конверсии через Meta и аналитика Microsoft
          Clarity</strong> — согласие (GDPR Art 6(1)(a)), которое вы даёте на
          баннере. Без согласия эти инструменты не запускаются. Имя и телефон передаются в
          Meta в виде SHA-256-хеша; IP-адрес, браузер (user agent) и{" "}
          <code>_fbp</code>/<code>_fbc</code> — без хеширования.
        </li>
      </ul>

      <h2 style={sectionH2}>Хранение</h2>
      <p style={dim}>
        Данные лидов хранятся до 12 месяцев, затем удаляются. Вы можете запросить
        удаление раньше. Сообщения в Telegram хранятся согласно настройкам чата
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
          <strong>Telegram</strong> — доставка сообщений по вашей заявке
        </li>
        <li>
          <strong>Supabase</strong> — хранение заявок (имя, контакт, хеш
          IP-адреса, рекламные идентификаторы при согласии)
        </li>
        <li>
          <strong>Microsoft Clarity</strong> — аналитика поведения на сайте
          (клики, прокрутка), только после согласия на баннере. Устанавливает
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
        Ваша заявка доставляется в MenFace через Telegram Bot API, чьи
        серверы управляются Telegram (зарегистрирован на Британских Виргинских
        островах) с маршрутами доставки, которые могут проходить через США. Это
        является передачей персональных данных в третью страну вне ЕС/ЕЭЗ без
        решения об адекватности. Правовое основание: ваше явное согласие (GDPR
        Art 49(1)(a)), данное при отправке формы, и необходимость для выполнения
        вашего запроса на контакт (GDPR Art 6(1)(b)). Вы можете отозвать
        согласие и запросить удаление в любой момент, написав на адрес выше;
        отзыв не влияет на уже выполненную обработку.
      </p>

      <h2 style={sectionH2}>Раскрытие ИИ</h2>
      <p style={dim}>
        По умолчанию каждую заявку читает и отвечает человек. Автоматический
        ИИ-респондер не используется. Если будет введён ИИ-ассистент для обработки
        заявок, эта политика будет обновлена с раскрытием, согласно EU AI Act
        Article 50.
      </p>

      <h2 style={sectionH2}>Ваши права</h2>
      <ul style={list}>
        <li>Доступ, исправление, удаление, переносимость, возражение</li>
        <li>Отозвать согласие в любой момент</li>
        <li>
          Попросить MenFace прекратить связываться с вами в любой момент —
          напишите на адрес выше, и запрос будет выполнен
        </li>
        <li>
          Подать жалобу в надзорный орган по защите данных вашей юрисдикции
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
          Pixel, Clarity и их cookie запускаются только после того, как вы
          нажмёте «Принять» на баннере согласия.
        </strong>{" "}
        Если вы откажетесь, ни они, ни Conversions API не запустятся и данные в
        Meta не отправятся. Ваш выбор хранится локально в браузере (запись{" "}
        <code>pf_marketing_consent</code>) и может быть изменён через очистку
        данных сайта в настройках браузера. Идентификатор клика{" "}
        <code>fbclid</code> хранится только в сессии браузера и только после
        согласия. Для управления или удаления этих
        cookie используйте средства управления cookie вашего браузера.
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