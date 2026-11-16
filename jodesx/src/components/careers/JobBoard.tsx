"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface JobSummary {
  slug: string;
  title: string;
  team: string;
  type: string;
  workplace: string;
  location: string;
  summary: string;
  postedLabel: string;
}

const ALL = "All";

/** Open roles with team and contract-type filters (native radio groups for keyboard support). */
export function JobBoard({ jobs }: { jobs: JobSummary[] }) {
  const [team, setTeam] = useState(ALL);
  const [type, setType] = useState(ALL);

  const teams = useMemo(() => [ALL, ...Array.from(new Set(jobs.map((j) => j.team)))], [jobs]);
  const types = useMemo(() => [ALL, ...Array.from(new Set(jobs.map((j) => j.type)))], [jobs]);
  const visible = jobs.filter((j) => (team === ALL || j.team === team) && (type === ALL || j.type === type));

  if (jobs.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong p-10 text-center">
        <span aria-hidden="true" className="mx-auto mb-5 block size-3 bg-violet-600" />
        <p className="type-title">No open roles right now</p>
        <p className="mx-auto mt-2 max-w-md text-fg-muted">We still want to hear from careful, reliable people. Send an open application and we&rsquo;ll keep you in mind.</p>
        <Link href="/careers/apply" className="btn btn-primary mt-6">
          Send an open application
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FilterGroup legend="Team" options={teams} value={team} onChange={setTeam} />
        {types.length > 2 && <FilterGroup legend="Type" options={types} value={type} onChange={setType} />}
      </div>

      <p className="mt-8 text-sm text-fg-subtle" aria-live="polite">
        {visible.length} {visible.length === 1 ? "open role" : "open roles"}
        {team !== ALL ? ` in ${team}` : ""}
        {type !== ALL ? ` · ${type}` : ""}
      </p>

      <ul className="mt-4 grid gap-3">
        {visible.map((job) => (
          <li key={job.slug}>
            <Link
              href={`/careers/${job.slug}`}
              className="job-row group grid gap-4 rounded-[var(--radius-lg)] border border-line bg-paper p-6 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[0_20px_40px_-28px_rgb(11_18_32/0.35)] sm:p-7 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-accent-text">{job.team}</p>
                <h3 className="type-title mt-1.5 text-[1.35rem]">{job.title}</h3>
                <p className="mt-2 max-w-2xl text-fg-muted">{job.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2 text-sm" aria-label="Role details">
                  {[job.type, `${job.workplace} · ${job.location}`, `Posted ${job.postedLabel}`].map((m) => (
                    <li key={m} className="rounded-[var(--radius-sm)] border border-line px-2.5 py-1 text-fg-muted">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="inline-flex items-center gap-2 font-semibold text-fg md:justify-self-end">
                View role
                <span className="grid size-10 place-items-center rounded-full border border-line transition-all duration-300 ease-signal group-hover:border-navy-900 group-hover:bg-navy-900 group-hover:text-soft-white">
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="mt-4 rounded-[var(--radius-md)] border border-dashed border-line-strong p-6 text-fg-muted">
          No roles match these filters.{" "}
          <button
            type="button"
            className="font-semibold text-fg underline underline-offset-4"
            onClick={() => {
              setTeam(ALL);
              setType(ALL);
            }}
          >
            Show all roles
          </button>
        </p>
      )}
    </div>
  );
}

function FilterGroup({ legend, options, value, onChange }: { legend: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">Filter by {legend.toLowerCase()}</legend>
      {options.map((o) => {
        const checked = o === value;
        return (
          <label
            key={o}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
              checked ? "border-navy-900 bg-navy-900 text-soft-white" : "border-line-strong bg-paper text-fg-muted hover:border-fg-subtle hover:text-fg",
            )}
          >
            <input type="radio" name={`filter-${legend}`} value={o} checked={checked} onChange={() => onChange(o)} className="sr-only" />
            {o === ALL ? `All ${legend.toLowerCase()}s` : o}
          </label>
        );
      })}
    </fieldset>
  );
}
