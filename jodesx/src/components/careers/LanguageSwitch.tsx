"use client";

import Link from "next/link";
import { useEffect } from "react";

const KEY = "jodesx-lang";

function remember(lang: "en" | "ar") {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* storage unavailable: the switch still works for this visit */
  }
}

/** Link to the other-language version of a page; remembers the visitor's choice. */
export function LanguageSwitch({ href, lang, label }: { href: string; lang: "en" | "ar"; label: string }) {
  return (
    <Link href={href} hrefLang={lang} lang={lang} onClick={() => remember(lang)} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg">
      {label}
    </Link>
  );
}

/**
 * On an English page that has an Arabic version: if the device language is Arabic
 * and the visitor hasn't chosen English before, open the Arabic version instead.
 */
export function PreferArabic({ href }: { href: string }) {
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      saved = null;
    }
    if (saved) return;
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    if (langs[0]?.toLowerCase().startsWith("ar")) window.location.replace(href + window.location.hash);
  }, [href]);
  return null;
}
