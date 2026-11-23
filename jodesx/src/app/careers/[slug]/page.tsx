import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { LanguageSwitch, PreferArabic } from "@/components/careers/LanguageSwitch";
import { COUNTRY_NAMES } from "@/lib/careers/job-schema";
import { blocksToText, JobBody } from "@/components/careers/JobBody";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl, site } from "@/content/site";
import { formatPosted, getAllJobs, getCounterpart, getJob, getPrimaryJob, type Job } from "@/lib/careers/jobs";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllJobs().map((j) => ({ slug: j.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = getJob((await params).slug);
  if (!job) return {};
  const ar = job.lang === "ar";
  const meta = createMetadata({ title: `${job.title} — ${ar ? "وظائف" : "Careers"}`, description: job.summary, path: `/careers/${job.slug}` });
  const other = getCounterpart(job);
  if (other) {
    const en = ar ? other : job;
    const arJob = ar ? job : other;
    meta.alternates = {
      canonical: absoluteUrl(`/careers/${job.slug}`),
      languages: { en: absoluteUrl(`/careers/${en.slug}`), ar: absoluteUrl(`/careers/${arJob.slug}`), "x-default": absoluteUrl(`/careers/${en.slug}`) },
    };
  }
  if (ar && meta.openGraph) meta.openGraph = { ...meta.openGraph, locale: "ar_SA" };
  return meta;
}

const T = {
  en: {
    home: "Home",
    careers: "Careers",
    details: "Role details",
    apply: "Apply for this role",
    allRoles: "All open roles",
    description: "Role description",
    glance: "Role at a glance",
    closedNote: "This role is no longer accepting applications.",
    closedTitle: "This role has closed",
    applyIntro: "It takes about five minutes. Every application is read by a person on our team.",
    closedIntro: "Thank you for your interest. Take a look at our other open roles, or send an open application.",
    steps: ["Application review", "Skills assessment", "Interview", "Offer and training"],
    seeRoles: "See open roles",
    openApp: "Send an open application",
    facts: { team: "Team", type: "Type", workplace: "Workplace", location: "Location", languages: "Languages", posted: "Posted" },
    values: {} as Record<string, string>,
  },
  ar: {
    home: "الرئيسية",
    careers: "الوظائف",
    details: "تفاصيل الوظيفة",
    apply: "قدّم على الوظيفة",
    allRoles: "كل الوظائف",
    description: "وصف الوظيفة",
    glance: "الوظيفة باختصار",
    closedNote: "التقديم على هذه الوظيفة مغلق.",
    closedTitle: "التقديم مغلق",
    applyIntro: "يأخذ التقديم دقائق قليلة، ويقرأ كل طلب شخص من فريقنا.",
    closedIntro: "شكرًا لاهتمامك. اطّلع على الوظائف الأخرى المتاحة.",
    steps: ["مراجعة الطلب", "مكالمة قصيرة", "اتفاقية بسيطة", "ابدأ العمل"],
    seeRoles: "الوظائف المتاحة",
    openApp: "تقديم عام",
    facts: { team: "القسم", type: "نوع العقد", workplace: "مكان العمل", location: "الموقع", languages: "اللغات", posted: "تاريخ النشر" },
    values: {
      "AI Data Operations": "عمليات بيانات الذكاء الاصطناعي",
      "Customer Support": "دعم العملاء",
      "Call Center": "مركز الاتصال",
      "Content Moderation": "الإشراف على المحتوى",
      "Back-Office Operations": "العمليات الإدارية",
      "Operations & Quality": "العمليات والجودة",
      Company: "الشركة",
      "Full-time": "دوام كامل",
      "Part-time": "دوام جزئي",
      Contract: "عقد مستقل",
      Remote: "عن بُعد",
      "On-site": "في موقع العمل",
      Hybrid: "مختلط",
    } as Record<string, string>,
  },
};

const EMPLOYMENT_TYPE: Record<Job["type"], string> = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Contract: "CONTRACTOR" };

function jobPostingJsonLd(job: Job) {
  const country = job.country ?? "JO";
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: blocksToText(job.blocks).replace(/\n/g, "<br>"),
    datePosted: job.posted,
    employmentType: EMPLOYMENT_TYPE[job.type],
    url: absoluteUrl(`/careers/${job.slug}`),
    hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url, logo: absoluteUrl("/brand/jodesx-social-avatar.png") },
    ...(job.workplace === "Remote"
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: COUNTRY_NAMES[country] ?? country } }
      : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: country } } }),
  };
}

export default async function JobPage({ params }: Props) {
  const job = getJob((await params).slug);
  if (!job) notFound();

  const lang = job.lang ?? "en";
  const t = T[lang];
  const v = (x: string) => t.values[x] ?? x;
  const primary = getPrimaryJob(job);
  const other = getCounterpart(job);
  const crumbs = [
    { name: t.home, path: "/" },
    { name: t.careers, path: "/careers" },
    { name: job.title, path: `/careers/${job.slug}` },
  ];
  const facts = [
    { label: t.facts.team, value: v(job.team) },
    { label: t.facts.type, value: v(job.type) },
    { label: t.facts.workplace, value: v(job.workplace) },
    { label: t.facts.location, value: job.location },
    ...(job.languages ? [{ label: t.facts.languages, value: job.languages }] : []),
    { label: t.facts.posted, value: lang === "ar" ? new Date(`${job.posted}T00:00:00Z`).toLocaleDateString("ar", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC", numberingSystem: "latn" }) : formatPosted(job.posted) },
  ];
  const open = job.status === "open";

  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className={lang === "ar" ? "lang-ar" : undefined}>
      {other && lang === "en" && other.lang === "ar" ? <PreferArabic href={`/careers/${other.slug}`} /> : null}
      <section className="surface-dark relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-20">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
        <div className="container-site relative">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="font-semibold text-cyan-300">{v(job.team)}</p>
            {other ? <LanguageSwitch href={`/careers/${other.slug}`} lang={other.lang ?? "en"} label={other.lang === "ar" ? "العربية" : "English"} /> : null}
          </div>
          <h1 className="type-display-xl mt-3 max-w-4xl">{job.title}</h1>
          <p className="type-lead mt-6 max-w-2xl">{job.summary}</p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label={t.details}>
            {[v(job.type), `${v(job.workplace)} · ${job.location}`, ...(job.languages ? [job.languages] : [])].map((m) => (
              <li key={m} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-muted">
                {m}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            {open ? <ButtonLink href="#apply">{t.apply}</ButtonLink> : null}
            <ButtonLink href="/careers#roles" variant="secondary">
              {t.allRoles}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="surface-light section-pad !pb-16" aria-label={t.description}>
        <div className="container-site grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <article className="max-w-[68ch]">
            <JobBody blocks={job.blocks} />
          </article>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-lg)] border border-line bg-paper p-6 sm:p-7">
              <h2 className="font-semibold">{t.glance}</h2>
              <dl className="mt-5 grid gap-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-6 border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="text-sm text-fg-subtle">{f.label}</dt>
                    <dd className="text-end text-sm font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {open ? (
                <Link href="#apply" className="btn btn-primary mt-6 w-full">
                  {t.apply}
                </Link>
              ) : (
                <p className="mt-6 rounded-[var(--radius-md)] bg-surface p-4 text-sm text-fg-muted">{t.closedNote}</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="apply" className="surface-light surface-paper section-pad scroll-mt-20" aria-labelledby="apply-title">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <h2 id="apply-title" className="type-display-md">
              {open ? t.apply : t.closedTitle}
            </h2>
            <p className="mt-4 text-fg-muted">
              {open ? t.applyIntro : t.closedIntro}
            </p>
            {open && (
              <ol className="mt-8 grid gap-3 text-sm text-fg-muted">
                {t.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span aria-hidden="true" className="grid size-6 place-items-center rounded-[6px] border border-line-strong text-xs font-semibold">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="rounded-[var(--radius-xl)] border border-line bg-paper p-6 shadow-[0_30px_60px_-40px_rgb(11_18_32/0.35)] sm:p-10">
            {open ? (
              <ApplicationForm
                job={primary.slug}
                roleTitle={job.title}
                contactEmail={site.contactEmail}
                cvRequired={primary.cv !== "no"}
                messageRequired={primary.motivation !== "no"}
                locale={lang}
              />
            ) : (
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/careers#roles">{t.seeRoles}</ButtonLink>
                <ButtonLink href="/careers/apply" variant="secondary">
                  {t.openApp}
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>

      <JsonLd data={open && !job.translationOf ? [jobPostingJsonLd(job), breadcrumbJsonLd(crumbs)] : breadcrumbJsonLd(crumbs)} />
    </div>
  );
}
