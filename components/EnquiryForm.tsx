"use client";

import { useMemo, useState } from "react";
import { istToday, nightsBetween } from "@/lib/ist";
import { validateEnquiry, normaliseMobile, type EnquiryErrors } from "@/lib/validate";
import { composeEnquiryMessage, whatsappLink } from "@/lib/whatsapp";
import { OCCUPANCY } from "@/lib/constants";

const EMPTY = { name: "", mobile: "", checkIn: "", checkOut: "", guests: "" };

export function EnquiryForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [fallback, setFallback] = useState<string | null>(null);
  const today = useMemo(() => istToday(), []);

  const nights =
    values.checkIn && values.checkOut ? nightsBetween(values.checkIn, values.checkOut) : 0;

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
    setFallback(null);
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const found = validateEnquiry(values, today);
    if (Object.keys(found).length) {
      setErrors(found);
      const first = document.querySelector<HTMLElement>("[data-invalid='true']");
      first?.focus();
      return;
    }

    const payload = { ...values, mobile: normaliseMobile(values.mobile) };
    const message = composeEnquiryMessage(payload);
    const link = whatsappLink(message);

    // Backup record. Deliberately not awaited: a slow or failed POST must
    // never block or swallow the enquiry. `keepalive` lets it finish after
    // we navigate away.
    try {
      void fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, nights, message }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never block the handoff */
    }

    // Same tick, same user gesture, same tab — no popup blocker, and it
    // works inside in-app browsers where window.open is unreliable.
    setFallback(link);
    window.location.href = link;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          error={errors.name}
          className="sm:col-span-2"
          input={
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              data-invalid={Boolean(errors.name)}
              aria-invalid={Boolean(errors.name)}
              className={inputCls}
            />
          }
        />
        <Field
          label="Mobile number"
          hint="10 digits, Indian mobile"
          error={errors.mobile}
          className="sm:col-span-2"
          input={
            <div className="flex items-stretch">
              <span className="tnum flex select-none items-center rounded-l-sm border border-r-0 border-current/25 bg-current/5 px-3 text-[16px] opacity-70">
                +91
              </span>
              <input
                type="tel"
                name="mobile"
                inputMode="numeric"
                autoComplete="tel-national"
                value={values.mobile}
                onChange={set("mobile")}
                data-invalid={Boolean(errors.mobile)}
                aria-invalid={Boolean(errors.mobile)}
                className={`${inputCls} tnum rounded-l-none`}
              />
            </div>
          }
        />
        <Field
          label="Check-in"
          error={errors.checkIn}
          input={
            <input
              type="date"
              name="checkIn"
              min={today}
              value={values.checkIn}
              onChange={set("checkIn")}
              data-invalid={Boolean(errors.checkIn)}
              aria-invalid={Boolean(errors.checkIn)}
              className={`${inputCls} tnum`}
            />
          }
        />
        <Field
          label="Check-out"
          error={errors.checkOut}
          hint={nights > 0 ? `${nights} night${nights === 1 ? "" : "s"}` : undefined}
          input={
            <input
              type="date"
              name="checkOut"
              min={values.checkIn || today}
              value={values.checkOut}
              onChange={set("checkOut")}
              data-invalid={Boolean(errors.checkOut)}
              aria-invalid={Boolean(errors.checkOut)}
              className={`${inputCls} tnum`}
            />
          }
        />
        <Field
          label="Number of guests"
          hint={`we sleep ${OCCUPANCY.maxGuests}`}
          error={errors.guests}
          className="sm:col-span-2"
          input={
            <input
              type="number"
              name="guests"
              min={1}
              step={1}
              inputMode="numeric"
              value={values.guests}
              onChange={set("guests")}
              data-invalid={Boolean(errors.guests)}
              aria-invalid={Boolean(errors.guests)}
              className={`${inputCls} tnum sm:max-w-40`}
            />
          }
        />
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-full bg-terracotta px-7 py-4 text-[16px] font-semibold text-paper transition-opacity hover:opacity-90 sm:w-auto"
      >
        Send this on WhatsApp
      </button>

      <p className="mt-3 text-[13px] opacity-60">
        This opens WhatsApp with your details already written out. You can read
        it before you send.
      </p>

      {fallback && (
        <p className="mt-4 text-[15px]">
          <a
            href={fallback}
            target="_blank"
            rel="noopener noreferrer"
            className="link font-semibold"
          >
            WhatsApp didn&rsquo;t open — tap here
          </a>
        </p>
      )}
    </form>
  );
}

const inputCls =
  "w-full rounded-sm border border-current/25 bg-transparent px-3.5 py-3 text-[16px] outline-none transition-colors placeholder:opacity-40 focus:border-terracotta aria-[invalid=true]:border-terracotta";

function Field({
  label,
  hint,
  error,
  input,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  input: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em] opacity-65">
          {label}
        </span>
        {hint && !error && (
          <span className="tnum text-[12px] opacity-50">{hint}</span>
        )}
      </span>
      {input}
      {error && (
        <span role="alert" className="mt-1.5 block text-[13px] text-terracotta">
          {error}
        </span>
      )}
    </label>
  );
}
