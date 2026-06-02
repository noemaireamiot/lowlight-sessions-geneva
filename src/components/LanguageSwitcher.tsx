"use client";

import { useT } from "@/lib/i18n";

export function LanguageSwitcher({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const { locale, setLocale } = useT();
  const base =
    "px-2 py-1 text-xs uppercase tracking-widest transition-colors cursor-pointer";
  const inactive =
    tone === "dark"
      ? "text-white/50 hover:text-white"
      : "text-foreground/50 hover:text-foreground";
  const active = tone === "dark" ? "text-white" : "text-foreground";

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`${base} ${locale === "en" ? active : inactive}`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <span className={tone === "dark" ? "text-white/30" : "text-foreground/30"}>/</span>
      <button
        type="button"
        onClick={() => setLocale("fr")}
        className={`${base} ${locale === "fr" ? active : inactive}`}
        aria-pressed={locale === "fr"}
      >
        FR
      </button>
    </div>
  );
}
