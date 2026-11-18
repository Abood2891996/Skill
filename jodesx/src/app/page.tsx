import { SignalField } from "@/components/hero/SignalField";
import { ChallengeSelector } from "@/components/interactive/ChallengeSelector";
import { OperationsBlueprint } from "@/components/interactive/OperationsBlueprint";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { EngagementRail } from "@/components/sections/EngagementRail";
import { QualityLoop } from "@/components/sections/QualityLoop";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { engagementModels, environments, generalFaqs, home, qualityPhilosophy } from "@/content/pages";
import { coreReasons } from "@/content/why";
import { getService } from "@/content/services";
import { createMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "JoDesx — Outsourced operations teams for content moderation, support, back-office and AI data",
  description:
    "JoDesx is a Jordan-based business process outsourcing company. We build and run structured teams, remote or on-site in Jordan, for content moderation, customer support, back-office operations and AI data annotation.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section aria-labelledby="hero-title" className="surface-dark relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)] pb-16 sm:pb-20 lg:pt-[calc(var(--header-h)+4rem)]">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
        <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          <div className="hero-copy">
            <h1 id="hero-title" className="type-display-xl max-w-[12ch]">
              {home.hero.title}
            </h1>
            <p className="type-lead mt-7 max-w-xl">{home.hero.lead}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact">{home.hero.primaryCta}</ButtonLink>
              <ButtonLink href="/how-we-work" variant="secondary">
                {home.hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[38rem] lg:mr-[-2rem] lg:max-w-none">
            <SignalField />
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <Section surface="light" labelledBy="services-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <SectionHeader id="services-title" title={home.intro.title} />
          <p className="type-lead max-w-lg lg:justify-self-end">{home.intro.body}</p>
        </div>
        <div className="mt-14">
          <ServiceGrid />
        </div>
      </Section>

      {/* ---------- Challenge selector ---------- */}
      <Section surface="paper" id="challenge" labelledBy="challenge-title">
        <SectionHeader
          id="challenge-title"
          title="Where is the pressure in your operation?"
          lead="Start from the problem, not the service list. Pick what sounds most familiar and see where a JoDesx engagement would begin."
        />
        <div className="mt-12">
          <ChallengeSelector />
        </div>
      </Section>

      {/* ---------- Operations Blueprint ---------- */}
      <Section surface="dark" labelledBy="blueprint-title" className="overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            id="blueprint-title"
            kicker="The Operations Blueprint"
            title="See how work moves through each service."
            lead="Every service follows a defined path with a checkpoint at each stage. Choose a service, then step through it."
          />
        </div>
        <div className="mt-12">
          <OperationsBlueprint labelledBy="blueprint-title" />
        </div>
      </Section>

      {/* ---------- Why JoDesx ---------- */}
      <Section surface="light" labelledBy="why-title">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              id="why-title"
              title="Operations designed, staffed and run with you."
              lead="We design how the work runs, build the team around it and stay accountable for quality and reporting."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/why-jodesx">All the reasons to choose JoDesx</ButtonLink>
            </div>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line">
            {coreReasons.map((r) => (
              <li key={r.id} className="bg-surface-raised p-7 sm:p-8">
                <h3 className="type-title">{r.title}</h3>
                <p className="mt-3 text-fg-muted">{r.body}</p>
                <p className="mt-5 flex items-center gap-2.5 text-sm font-semibold text-accent-text">
                  <span aria-hidden="true" className="size-2 flex-none bg-violet-600" />
                  {r.outcome}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------- Engagement flow ---------- */}
      <Section surface="deep" labelledBy="flow-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            id="flow-title"
            title="From your requirement to a reported result."
          />
          <TextLink href="/how-we-work">The six-step process in detail</TextLink>
        </div>
        <div className="mt-14">
          <EngagementRail />
        </div>
      </Section>

      {/* ---------- Quality ---------- */}
      <Section surface="light" labelledBy="quality-title">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeader id="quality-title" title={qualityPhilosophy.title} lead={qualityPhilosophy.body} />
          <QualityLoop />
        </div>
      </Section>

      {/* ---------- Environments ---------- */}
      <Section surface="paper" labelledBy="env-title">
        <SectionHeader
          id="env-title"
          title="Built for businesses where operations carry real weight."
        />
        <ul className="mt-12 border-t border-line">
          {environments.map((env) => (
            <li key={env.title} className="grid gap-3 border-b border-line py-6 md:grid-cols-[1.1fr_1.2fr_1.4fr] md:items-center md:gap-8">
              <h3 className="type-title">{env.title}</h3>
              <p className="text-fg-muted">{env.body}</p>
              <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Relevant services">
                {env.services.map((slug) => {
                  const s = getService(slug);
                  return (
                    <li key={slug}>
                      <a href={s.href} className="inline-flex rounded-[var(--radius-sm)] border border-line px-2.5 py-1 text-sm text-fg-muted transition-colors hover:border-fg-subtle hover:text-fg">
                        {s.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- Engagement models ---------- */}
      <Section surface="light" labelledBy="models-title">
        <SectionHeader
          id="models-title"
          title="Choose the structure that suits the work."
          lead="Most engagements begin with a contained scope and grow once the operation is proven."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {engagementModels.map((m) => (
            <li key={m.title} className="panel flex flex-col border-t-2 border-t-navy-900 p-7">
              <h3 className="type-title">{m.title}</h3>
              <p className="mt-3 text-fg-muted">{m.body}</p>
              <p className="mt-auto pt-6 text-sm font-medium text-accent-text">{m.fit}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section surface="paper" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="faq-title" title="Questions worth asking before you outsource." size="md" />
          <FaqList faqs={generalFaqs} />
        </div>
      </Section>

      <ClosingCta
        title={home.closing.title}
        body={home.closing.body}
        secondary={{ label: "Compare services", href: "/services" }}
      />

      <JsonLd data={faqJsonLd(generalFaqs)} />
    </>
  );
}
