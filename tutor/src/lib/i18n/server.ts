import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, dictionaries, isLocale, type Locale } from "./dictionaries";

export const LOCALE_COOKIE = "lang";
export const THEME_COOKIE = "theme";

/** The interface language the visitor chose (saved in a cookie), Arabic by default. */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}

/** "light" | "dark" when chosen by the visitor, otherwise undefined (follow the device). */
export async function getTheme(): Promise<"light" | "dark" | undefined> {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  return value === "light" || value === "dark" ? value : undefined;
}
