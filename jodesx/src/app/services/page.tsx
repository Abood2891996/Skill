import { ChallengeSelector } from "@/components/interactive/ChallengeSelector";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceGlyph } from "@/components/services/ServiceGlyph";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { comparisonRows, engagementModels } from "@/content/pages";
import { services } from "@/content/services";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Outsourced Operations Services",
  description:
    "Compare JoDesx services — call center, customer support, content moderation, back-office and AI data operations — and find where a structured operations team fits your business.",
  path: "/services",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        title="Five services. The same operating discipline."
        lead="Each JoDesx service covers a different kind of operational work. All of them run on written scope, documented procedures, quality review and regular reporting."
      />

      <Section surface="light" labelledBy="overview-title">
        <SectionHeader id="overview-title" title="Service overview" size="md" />
        <div className="mt-10">
          <ServiceGrid />
        </div>
      </Section>

      <Section surface="paper" id="compare" labelledBy="compare-title">
        <SectionHeader
          id="compare-title"
          title="How the services compare"
          lead="What you hand over, what you get back and which decisions remain yours."
          size="md"
        />

        {/* Table for wider screens */}
        <div className="mt-12 hidden overflow-hidden rounded-[var(--radius-lg)] border border-line lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Comparison of JoDesx services</caption>
            <thead>
              <tr className="bg-navy-900 text-soft-white">
                <td className="w-[16%] p-5" />
                {services.map((s) => (
                  <th key={s.slug} scope="col" className="p-5 align-bottom">
                    <span className="surface-dark block bg-transparent">
                      <ServiceGlyph slug={s.slug} size={32} />
                    </span>
                    <a href={s.href} className="mt-3 block font-semibold hover:text-cyan-300">
                      {s.name}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-t border-line bg-paper">
                  <th scope="row" className="p-5 align-top text-sm font-semibold">
                    {row.label}
                  </th>
                  {services.map((s) => (
                    <td key={s.slug} className="p-5 align-top text-fg-muted">
                      {row.values[s.slug]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stacked comparison for small screens */}
        <div className="mt-10 grid gap-4 lg:hidden">
          {services.map((s) => (
            <article key={s.slug} className="panel p-6">
              <div className="flex items-center gap-3">
                <ServiceGlyph slug={s.slug} size={32} />
                <h3 className="type-title">
                  <a href={s.href}>{s.name}</a>
                </h3>
              </div>
              <dl className="mt-5 grid gap-4">
                {comparisonRows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-sm font-semibold">{row.label}</dt>
                    <dd className="mt-0.5 text-fg-muted">{row.values[s.slug]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section surface="light" labelledBy="problems-title">
        <SectionHeader
          id="problems-title"
          title="Start from the problem you have"
          lead="Not sure which service applies? Choose the challenge that sounds most like yours."
          size="md"
        />
        <div className="mt-12">
          <ChallengeSelector />
        </div>
      </Section>

      <Section surface="paper" labelledBy="engage-title">
        <SectionHeader id="engage-title" title="Engagement possibilities" size="md" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {engagementModels.map((m) => (
            <li key={m.title} className="panel p-7">
              <h3 className="type-title">{m.title}</h3>
              <p className="mt-3 text-fg-muted">{m.body}</p>
              <p className="mt-5 text-sm font-medium text-accent-text">{m.fit}</p>
            </li>
          ))}
        </ul>
      </Section>

      <ClosingCta
        title="Not sure where to start? Start with the operation."
        body="Describe what your team is handling today. We'll tell you which parts are ready to hand over — and which aren't yet."
        secondary={{ label: "How we work", href: "/how-we-work" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
