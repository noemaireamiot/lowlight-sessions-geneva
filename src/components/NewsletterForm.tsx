"use client";

import { useActionState } from "react";
import { useT } from "@/lib/i18n";
import { subscribeNewsletter, type FormState } from "@/app/public-actions";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useT();
  const [state, action, pending] = useActionState<FormState, FormData>(
    subscribeNewsletter,
    undefined,
  );

  const inputBase =
    tone === "dark"
      ? "bg-white/10 text-white placeholder:text-white/40 border-white/20 focus:border-white"
      : "bg-paper/60 text-foreground placeholder:text-foreground/40 border-foreground/15 focus:border-foreground";
  const btnBase =
    tone === "dark"
      ? "bg-white text-black hover:bg-white/90"
      : "bg-foreground text-background hover:bg-foreground/90";
  const noteColor = tone === "dark" ? "text-white/70" : "text-foreground/70";
  const inputCls = `w-full min-w-0 border rounded-full px-5 py-3 text-sm focus:outline-none transition-colors ${inputBase}`;

  if (state?.ok) {
    return (
      <p role="status" className={`text-sm ${noteColor}`}>
        {t.hero.joined}
      </p>
    );
  }

  return (
    <form action={action} className="w-full max-w-xl">
      {/* Honeypot: hidden from humans, irresistible to bots. */}
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {/* Names first, then the address and the button — three fields no longer
          fit on one line, so they sit on two rows. Both names are optional. */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          name="firstName"
          maxLength={200}
          autoComplete="given-name"
          placeholder={t.contact.common.firstName}
          aria-label={t.contact.common.firstName}
          className={inputCls}
        />
        <input
          type="text"
          name="lastName"
          maxLength={200}
          autoComplete="family-name"
          placeholder={t.contact.common.lastName}
          aria-label={t.contact.common.lastName}
          className={inputCls}
        />
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          maxLength={200}
          autoComplete="email"
          placeholder={t.hero.emailPlaceholder}
          aria-label={t.hero.emailPlaceholder}
          className={`flex-1 ${inputCls}`}
        />
        <button
          type="submit"
          disabled={pending}
          className={`shrink-0 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${btnBase}`}
        >
          {pending ? "…" : t.hero.join}
        </button>
      </div>

      {state?.failed && (
        <p role="alert" className={`mt-2 text-sm ${noteColor}`}>
          {t.hero.error}
        </p>
      )}
    </form>
  );
}
