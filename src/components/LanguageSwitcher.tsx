"use client";

import { locales, LOCALE_COOKIE, type Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  current: Locale;
}

export default function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  function switchLocale(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2 ml-4 border-l border-white/10 pl-4">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`text-[10px] uppercase transition-colors duration-200 cursor-pointer ${
            l === current ? "text-amber" : "text-muted/50 hover:text-muted"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
