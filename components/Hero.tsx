import { CTA_PRIMARY, CTA_TURNAROUND } from "@/components/cta-strings";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Личный протокол лица</div>
            <h1>
              Мужское, выразительное лицо за 90 дней
            </h1>
            <p className="sub">
              Уберу отёки, жир и прыщи, добавлю контраст и чёткую челюсть —
              без жёстких диет, инъекций и спортзала. Всего 15 минут в день.
            </p>
            <p className="hero-subtitle">
              Персональный протокол по фото и разбору. Первые изменения — уже
              через 7 дней. Система встраивается в любой график: командировки,
              тренировки, ресторан — без исключений.
            </p>
            <ul className="hero-points">
              <li>
                <img
                  src="/images/galochka.svg"
                  alt=""
                  width={29}
                  height={22}
                  className="point-check"
                />
                <span className="point-body">
                  <b>Не косметика, а причина.</b>
                  <span>
                    Работаю не с симптомами (крем, филлер), а с первопричиной:
                    осанка, тонус мышц лица, мимические привычки.
                  </span>
                </span>
              </li>
              <li>
                <img
                  src="/images/galochka.svg"
                  alt=""
                  width={29}
                  height={22}
                  className="point-check"
                />
                <span className="point-body">
                  <b>Без стресса и голода.</b>
                  <span>
                    Изменения копятся постепенно, шаг за шагом. Никаких жёстких
                    диет, уколов и тяжёлых тренировок — 15 минут в день.
                  </span>
                </span>
              </li>
              <li>
                <img
                  src="/images/galochka.svg"
                  alt=""
                  width={29}
                  height={22}
                  className="point-check"
                />
                <span className="point-body">
                  <b>Результат остаётся.</b>
                  <span>
                    Протокол меняет привычки, а не даёт разовый эффект — после
                    завершения работы форма и тонус лица не откатываются назад.
                  </span>
                </span>
              </li>
            </ul>
            <div className="cta-row">
              <a href="#apply" className="btn-primary">
                {CTA_PRIMARY}
              </a>
              <span className="note">
                {CTA_TURNAROUND} · разбор бесплатный · веду клиентов
                лично, количество мест на месяц ограничено
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <figure>
              <Image
                src="/images/hero-before.jpg"
                alt="Результат протокола лица"
                width={1600}
                height={1136}
                sizes="(min-width: 1024px) 50vw, 100vw"
                preload
              />
            </figure>

            <p className="visual-note">
              <b>Не косметика.</b> Структурная работа с лицом: осанка, тонус,
              привычки. Результат накапливается постепенно и остаётся.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}