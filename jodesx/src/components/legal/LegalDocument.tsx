import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { site } from "@/content/site";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalDocumentProps {
  title: string;
  path: string;
  lastUpdated: string;
  /** Plain-language overview shown above the full text. */
  summary?: ReactNode;
  sections: LegalSection[];
}

/**
 * The registered company name, shown on its own right-aligned line (it is Arabic
 * inside English text; inline placement breaks the reading order when it wraps).
 */
export function LegalEntityName() {
  return (
    <span lang="ar" dir="rtl" className="legal-entity">
      {site.legal.name}
    </span>
  );
}

/** Shared layout for legal pages: dark header, section index and numbered sections. */
export function LegalDocument({ title, path, lastUpdated, summary, sections }: LegalDocumentProps) {
  return (
    <>
      <div className="surface-dark pt-[calc(var(--header-h)+3.5rem)] pb-14">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: title, path },
            ]}
          />
          <h1 className="type-display-lg mt-10">{title}</h1>
          <p className="mt-4 text-fg-muted">Last updated: {lastUpdated}</p>
        </div>
      </div>
      <div className="surface-light section-pad !pt-14">
        <div className="container-site grid gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label={`${title} sections`} className="hidden lg:block">
            <ol className="sticky top-28 grid gap-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-fg-muted hover:text-fg">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="legal-prose max-w-[68ch]">
            {summary && (
              <div className="legal-summary mb-12 rounded-[var(--radius-lg)] border border-line bg-paper p-6 sm:p-7">{summary}</div>
            )}
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>
                  {i + 1}. {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
