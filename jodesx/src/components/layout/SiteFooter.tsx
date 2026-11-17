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
