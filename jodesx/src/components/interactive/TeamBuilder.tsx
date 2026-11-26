"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ServiceGlyph } from "@/components/services/ServiceGlyph";
import { services } from "@/content/services";
import type { ServiceSlug } from "@/content/types";
import { teamHours, teamLanguages, teamSizes, teamWhere } from "@/lib/team-builder";
import { cn } from "@/lib/utils/cn";

type Option = { value: string; label: string };

function Choice({ legend, name, options, value, onChange }: { legend: string; name: string; options: readonly Option[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-fg-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = o.value === value;
          return (
            <label
              key={o.value}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-[border-color,background-color,color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
                checked ? "border-navy-900 bg-navy-900 text-soft-white" : "border-line bg-paper text-fg-muted hover:border-line-strong hover:text-fg",
              )}
            >
              <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * "Build your team": visitors choose a service, languages, hours, location and
 * size, and see the team take shape — then send the outline to the contact form.
 * Illustrative only: no prices, no timings, no promises beyond the site's copy.
 */
export function TeamBuilder() {
  const id = useId();
  const [service, setService] = useState<ServiceSlug>("customer-support");
  const [lang, setLang] = useState<string>("ar-en");
  const [hours, setHours] = useState<string>("business");
  const [where, setWhere] = useState<string>("remote");
  const [size, setSize] = useState<string>("6-15");

  const chosen = services.find((s) => s.slug === service)!;
  const sizeOption = teamSizes.find((s) => s.value === size)!;
  const units = sizeOption.units;
  const leads = Math.max(1, Math.ceil(units / 12));
  const key = `${service}-${size}`;
  const label = (list: readonly Option[], v: string) => list.find((o) => o.value === v)?.label ?? "";
  const href = `/contact?service=${service}&team=${size}&lang=${lang}&hours=${hours}&where=${where}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div className="grid content-start gap-7">
        <Choice legend="1. What should the team handle?" name={`${id}-service`} options={services.map((s) => ({ value: s.slug, label: s.name }))} value={service} onChange={(v) => setService(v as ServiceSlug)} />
        <Choice legend="2. In which languages?" name={`${id}-lang`} options={teamLanguages} value={lang} onChange={setLang} />
        <Choice legend="3. Which hours?" name={`${id}-hours`} options={teamHours} value={hours} onChange={setHours} />
        <Choice legend="4. Where should they work?" name={`${id}-where`} options={teamWhere} value={where} onChange={setWhere} />
        <Choice legend="5. Roughly how many people?" name={`${id}-size`} options={teamSizes} value={size} onChange={setSize} />
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <article className="surface-dark team-board rounded-[var(--radius-lg)] p-6 sm:p-8" aria-live="polite">
          <div className="flex items-center gap-4">
            <ServiceGlyph slug={chosen.slug} size={44} />
            <div>
              <p className="text-sm text-fg-subtle">Your team outline</p>
              <h3 className="type-title">{chosen.name}</h3>
            </div>
          </div>

          <div key={key} className="team-grid mt-7" aria-hidden="true">
            {Array.from({ length: leads }, (_, i) => (
              <span key={`l${i}`} className="team-unit team-unit--lead" style={{ animationDelay: `${i * 40}ms` }} />
            ))}
            {Array.from({ length: units }, (_, i) => (
              <span key={i} className="team-unit" style={{ animationDelay: `${(i + leads) * 28}ms` }} />
            ))}
            {size === "50-plus" ? <span className="team-more">+</span> : null}
          </div>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg-subtle">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="team-unit team-unit--lead team-unit--legend" /> Team lead: supervision and quality review
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="team-unit team-unit--legend" /> Team member
            </span>
          </p>

          <dl className="mt-7 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
            {[
              ["Languages", label(teamLanguages, lang)],
              ["Hours", label(teamHours, hours)],
              ["Location", label(teamWhere, where)],
              ["Team size", sizeOption.label],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-fg-subtle">{k}</dt>
                <dd className="font-medium text-fg">{v}</dd>
              </div>
            ))}
          </dl>

          <ol className="mt-7 grid gap-2 border-t border-line pt-6 text-sm text-fg-muted">
            {["A scoping conversation about your work", "Scope and procedures agreed in writing", "Team selected, trained and supervised, with regular reporting"].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span aria-hidden="true" className="grid size-6 flex-none place-items-center rounded-[6px] border border-line-strong text-xs font-semibold text-fg">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={href} className="btn btn-primary">
              Send this outline to JoDesx
            </Link>
            <Link href={chosen.href} className="btn btn-secondary">
              About {chosen.name}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
