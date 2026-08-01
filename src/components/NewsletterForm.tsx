"use client";

import { useActionState } from "react";
import { useT } from "@/lib/i18n";
import { subscribeNewsletter, type FormState } from "@/app/public-actions";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t, locale } = useT();
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

  if (state?.ok) {
    return (
      <p role="status" className={`text-sm ${noteColor}`}>
        {t.hero.joined}
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2 max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <input type="hidden" name="locale" value={locale} />
        {/* Honeypot: hidden from humans, irresistible to bots. */}
        <input
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        />
        {/* min-w-0 lets the input shrink instead of pushing the button out. */}
        <input
          type="email"
          name="email"
          required
          maxLength={200}
          autoComplete="email"
          placeholder={t.hero.emailPlaceholder}
          className={`flex-1 min-w-0 border rounded-full px-5 py-3 text-sm focus:outline-none transition-colors ${inputBase}`}
        />
        {/* shrink-0 + nowrap: without them the button is squeezed into a blob and
            the label wraps onto three lines. */}
        <button
          type="submit"
          disabled={pending}
          className={`shrink-0 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${btnBase}`}
        >
          {pending ? "…" : t.hero.join}
        </button>
      </div>
      {state?.failed && (
        <p role="alert" className={`text-sm ${noteColor}`}>
          {t.hero.error}
        </p>
      )}
    </form>
  );
}
