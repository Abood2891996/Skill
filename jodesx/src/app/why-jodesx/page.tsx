import { Check, Minus } from "lucide-react";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { WhyVisual } from "@/components/why/WhyVisual";
import { commitments, comparison, coreReasons, moreReasons, whyHero } from "@/content/why";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Why JoDesx",
  description:
    "Why businesses outsource operations to JoDesx: a running workflow instead of a headcount, written scope, low-risk pilots, inspectable quality, your data in your systems, and a time zone that works for you.",
  path: "/why-jodesx",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Why JoDesx", path: "/why-jodesx" },
];

export default function WhyPage() {
  return (
    <>
      <PageHero crumbs={crumbs} title={whyHero.title} lead={whyHero.lead} aside={<WhyVisual />}>
        <ButtonLink href="/contact">Start an inquiry</ButtonLink>
        <ButtonLink href="#compare" variant="secondary">
          See the comparison
        </ButtonLink>
      </PageHero>

      {/* Core reasons */}
      <Section surface="light" labelledBy="core-title">
        <SectionHeader
          id="core-title"
          title="Four reasons clients hand their operations to us"
          lead="These are the differences you feel in the first month — in your inbox, in your calendar and in your results."
          size="md"
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {coreReasons.map((r, i) => (
            <li key={r.id} className="reason-card group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-paper p-7 sm:p-9">
              <span aria-hidden="true" className="reason-index">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="type-display-md relative max-w-md pr-20 text-[1.75rem] sm:pr-24 sm:text-[2rem]">{r.title}</h3>
              <p className="relative mt-4 max-w-lg text-fg-muted">{r.body}</p>
              <p className="relative mt-auto flex items-center gap-3 pt-7 font-semibold text-fg">
                <span aria-hidden="true" className="size-2.5 flex-none bg-violet-600" />
                <span>
                  <span className="sr-only">What this means for you: </span>
                  {r.outcome}
                </span>
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* More reasons */}
      <Section surface="paper" labelledBy="more-title">
        <SectionHeader id="more-title" title="And six more that matter every day" size="md" />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {moreReasons.map((r) => (
            <li key={r.id} className="flex flex-col bg-surface-raised p-7">
              <h3 className="type-title">{r.title}</h3>
              <p className="mt-3 text-fg-muted">{r.body}</p>
              <p className="mt-auto flex items-start gap-2.5 pt-6 text-sm font-semibold text-accent-text">
                <Check size={16} className="mt-0.5 flex-none" aria-hidden="true" />
                {r.outcome}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Comparison */}
      <Section surface="dark" id="compare" labelledBy="compare-title">
        <SectionHeader
          id="compare-title"
          title="Three ways to get the work done"
          lead="Hiring in-house, using a staffing supplier, or working with an operations partner. Here is how they compare where it counts."
          size="md"
        />

        <div className="mt-12 hidden overflow-hidden rounded-[var(--radius-lg)] border border-line lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Comparison of hiring in-house, a staffing supplier and JoDesx</caption>
            <thead>
              <tr>
                <td className="w-[22%] p-5" />
                <th scope="col" className="p-5 text-sm font-semibold text-fg-muted">Hiring in-house</th>
                <th scope="col" className="p-5 text-sm font-semibold text-fg-muted">Staffing supplier</th>
                <th scope="col" className="compare-highlight p-5">
                  <span className="flex items-center gap-2 font-semibold text-cyan-300">
                    <span aria-hidden="true" className="size-2.5 bg-violet-400" />
                    JoDesx
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <th scope="row" className="p-5 align-top font-semibold">{row.label}</th>
                  <td className="p-5 align-top text-fg-subtle">
                    <span className="flex gap-2.5">
                      <Minus size={16} className="mt-1 flex-none" aria-hidden="true" />
                      {row.inHouse}
                    </span>
                  </td>
                  <td className="p-5 align-top text-fg-subtle">
                    <span className="flex gap-2.5">
                      <Minus size={16} className="mt-1 flex-none" aria-hidden="true" />
                      {row.supplier}
                    </span>
                  </td>
                  <td className="compare-highlight p-5 align-top text-fg">
                    <span className="flex gap-2.5">
                      <Check size={16} className="mt-1 flex-none text-cyan-400" aria-hidden="true" />
                      {row.jodesx}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-4 lg:hidden">
          {comparison.map((row) => (
            <article key={row.label} className="rounded-[var(--radius-lg)] border border-line p-5">
              <h3 className="font-semibold">{row.label}</h3>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="text-fg-subtle">Hiring in-house</dt>
                  <dd className="text-fg-muted">{row.inHouse}</dd>
                </div>
                <div>
                  <dt className="text-fg-subtle">Staffing supplier</dt>
                  <dd className="text-fg-muted">{row.supplier}</dd>
                </div>
                <div className="rounded-[var(--radius-md)] border border-cyan-400/40 bg-cyan-400/5 p-3">
                  <dt className="font-semibold text-cyan-300">JoDesx</dt>
                  <dd className="text-fg">{row.jodesx}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Section>

      {/* Commitments */}
      <Section surface="light" labelledBy="commit-title">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            id="commit-title"
            title="Our commitments to you"
            lead="Simple promises, written down — so you can hold us to them."
            size="md"
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {commitments.map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-line bg-paper p-5 font-medium">
                <span aria-hidden="true" className="grid size-6 flex-none place-items-center rounded-full bg-navy-900 text-cyan-400">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <ClosingCta
        title="See what a structured operation looks like for your business."
        body="Tell us what you need to hand over. We'll show you how JoDesx would run it — scope, team, workflow and reporting."
        secondary={{ label: "How we work", href: "/how-we-work" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
