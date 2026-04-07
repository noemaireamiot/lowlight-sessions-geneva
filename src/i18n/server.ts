import { cookies, headers } from "next/headers";
import { locales, defaultLocale, LOCALE_COOKIE, type Locale } from "./config";

export async function getLocale(): Promise<Locale> {
  // 1. Check cookie
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieValue && locales.includes(cookieValue as Locale)) {
    return cookieValue as Locale;
  }

  // 2. Fallback to Accept-Language header
  const headerStore = await headers();
  const acceptLang = headerStore.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((part) => part.trim().split(";")[0].split("-")[0].toLowerCase())
      .find((lang) => locales.includes(lang as Locale));
    if (preferred) return preferred as Locale;
  }

  return defaultLocale;
}
