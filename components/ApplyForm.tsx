"use client";

import { useId, useState, useRef } from "react";
import Link from "next/link";
import { trackLead } from "@/components/MetaPixel";
import { consentGranted } from "@/lib/consent";
import { readFbclid } from "@/lib/meta-cookies";

type FieldErrors = Record<string, string>;
type Issues = { field?: string; message: string }[];

export default function ApplyForm() {
  const nameId = useId();
  const contactId = useId();
  const goalId = useId();
  const consentId = useId();
  const hpId = useId();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const goalRef = useRef<HTMLTextAreaElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFieldErrors({});
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const goal = String(data.get("goal") ?? "").trim();
    const consent = data.get("consent") === "on";
    const hp = String(data.get("company") ?? "").trim();

    if (hp) {
      setStatus("success");
      setMessage("Заявка отправлена. Мы свяжемся в течение 24 часов.");
      form.reset();
      return;
    }

    const issues: Issues = [];
    if (!name) issues.push({ field: "name", message: "Укажите имя" });
    if (!contact) issues.push({ field: "contact", message: "Укажите телефон или Telegram" });
    if (!goal) issues.push({ field: "goal", message: "Опишите цель" });
    if (!consent) issues.push({ field: "consent", message: "Требуется согласие на обработку" });

    if (issues.length > 0) {
      const errors: FieldErrors = {};
      for (const i of issues) {
        if (i.field) errors[i.field] = i.message;
      }
      setFieldErrors(errors);
      setStatus("error");
      setMessage(issues[0].message);
      const order = [nameRef, contactRef, goalRef, consentRef];
      for (const ref of order) {
        if (ref.current && ref.current.dataset.error === "true") {
          ref.current.focus();
          break;
        }
      }
      return;
    }

    const eventId = crypto.randomUUID();
    const fbclid = readFbclid();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, goal, consent, eventId, fbclid }),
      });

      const body = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !body.ok) {
        const errText = body.error ?? "Ошибка отправки. Попробуйте позже.";
        setStatus("error");
        setMessage(errText);
        return;
      }

      if (consentGranted()) {
        trackLead(eventId);
      }

      setStatus("success");
      setMessage("Заявка отправлена. Мы свяжемся в течение 24 часов.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Сеть недоступна. Попробуйте позже.");
    }
  }

  return (
    <section id="apply" className="alt" aria-labelledby="apply-head">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Заявка</div>
            <h2 id="apply-head">Оставить заявку</h2>
          </div>
          <p>Ответ в течение 24 часов. Без спама и навязчивых звонков.</p>
        </div>

        <form
          className="lead-form"
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={status === "error" ? "form-status" : undefined}
        >
          <div className="field">
            <label htmlFor={nameId}>Имя</label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ваше имя"
              ref={nameRef}
              data-error={!!fieldErrors.name}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? `${nameId}-err` : undefined}
            />
            {fieldErrors.name && (
              <span id={`${nameId}-err`} className="field-error">
                {fieldErrors.name}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor={contactId}>Телефон или Telegram</label>
            <input
              id={contactId}
              name="contact"
              type="text"
              autoComplete="tel"
              placeholder="+47 ... или @telegram"
              ref={contactRef}
              data-error={!!fieldErrors.contact}
              aria-invalid={!!fieldErrors.contact}
              aria-describedby={fieldErrors.contact ? `${contactId}-err` : undefined}
            />
            {fieldErrors.contact && (
              <span id={`${contactId}-err`} className="field-error">
                {fieldErrors.contact}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor={goalId}>Цель</label>
            <textarea
              id={goalId}
              name="goal"
              rows={3}
              placeholder="Опишите, что хотите изменить"
              ref={goalRef}
              data-error={!!fieldErrors.goal}
              aria-invalid={!!fieldErrors.goal}
              aria-describedby={fieldErrors.goal ? `${goalId}-err` : undefined}
            />
            {fieldErrors.goal && (
              <span id={`${goalId}-err`} className="field-error">
                {fieldErrors.goal}
              </span>
            )}
          </div>

          <div className="consent-row">
            <input
              id={consentId}
              name="consent"
              type="checkbox"
              ref={consentRef}
              data-error={!!fieldErrors.consent}
              aria-invalid={!!fieldErrors.consent}
              aria-describedby={fieldErrors.consent ? `${consentId}-err` : undefined}
            />
            <label htmlFor={consentId}>
              Согласен на обработку персональных данных согласно{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener"
                style={{
                  color: "var(--color-mark)",
                  textDecoration: "underline",
                }}
              >
                политике конфиденциальности
              </Link>
            </label>
            {fieldErrors.consent && (
              <span id={`${consentId}-err`} className="field-error">
                {fieldErrors.consent}
              </span>
            )}
          </div>

          <div className="honeypot" aria-hidden="true">
            <label htmlFor={hpId}>Компания (не заполнять)</label>
            <input id={hpId} name="company" type="text" tabIndex={-1} autoComplete="off" placeholder="Компания" />
          </div>

          <button type="submit" className="submit-btn" disabled={status === "loading"}>
            {status === "loading" ? "Отправка…" : "Отправить заявку"}
          </button>

          {message && (
            <output
              id="form-status"
              className={`form-status show ${status === "success" ? "success" : "error"}`}
              aria-live="polite"
            >
              {message}
            </output>
          )}
        </form>
      </div>
    </section>
  );
}