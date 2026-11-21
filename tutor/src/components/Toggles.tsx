"use client";

import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n/dictionaries";

const YEAR = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
}

const buttonClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-pen-tint hover:text-ink disabled:opacity-60";

/** Switches the interface between Arabic and English and remembers the choice. */
export function LanguageToggle({ locale, label, ariaLabel }: { locale: Locale; label: string; ariaLabel: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className={buttonClass}
      aria-label={ariaLabel}
      disabled={pending}
      lang={locale === "ar" ? "en" : "ar"}
      onClick={() => {
        setCookie("lang", locale === "ar" ? "en" : "ar");
        start(() => router.refresh());
      }}
    >
      {label}
    </button>
  );
}

/** Switches light/dark. Without a saved choice the site follows the device setting. */
export function ThemeToggle({ theme, toDark, toLight }: { theme?: "light" | "dark"; toDark: string; toLight: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const current =
      root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    setCookie("theme", next);
  };
  // Both icons are rendered; CSS shows the right one, so there is no flash before hydration.
  return (
    <button type="button" className={buttonClass} onClick={toggle} data-current={theme ?? "system"}>
      <Moon aria-hidden className="size-4 dark-hide" />
      <Sun aria-hidden className="size-4 light-hide" />
      <span className="sr-only dark-hide">{toDark}</span>
      <span className="sr-only light-hide">{toLight}</span>
    </button>
  );
}
