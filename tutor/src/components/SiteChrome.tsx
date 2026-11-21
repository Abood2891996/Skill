import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { LanguageToggle, ThemeToggle } from "./Toggles";

export function Logo({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2">
      {/* Mark: an open notebook with a pen stroke. */}
      <svg aria-hidden viewBox="0 0 32 32" className="size-8 shrink-0">
        <rect x="3" y="5" width="26" height="22" rx="4" fill="var(--pen)" />
        <path d="M16 8v16" stroke="var(--on-pen)" strokeWidth="1.6" opacity=".55" />
        <path d="M7 13h6M7 17h6M19 13h6M19 17h4" stroke="var(--on-pen)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M19 21.5c1.8-1.6 3.6-1.6 5.5 0" stroke="var(--marker)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <span className="font-display text-2xl font-semibold leading-none text-ink">{name}</span>
    </span>
  );
}

export function SiteHeader({ t, locale, theme }: { t: Dictionary; locale: Locale; theme?: "light" | "dark" }) {
  return (
    <header className="border-b border-rule bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label={t.nav.home} className="rounded-md">
          <Logo name={t.siteName} />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle locale={locale} label={t.toggles.language} ariaLabel={t.toggles.languageLabel} />
          <ThemeToggle theme={theme} toDark={t.toggles.themeToDark} toLight={t.toggles.themeToLight} />
          <Link
            href="/learn"
            className="ms-1 hidden rounded-full bg-pen px-4 py-2 text-sm font-semibold text-on-pen transition-colors hover:bg-pen-strong sm:inline-block"
          >
            {t.nav.learn}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t border-rule">
      <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-ink-soft">{t.footer.note}</p>
    </footer>
  );
}
