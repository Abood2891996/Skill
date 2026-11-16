"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ServiceGlyph } from "@/components/services/ServiceGlyph";
import { challenges } from "@/content/pages";
import { getService } from "@/content/services";
import { cn } from "@/lib/utils/cn";

/**
 * "Where is the pressure?" — visitors pick the operational challenge closest
 * to theirs and get a matching service, a short diagnosis and a first step.
 * Built on native radio inputs, so arrow-key navigation works by default.
 */
export function ChallengeSelector() {
  const name = useId();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = challenges.find((c) => c.id === selectedId) ?? null;
  const service = selected ? getService(selected.service) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
      <fieldset>
        <legend className="mb-4 text-sm font-medium text-fg-muted">Choose the challenge closest to yours</legend>
        <div className="grid gap-2">
          {challenges.map((c) => {
            const checked = c.id === selectedId;
            return (
              <label
                key={c.id}
                className={cn(
                  "challenge-option group flex cursor-pointer items-center gap-4 rounded-[var(--radius-md)] border px-4 py-3.5 transition-[border-color,background-color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
                  checked ? "border-navy-900 bg-navy-900 text-soft-white" : "border-line bg-paper hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={c.id}
                  checked={checked}
                  onChange={() => setSelectedId(c.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-4 flex-none place-items-center border transition-colors",
                    checked ? "border-cyan-400" : "border-line-strong group-hover:border-fg-subtle",
                  )}
                >
                  <span className={cn("size-2 transition-transform duration-200", checked ? "scale-100 bg-cyan-400" : "scale-0")} />
                </span>
                <span className="font-medium leading-snug">{c.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="lg:sticky lg:top-28 lg:self-start">
        {selected && service ? (
          <article key={selected.id} className="blueprint-detail surface-dark rounded-[var(--radius-lg)] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <ServiceGlyph slug={service.slug} size={44} />
              <div>
                <p className="text-sm text-fg-subtle">Recommended service</p>
                <h3 className="type-title">{service.name}</h3>
              </div>
            </div>
            <p className="mt-6 text-fg-muted">{selected.diagnosis}</p>
            <div className="mt-6 border-t border-line pt-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                <span className="size-2 bg-cyan-400" aria-hidden="true" />A sensible first step
              </p>
              <p className="mt-1.5 text-fg">{selected.firstStep}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/contact?service=${service.slug}&challenge=${selected.id}`} className="btn btn-primary">
                Discuss this challenge
              </Link>
              <Link href={service.href} className="btn btn-secondary">
                About {service.name}
              </Link>
            </div>
          </article>
        ) : (
          <div className="grid min-h-72 place-items-center rounded-[var(--radius-lg)] border border-dashed border-line-strong p-8 text-center">
            <div className="max-w-xs">
              <span aria-hidden="true" className="mx-auto mb-5 block size-3 bg-violet-600" />
              <p className="text-fg-muted">Select a challenge to see which service addresses it and where a first conversation would start.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
