import { CTA_PRIMARY } from "@/components/cta-strings";

const ROWS = [
  {
    when: "Неделя 0",
    what: "Старт. Фото до, замеры, постановка цели.",
  },
  {
    when: "Недели 1–2",
    what: "Уходят отёки. Осанка, тонус, привычки начинают меняться.",
  },
  {
    when: "Неделя 4",
    what: "Первые видимые изменения. Лицо становится выразительнее.",
  },
  {
    when: "Неделя 8",
    what: "Изменения заметны окружающим.",
  },
  {
    when: "День 90",
    what: "Устойчивый результат. Фото после, план поддержки и самостоятельной работы.",
  },
] as const;

export default function Timeline() {
  return (
    <section id="timeline" className="alt" aria-labelledby="timeline-head">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Таймлайн</div>
            <h2 id="timeline-head">Что происходит за 90 дней</h2>
          </div>
          <p>
            Не за неделю. Не через год. Постепенно — и результат остаётся.
          </p>
        </div>

        <div className="timeline">
          {ROWS.map((r) => (
            <div className="t-row" key={r.when}>
              <span className="t-when">{r.when}</span>
              <span className="t-what">{r.what}</span>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <a href="#apply" className="btn-primary">{CTA_PRIMARY}</a>
        </div>
      </div>
    </section>
  );
}