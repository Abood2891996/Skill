import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { blocksToText, JobBody } from "@/components/careers/JobBody";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl, site } from "@/content/site";
import { formatPosted, getAllJobs, getJob, type Job } from "@/lib/careers/jobs";
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
  return createMetadata({ title: `${job.title} — Careers`, description: job.summary, path: `/careers/${job.slug}` });
}

const EMPLOYMENT_TYPE: Record<Job["type"], string> = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Contract: "CONTRACTOR" };

function jobPostingJsonLd(job: Job) {
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
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Jordan" } }
      : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "JO" } } }),
  };
}

export default async function JobPage({ params }: Props) {
  const job = getJob((await params).slug);
  if (!job) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: job.title, path: `/careers/${job.slug}` },
  ];
  const facts = [
    { label: "Team", value: job.team },
    { label: "Type", value: job.type },
    { label: "Workplace", value: job.workplace },
    { label: "Location", value: job.location },
    ...(job.languages ? [{ label: "Languages", value: job.languages }] : []),
    { label: "Posted", value: formatPosted(job.posted) },
  ];
  const open = job.status === "open";

  return (
    <>
      <section className="surface-dark relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-20">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
        <div className="container-site relative">
          <Breadcrumbs items={crumbs} />
          <p className="mt-10 font-semibold text-cyan-300">{job.team}</p>
          <h1 className="type-display-xl mt-3 max-w-4xl">{job.title}</h1>
          <p className="type-lead mt-6 max-w-2xl">{job.summary}</p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Role details">
            {[job.type, `${job.workplace} · ${job.location}`, ...(job.languages ? [job.languages] : [])].map((m) => (
              <li key={m} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-muted">
                {m}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            {open ? <ButtonLink href="#apply">Apply for this role</ButtonLink> : null}
            <ButtonLink href="/careers#roles" variant="secondary">
              All open roles
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="surface-light section-pad !pb-16" aria-label="Role description">
        <div className="container-site grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <article className="max-w-[68ch]">
            <JobBody blocks={job.blocks} />
          </article>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-lg)] border border-line bg-paper p-6 sm:p-7">
              <h2 className="font-semibold">Role at a glance</h2>
              <dl className="mt-5 grid gap-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-6 border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="text-sm text-fg-subtle">{f.label}</dt>
                    <dd className="text-right text-sm font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {open ? (
                <Link href="#apply" className="btn btn-primary mt-6 w-full">
                  Apply for this role
                </Link>
              ) : (
                <p className="mt-6 rounded-[var(--radius-md)] bg-surface p-4 text-sm text-fg-muted">This role is no longer accepting applications.</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="apply" className="surface-light surface-paper section-pad scroll-mt-20" aria-labelledby="apply-title">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <h2 id="apply-title" className="type-display-md">
              {open ? "Apply for this role" : "This role has closed"}
            </h2>
            <p className="mt-4 text-fg-muted">
              {open
                ? "It takes about five minutes. Every application is read by a person on our team."
                : "Thank you for your interest. Take a look at our other open roles, or send an open application."}
            </p>
            {open && (
              <ol className="mt-8 grid gap-3 text-sm text-fg-muted">
                {["Application review", "Skills assessment", "Interview", "Offer and training"].map((s, i) => (
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
              <ApplicationForm job={job.slug} roleTitle={job.title} contactEmail={site.contactEmail} />
            ) : (
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/careers#roles">See open roles</ButtonLink>
                <ButtonLink href="/careers/apply" variant="secondary">
                  Send an open application
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>

      <JsonLd data={open ? [jobPostingJsonLd(job), breadcrumbJsonLd(crumbs)] : breadcrumbJsonLd(crumbs)} />
    </>
  );
}
