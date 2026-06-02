"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const inputBase =
    tone === "dark"
      ? "bg-white/10 text-white placeholder:text-white/40 border-white/20 focus:border-white"
      : "bg-paper/60 text-foreground placeholder:text-foreground/40 border-foreground/15 focus:border-foreground";
  const btnBase =
    tone === "dark"
      ? "bg-white text-black hover:bg-white/90"
      : "bg-foreground text-background hover:bg-foreground/90";

  if (submitted) {
    return (
      <p className={`text-sm ${tone === "dark" ? "text-white/70" : "text-foreground/70"}`}>
        {t.hero.joined}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.hero.emailPlaceholder}
        className={`flex-1 border rounded-full px-5 py-3 text-sm focus:outline-none transition-colors ${inputBase}`}
      />
      <button
        type="submit"
        className={`rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors ${btnBase}`}
      >
        {t.hero.join}
      </button>
    </form>
  );
}
