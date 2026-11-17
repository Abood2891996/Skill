import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { footerNav } from "@/content/navigation";
import { site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="surface-dark surface-deep relative border-t border-line">
      <div className="container-site py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="JoDesx home" className="-m-2 inline-block rounded-md p-2">
              <Logo height={28} decorative />
            </Link>
            <p className="mt-6 text-fg-muted">
              Structured teams, remote or on-site in Jordan, for content moderation, customer support, back-office and AI data operations.
            </p>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener me"
              className="mt-6 inline-flex items-center gap-2.5 rounded-[var(--radius-md)] border border-line-strong px-3.5 py-2 text-sm font-medium text-fg transition-colors hover:border-fg-subtle"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              Follow JoDesx on LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="mt-4 flex items-center gap-2 text-sm text-fg-subtle">
              <span aria-hidden="true" className="size-1.5 bg-cyan-400" />
              Based in {site.country}. Working with businesses internationally.
            </p>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} className="link-signal mt-6 text-sm">
                {site.contactEmail}
              </a>
            )}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-fg">{group.title}</h2>
                <ul className="mt-4 grid gap-3">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[0.95rem] text-fg-muted transition-colors hover:text-fg">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} JoDesx. All rights reserved.</p>
          <p>{site.positioning}</p>
        </div>
      </div>
    </footer>
  );
}
