import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "@fontsource/reem-kufi/500.css";
import "@fontsource/reem-kufi/600.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { dirOf } from "@/lib/i18n/dictionaries";
import { getDictionary, getTheme } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return {
    title: { default: `${t.siteName} — ${t.siteTagline}`, template: `%s — ${t.siteName}` },
    description: t.home.lead,
    robots: { index: false, follow: false }, // not public yet (phase 1)
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1714" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getDictionary();
  const theme = await getTheme();
  return (
    <html lang={locale} dir={dirOf(locale)} data-theme={theme} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteHeader t={t} locale={locale} theme={theme} />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter t={t} />
      </body>
    </html>
  );
}
