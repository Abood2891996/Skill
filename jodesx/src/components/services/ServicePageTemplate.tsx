import Link from "next/link";
import { OperationsBlueprint } from "@/components/interactive/OperationsBlueprint";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { services } from "@/content/services";
import type { Service } from "@/content/types";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo/structured-data";
import { ServiceGlyph } from "./ServiceGlyph";

/** Shared layout for the four service pages; all content comes from src/content/services.ts. */
export function ServicePageTemplate({ service }: { service: Service }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: service.href },
  ];
  const related = services.filter((s) => s.slug !== service.slug);
  const contactHref = `/contact?service=${service.slug}`;

  return (
    <>
      <PageHero
        title={service.hero.title}
        lead={service.hero.lead}
        crumbs={crumbs}
        aside={
          <div className="panel p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <ServiceGlyph slug={service.slug} size={44} />
              <h2 className="font-semibold">Signs this service could help</h2>
            </div>
            <ul className="mt-6 grid gap-4">
              {service.problems.map((p) => (
                <li key={p} className="flex gap-3 text-fg-muted">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 flex-none bg-cyan-400" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <ButtonLink href={contactHref}>Discuss {service.name.toLowerCase()}</ButtonLink>
        <ButtonLink href="#workflow" variant="secondary">
          See the workflow
        </ButtonLink>
      </PageHero>

      <Section surface="light" labelledBy="capabilities-title">
        <SectionHeader id="capabilities-title" title={service.capabilitiesTitle} size="md" />
        <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {service.capabilities.map((c) => (
            <li key={c.title} className="bg-surface-raised p-7">
              <h3 className="type-title text-[1.15rem]">{c.title}</h3>
              <p className="mt-2.5 text-fg-muted">{c.body}</p>
            </li>
          ))}
        </ul>
        {service.channels && (
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <h3 className="mr-2 font-semibold">{service.channels.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {service.channels.items.map((c) => (
                <li key={c} className="rounded-[var(--radius-sm)] border border-line-strong px-3 py-1 text-sm text-fg-muted">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
        {service.note && (
          <p className="mt-10 flex max-w-3xl gap-3 rounded-[var(--radius-md)] border border-line bg-surface-raised p-5 text-fg-muted">
            <span aria-hidden="true" className="mt-2 size-2 flex-none bg-violet-600" />
            {service.note}
          </p>
        )}
      </Section>

      <Section surface="dark" id="workflow" labelledBy="workflow-title">
        <SectionHeader
          id="workflow-title"
          kicker="Operations Blueprint"
          title={`How ${service.name.toLowerCase()} work flows`}
          size="md"
        />
        <div className="mt-10">
          <OperationsBlueprint initial={service.slug} lockService />
        </div>
      </Section>

      <Section surface="light" labelledBy="quality-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="quality-title" title={service.qualityTitle} size="md" />
          <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {service.quality.map((q) => (
              <li key={q.title} className="border-t-2 border-navy-900 pt-5">
                <h3 className="font-semibold">{q.title}</h3>
                <p className="mt-2 text-fg-muted">{q.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section surface="paper" labelledBy="usecases-title">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader id="usecases-title" title="Where it is typically used" size="md" />
            <ul className="mt-8 border-t border-line">
              {service.useCases.map((u) => (
                <li key={u.title} className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="font-semibold">{u.title}</h3>
                  <p className="text-fg-muted sm:max-w-[24rem] sm:text-right">{u.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="type-display-md" id="engagement-title">
              Ways to engage
            </h2>
            <ul className="mt-8 grid gap-4" aria-labelledby="engagement-title">
              {service.engagement.map((e) => (
                <li key={e.title} className="panel p-6">
                  <h3 className="font-semibold">{e.title}</h3>
                  <p className="mt-1.5 text-fg-muted">{e.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section surface="light" labelledBy="service-faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="service-faq-title" title="Common questions" size="md" />
          <FaqList faqs={service.faqs} />
        </div>
        <nav aria-labelledby="related-title" className="mt-20 border-t border-line pt-10">
          <h2 id="related-title" className="text-sm font-semibold text-fg-muted">
            Other JoDesx services
          </h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={r.href} className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-line bg-surface-raised p-4 transition-colors hover:border-line-strong">
                  <ServiceGlyph slug={r.slug} size={36} className="flex-none" />
                  <span className="font-semibold">{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <ClosingCta
        title={service.cta.title}
        body={service.cta.body}
        primary={{ label: `Discuss ${service.name.toLowerCase()}`, href: contactHref }}
        secondary={{ label: "How we work", href: "/how-we-work" }}
      />

      <JsonLd data={[serviceJsonLd(service), faqJsonLd(service.faqs), breadcrumbJsonLd(crumbs)]} />
    </>
  );
}
