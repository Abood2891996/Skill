import Link from "next/link";
import { ArrowRight, BookOpenCheck, Globe, GraduationCap, HeartPulse, MessagesSquare, TrendingUp } from "lucide-react";
import { JobBoard, type JobSummary } from "@/components/careers/JobBoard";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { careersFaqs, careersHero, hiringSteps, reasonsToJoin, whatWeLookFor } from "@/content/careers";
import { formatPosted, getOpenJobs } from "@/lib/careers/jobs";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Careers — Jobs at JoDesx",
  description:
    "Join JoDesx in Jordan: content moderation, customer support, back-office and AI data roles with international companies, structured training and clear procedures.",
  path: "/careers",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
];

const ICONS = {
  training: GraduationCap,
  clarity: BookOpenCheck,
  feedback: MessagesSquare,
  global: Globe,
  wellbeing: HeartPulse,
  growth: TrendingUp,
} as const;

export default function CareersPage() {
  const open = getOpenJobs();
  const jobs: JobSummary[] = open.map((j) => ({
    slug: j.slug,
    title: j.title,
    team: j.team,
    type: j.type,
    workplace: j.workplace,
    location: j.location,
    summary: j.summary,
    postedLabel: formatPosted(j.posted),
  }));

  return (
    <>
      <PageHero
        crumbs={crumbs}
        title={careersHero.title}
        lead={careersHero.lead}
        aside={
          <div className="panel p-6 sm:p-7">
            <p className="flex items-center gap-2.5 text-sm text-fg-muted">
              <span aria-hidden="true" className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-cyan-400" />
              </span>
              {open.length === 0 ? "No roles open right now" : `${open.length} ${open.length === 1 ? "role" : "roles"} open now`}
            </p>
            <ul className="mt-5 grid gap-2">
              {open.slice(0, 4).map((j) => (
                <li key={j.slug}>
                  <Link href={`/careers/${j.slug}`} className="group flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-line px-4 py-3.5 transition-colors hover:border-line-strong hover:bg-slate-700/40">
                    <span>
                      <span className="block font-semibold">{j.title}</span>
                      <span className="block text-sm text-fg-subtle">
                        {j.type} · {j.workplace}
                      </span>
                    </span>
                    <ArrowRight size={18} className="flex-none text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-300" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/careers/apply" className="link-signal mt-5 text-sm">
              Send an open application
            </Link>
          </div>
        }
      >
        <ButtonLink href="#roles">See open roles</ButtonLink>
        <ButtonLink href="#life" variant="secondary">
          Why work with us
        </ButtonLink>
      </PageHero>

      <Section surface="light" id="life" labelledBy="life-title">
        <SectionHeader
          id="life-title"
          title="Work that's structured to help you succeed"
          lead="Good operational work isn't about working harder. It's about knowing exactly what's expected — and having the support to deliver it."
          size="md"
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {reasonsToJoin.map((r) => {
            const Icon = ICONS[r.icon];
            return (
              <li key={r.title} className="bg-surface-raised p-7 sm:p-8">
                <span className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-navy-900 text-cyan-400">
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="type-title mt-6">{r.title}</h3>
                <p className="mt-2.5 text-fg-muted">{r.body}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section surface="paper" id="roles" labelledBy="roles-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader id="roles-title" title="Open roles" lead="Choose a role to see the full description and apply." size="md" />
        </div>
        <div className="mt-10">
          <JobBoard jobs={jobs} />
        </div>
        <p className="mt-8 text-fg-muted">
          Don&rsquo;t see the right role?{" "}
          <Link href="/careers/apply" className="font-semibold text-fg underline underline-offset-4">
            Send an open application
          </Link>
          .
        </p>
      </Section>

      <Section surface="dark" labelledBy="look-title">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeader
            id="look-title"
            title="What we look for"
            lead="Skills can be taught. These qualities are what make people excellent at operational work."
            size="md"
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {whatWeLookFor.map((q) => (
              <li key={q.title} className="rounded-[var(--radius-lg)] border border-line bg-slate-700/30 p-6">
                <h3 className="flex items-center gap-3 font-semibold">
                  <span aria-hidden="true" className="size-2.5 bg-violet-400" />
                  {q.title}
                </h3>
                <p className="mt-2 text-fg-muted">{q.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section surface="light" labelledBy="process-title">
        <SectionHeader id="process-title" title="How hiring works" lead="Clear steps, no mystery. You'll always know where your application stands." size="md" />
        <ol className="mt-12 grid gap-0 border-l border-line-strong md:grid-cols-3 md:gap-x-8 md:gap-y-10 md:border-l-0 lg:grid-cols-6">
          {hiringSteps.map((s, i) => (
            <li key={s.title} className="relative pb-8 pl-8 last:pb-0 md:border-t md:border-line-strong md:pb-0 md:pl-0 md:pt-6">
              <span aria-hidden="true" className="absolute -left-[5px] top-1.5 size-[9px] bg-navy-900 md:-top-[5px] md:left-0" />
              <p className="text-sm font-semibold text-violet-600">Step {i + 1}</p>
              <h3 className="mt-1 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section surface="paper" labelledBy="careers-faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="careers-faq-title" title="Questions candidates ask" size="md" />
          <FaqList faqs={careersFaqs} />
        </div>
      </Section>

      <ClosingCta
        title="Ready to do work you can be proud of?"
        body="Pick a role that fits you — or tell us about yourself in an open application."
        primary={{ label: "See open roles", href: "/careers#roles" }}
        secondary={{ label: "Send an open application", href: "/careers/apply" }}
      />

      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(careersFaqs)]} />
    </>
  );
}
