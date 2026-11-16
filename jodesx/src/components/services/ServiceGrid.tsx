import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/services";
import { ServiceGlyph } from "./ServiceGlyph";

/**
 * The four services as one connected surface: hairline-divided panels rather
 * than detached cards. A signal line draws across the top edge on hover.
 */
export function ServiceGrid({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line gap-px md:grid-cols-2">
      {services.map((s) => (
        <li key={s.slug} className="bg-surface-raised">
          <Link href={s.href} className="service-panel group relative flex h-full flex-col p-7 sm:p-9">
            <span aria-hidden="true" className="service-panel-line" />
            <div className="flex items-start justify-between gap-6">
              <ServiceGlyph slug={s.slug} size={56} />
              <span className="grid size-10 place-items-center rounded-full border border-line text-fg-subtle transition-all duration-300 ease-signal group-hover:border-accent group-hover:bg-accent group-hover:text-[var(--accent-contrast)]">
                <ArrowRight size={18} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-10 text-sm font-semibold text-accent-text">{s.name}</p>
            <Heading className="type-title mt-2 max-w-sm text-[1.4rem]">{s.tagline}</Heading>
            <p className="mt-3 max-w-md text-fg-muted">{s.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${s.name} includes`}>
              {s.capabilities.slice(0, 3).map((c) => (
                <li key={c.title} className="rounded-[var(--radius-sm)] border border-line px-2.5 py-1 text-sm text-fg-muted">
                  {c.title}
                </li>
              ))}
            </ul>
          </Link>
        </li>
      ))}
    </ul>
  );
}
