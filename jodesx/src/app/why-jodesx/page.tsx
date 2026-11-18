import { Check } from "lucide-react";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { WhyVisual } from "@/components/why/WhyVisual";
import { commitments, coreReasons, inclusions, moreReasons, whyHero } from "@/content/why";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Why JoDesx",
  description:
    "Why businesses choose JoDesx for outsourced operations: a running workflow from the first week, written scope, a contained start, inspectable quality, your data in your systems, and remote or on-site teams in Jordan.",
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
        <ButtonLink href="#includes" variant="secondary">
          What every engagement includes
        </ButtonLink>
      </PageHero>

      {/* Core reasons */}
      <Section surface="light" labelledBy="core-title">
        <SectionHeader
          id="core-title"
          title="Four reasons to hand your operations to JoDesx"
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

      {/* What every engagement includes */}
      <Section surface="dark" id="includes" labelledBy="includes-title">
        <SectionHeader
          id="includes-title"
          title="What every engagement includes"
          lead="The same foundations, whichever service you choose and however large the team."
          size="md"
        />
        <div className="mt-12 overflow-hidden rounded-[var(--radius-lg)] border border-line">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">What every JoDesx engagement includes</caption>
            <tbody>
              {inclusions.map((row) => (
                <tr key={row.label} className="border-t border-line first:border-t-0">
                  <th scope="row" className="w-[34%] p-5 align-top font-semibold sm:w-[28%]">
                    <span className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-2 size-2 flex-none bg-violet-400" />
                      {row.label}
                    </span>
                  </th>
                  <td className="p-5 align-top text-fg-muted">
                    <span className="flex gap-2.5">
                      <Check size={16} className="mt-1 flex-none text-cyan-400" aria-hidden="true" />
                      {row.detail}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
