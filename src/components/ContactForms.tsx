"use client";

import { useActionState, useState } from "react";
import { useT } from "@/lib/i18n";
import { submitContact, type FormState } from "@/app/public-actions";

type Tab = "volunteer" | "venue" | "perform";

export function ContactForms({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useT();
  const [tab, setTab] = useState<Tab>("volunteer");
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitContact,
    undefined,
  );
  const sent = state?.ok === true;

  const isDark = tone === "dark";
  const tabBase = "px-4 py-2 text-sm tracking-wide uppercase transition-colors cursor-pointer rounded-full";
  const tabActive = isDark ? "bg-white text-black" : "bg-foreground text-background";
  const tabInactive = isDark
    ? "text-white/60 hover:text-white border border-white/20"
    : "text-foreground/60 hover:text-foreground border border-foreground/15";

  const inputCls = `w-full border rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors ${
    isDark
      ? "bg-white/10 text-white placeholder:text-white/40 border-white/20 focus:border-white"
      : "bg-paper/40 text-foreground placeholder:text-foreground/40 border-foreground/15 focus:border-foreground"
  }`;

  const labelCls = `block text-xs uppercase tracking-widest mb-1.5 ${
    isDark ? "text-white/60" : "text-foreground/60"
  }`;

  const btnCls = `mt-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors ${
    isDark ? "bg-white text-black hover:bg-white/90" : "bg-foreground text-background hover:bg-foreground/90"
  }`;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6">
        {(["volunteer", "venue", "perform"] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`${tabBase} ${tab === key ? tabActive : tabInactive}`}
          >
            {t.contact.tabs[key]}
          </button>
        ))}
      </div>

      <form action={action} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* The active tab decides which extra fields the server keeps. */}
        <input type="hidden" name="kind" value={tab} />
        {/* Honeypot: hidden from humans, irresistible to bots. */}
        <input
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        />
        <Field label={t.contact.common.firstName} inputCls={inputCls} labelCls={labelCls} name="firstName" required />
        <Field label={t.contact.common.lastName} inputCls={inputCls} labelCls={labelCls} name="lastName" required />
        <Field label={t.contact.common.email} inputCls={inputCls} labelCls={labelCls} name="email" type="email" required />
        <Field label={t.contact.common.phone} inputCls={inputCls} labelCls={labelCls} name="phone" />

        {tab === "venue" && (
          <>
            <Field className="sm:col-span-2" label={t.contact.venue.address} inputCls={inputCls} labelCls={labelCls} name="address" />
            <div className="sm:col-span-2">
              <label className={labelCls}>{t.contact.venue.type}</label>
              <select className={inputCls} name="type" defaultValue="">
                <option value="" disabled>—</option>
                {t.contact.venue.typeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <TextArea className="sm:col-span-2" label={t.contact.venue.message} inputCls={inputCls} labelCls={labelCls} name="message" />
          </>
        )}

        {tab === "perform" && (
          <>
            <Field className="sm:col-span-2" label={t.contact.perform.bandName} inputCls={inputCls} labelCls={labelCls} name="bandName" />
            <Field label={t.contact.perform.zip} inputCls={inputCls} labelCls={labelCls} name="zip" />
            <Field label={t.contact.perform.city} inputCls={inputCls} labelCls={labelCls} name="city" />
            <Field label={t.contact.perform.genre} inputCls={inputCls} labelCls={labelCls} name="genre" />
            <Field label={t.contact.perform.members} inputCls={inputCls} labelCls={labelCls} name="members" type="number" />
            <Field label={t.contact.perform.manager} inputCls={inputCls} labelCls={labelCls} name="manager" />
            <Field label={t.contact.perform.website} inputCls={inputCls} labelCls={labelCls} name="website" />
            <Field className="sm:col-span-2" label={t.contact.perform.socials} inputCls={inputCls} labelCls={labelCls} name="socials" />
          </>
        )}

        {tab === "volunteer" && (
          <>
            <Field className="sm:col-span-2" label={t.contact.volunteer.skill} inputCls={inputCls} labelCls={labelCls} name="skill" />
            <TextArea className="sm:col-span-2" label={t.contact.volunteer.message} inputCls={inputCls} labelCls={labelCls} name="message" />
          </>
        )}

        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className={`${btnCls} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pending ? "…" : t.contact.common.submit}
          </button>
          {sent && (
            <span
              role="status"
              className={`text-sm ${isDark ? "text-white/70" : "text-foreground/70"}`}
            >
              {t.contact.common.sent}
            </span>
          )}
          {state?.failed && (
            <span
              role="alert"
              className={`text-sm ${isDark ? "text-white/70" : "text-foreground/70"}`}
            >
              {t.contact.common.error}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  inputCls,
  labelCls,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  inputCls: string;
  labelCls: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelCls} htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} required={required} className={inputCls} />
    </div>
  );
}

function TextArea({
  label,
  name,
  inputCls,
  labelCls,
  className = "",
}: {
  label: string;
  name: string;
  inputCls: string;
  labelCls: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelCls} htmlFor={name}>
        {label}
      </label>
      <textarea id={name} name={name} rows={4} className={inputCls} />
    </div>
  );
}
