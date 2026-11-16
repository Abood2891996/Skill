import { ClosingCta } from "@/components/sections/ClosingCta";
import { EngagementRail } from "@/components/sections/EngagementRail";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { processSteps } from "@/content/pages";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "How We Work",
  description:
    "How JoDesx sets up and runs an outsourced operation: understand, define, build, integrate, operate and improve — with written scope, documented procedures and regular reporting.",
  path: "/how-we-work",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "How we work", path: "/how-we-work" },
];

const responsibilities = {
  ours: [
    "Design the workflow and document each procedure",
    "Recruit, train and supervise the team",
    "Run quality sampling and calibration",
    "Report on volume, turnaround and quality findings",
    "Raise issues early, including ones we caused",
  ],
  yours: [
    "Share context: goals, volumes, current pain points",
    "Provide access to tools, with permissions you control",
    "Name decision-makers for policy and escalations",
    "Review reporting and take part in regular check-ins",
  ],
};

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        title="Six steps from first conversation to a working operation."
        lead="Most outsourcing problems start before the first task is done: unclear scope, undocumented processes, no agreed definition of quality. Our process is designed to settle those questions first."
      >
        <ButtonLink href="/contact">Start with step one</ButtonLink>
      </PageHero>

      <Section surface="light" labelledBy="steps-title">
        <SectionHeader id="steps-title" title="The process" size="md" className="sr-only" />
        <ol className="process-steps relative">
          {processSteps.map((step) => (
            <li key={step.number} className="process-step relative grid gap-6 border-t border-line py-12 first:border-t-0 first:pt-0 md:grid-cols-[9rem_1fr_1fr] md:gap-10 md:py-16">
              <div className="flex items-baseline gap-4 md:block">
                <span aria-hidden="true" className="type-display-lg block text-violet-600">
                  {step.number}
                </span>
              </div>
              <div>
                <h2 className="type-display-md">
                  <span className="sr-only">Step {step.number}: </span>
                  {step.title}
                </h2>
                <p className="type-lead mt-4">{step.summary}</p>
              </div>
              <div className="md:pt-2">
                <ul className="grid gap-3">
                  {step.activities.map((a) => (
                    <li key={a} className="flex gap-3 text-fg-muted">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 flex-none bg-navy-900" />
                      {a}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 flex gap-3 rounded-[var(--radius-md)] bg-surface-raised p-4 text-sm font-medium">
                  <span aria-hidden="true" className="mt-1.5 size-2 flex-none bg-violet-600" />
                  <span>
                    <span className="text-fg-subtle">Outcome: </span>
                    {step.outcome}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="deep" labelledBy="lifecycle-title">
        <SectionHeader
          id="lifecycle-title"
          title="Once running, every engagement follows the same loop."
          lead="Requirements become plans, plans become a team, and the team's work is reviewed and reported — continuously."
          size="md"
        />
        <div className="mt-12">
          <EngagementRail />
        </div>
      </Section>

      <Section surface="paper" labelledBy="roles-title">
        <SectionHeader
          id="roles-title"
          title="Clear responsibilities on both sides"
          lead="An outsourced operation works when both parties know exactly what they own."
          size="md"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="surface-dark rounded-[var(--radius-lg)] p-7 sm:p-9">
            <h3 className="type-title">What JoDesx takes on</h3>
            <ul className="mt-6 grid gap-3.5">
              {responsibilities.ours.map((r) => (
                <li key={r} className="flex gap-3 text-fg-muted">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 flex-none bg-cyan-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-7 sm:p-9">
            <h3 className="type-title">What we&rsquo;ll need from you</h3>
            <ul className="mt-6 grid gap-3.5">
              {responsibilities.yours.map((r) => (
                <li key={r} className="flex gap-3 text-fg-muted">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 flex-none bg-violet-600" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <ClosingCta
        title="Step one is a conversation."
        body="Tell us about the work you want to hand over. We'll ask the questions that shape a realistic scope."
        secondary={{ label: "Explore services", href: "/services" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
