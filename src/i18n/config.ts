export const locales = ["fr", "en", "it", "de", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const LOCALE_COOKIE = "locale";
