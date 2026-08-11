"use client";

import { useActionState, useState } from "react";
import { useT } from "@/lib/i18n";
import { submitContact, type FormState } from "@/app/public-actions";
import { MUSIC_STYLES } from "@/lib/music-styles";

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

  const btnCls = `mt-2 shrink-0 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors ${
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

      {/* Intro for the active tab. aria-live so a screen reader announces the
          change when the tab is switched. */}
      <p
        aria-live="polite"
        className={`mb-6 font-serif text-base leading-relaxed ${
          isDark ? "text-white/70" : "text-foreground/70"
        }`}
      >
        {t.contact[tab].intro}
      </p>

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
            <div>
              <label className={labelCls} htmlFor="genre">
                {t.contact.perform.genre}
              </label>
              <select id="genre" className={inputCls} name="genre" defaultValue="">
                <option value="">—</option>
                {t.contact.perform.genreOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* A datalist, not a select: the list runs to 717 entries, and an
                artist must still be able to type a style it does not cover. */}
            <div>
              <label className={labelCls} htmlFor="genreSub">
                {t.contact.perform.genreSub}
              </label>
              <input
                id="genreSub"
                name="genreSub"
                list="music-styles"
                autoComplete="off"
                placeholder={t.contact.perform.genreSubHint}
                className={inputCls}
              />
              <datalist id="music-styles">
                {MUSIC_STYLES.map((style) => (
                  <option key={style} value={style} />
                ))}
              </datalist>
            </div>

            <Field label={t.contact.perform.members} inputCls={inputCls} labelCls={labelCls} name="members" type="number" />
            <Field label={t.contact.perform.managerName} inputCls={inputCls} labelCls={labelCls} name="managerName" />
            <Field label={t.contact.perform.manager} inputCls={inputCls} labelCls={labelCls} name="manager" type="email" />
            <Field label={t.contact.perform.website} inputCls={inputCls} labelCls={labelCls} name="website" />
            <Field className="sm:col-span-2" label={t.contact.perform.socials} inputCls={inputCls} labelCls={labelCls} name="socials" />

            <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="recording"
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--accent)]"
              />
              <span className={isDark ? "text-white/80" : "text-foreground/80"}>
                {t.contact.perform.recording}
              </span>
            </label>
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
