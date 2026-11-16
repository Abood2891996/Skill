"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Pause, Play } from "lucide-react";
import { ServiceGlyph } from "@/components/services/ServiceGlyph";
import { services } from "@/content/services";
import type { ServiceSlug } from "@/content/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";

const STEP_MS = 3200;

interface OperationsBlueprintProps {
  /** Service shown first. */
  initial?: ServiceSlug;
  /** Hide the service tabs (used on individual service pages). */
  lockService?: boolean;
  /** Heading id of the surrounding section, for the tablist label. */
  labelledBy?: string;
}

/**
 * THE JODESX OPERATIONS BLUEPRINT
 * A conceptual, interactive view of how work moves through each service.
 * It shows process structure only — never live or simulated operational data.
 */
export function OperationsBlueprint({ initial = "customer-support", lockService = false, labelledBy }: OperationsBlueprintProps) {
  const uid = useId();
  const reducedMotion = usePrefersReducedMotion();
  const [slug, setSlug] = useState<ServiceSlug>(initial);
  const [stageIndex, setStageIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const service = services.find((s) => s.slug === slug) ?? services[0]!;
  const stages = service.workflow;
  const stage = stages[stageIndex] ?? stages[0]!;
  const playing = autoplay && !reducedMotion && inView;

  // Only advance while visible.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e?.isIntersecting ?? false), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setStageIndex((i) => (i + 1) % stages.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, stageIndex, stages.length]);

  const selectService = useCallback((next: ServiceSlug) => {
    setSlug(next);
    setStageIndex(0);
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = services.length - 1;
    const target =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    const next = services[target];
    if (!next) return;
    selectService(next.slug);
    tabRefs.current[target]?.focus();
  };

  const chooseStage = (i: number) => {
    setStageIndex(i);
    setAutoplay(false); // the visitor has taken control
  };

  const panelId = `${uid}-panel`;

  return (
    <div ref={rootRef} className="blueprint relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-navy-950">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      {/* Service selector */}
      {!lockService && (
        <div className="relative border-b border-line">
          <div
            role="tablist"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : "Choose a service"}
            className="flex snap-x overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {services.map((s, i) => {
              const selected = s.slug === slug;
              return (
                <button
                  key={s.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`${uid}-tab-${s.slug}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectService(s.slug)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "group relative flex flex-1 snap-start items-center gap-3 whitespace-nowrap px-5 py-5 text-left transition-colors md:px-6",
                    selected ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
                  )}
                >
                  <ServiceGlyph slug={s.slug} size={28} className={cn("flex-none transition-opacity", selected ? "opacity-100" : "opacity-50")} />
                  <span className="text-[0.95rem] font-semibold">{s.name}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-5 bottom-0 h-0.5 origin-left bg-cyan-400 transition-transform duration-500 ease-signal md:inset-x-6",
                      selected ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        id={panelId}
        role={lockService ? "group" : "tabpanel"}
        aria-labelledby={lockService ? undefined : `${uid}-tab-${slug}`}
        aria-label={lockService ? `${service.name} workflow` : undefined}
        className="relative p-5 sm:p-8 lg:p-10"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="max-w-xl text-fg-muted">{service.workflowIntro}</p>
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setAutoplay((a) => !a)}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
              aria-pressed={!autoplay}
            >
              {autoplay ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              {autoplay ? "Pause walkthrough" : "Play walkthrough"}
            </button>
          )}
        </div>

        {/* Stage diagram */}
        <ol key={slug} className="blueprint-stages relative mt-10 grid grid-cols-1 gap-0 md:grid-cols-5 md:gap-4">
          {stages.map((s, i) => {
            const active = i === stageIndex;
            const passed = i < stageIndex;
            return (
              <li key={s.id} className="relative pb-8 pl-16 last:pb-0 md:pb-0 md:pl-0">
                {i < stages.length - 1 && (
                  <span aria-hidden="true" className="blueprint-connector">
                    <span className="blueprint-connector-fill" data-on={i < stageIndex} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => chooseStage(i)}
                  aria-pressed={active}
                  className="group flex w-full flex-col items-start gap-0 text-left md:items-center md:text-center"
                >
                  <span
                    className={cn(
                      "blueprint-node absolute left-0 top-0 grid size-12 place-items-center rounded-[14px] border bg-navy-900 text-sm font-semibold transition-all duration-500 ease-signal md:relative md:size-14",
                      active
                        ? "border-cyan-400 text-fg shadow-[0_0_0_6px_rgb(53_214_232/0.1),0_0_30px_-4px_rgb(53_214_232/0.55)]"
                        : passed
                          ? "border-cyan-400/60 text-cyan-300"
                          : "border-line-strong text-fg-subtle group-hover:border-mist-400 group-hover:text-fg-muted",
                    )}
                  >
                    {active ? <span className="size-3 bg-violet-400" aria-hidden="true" /> : <span aria-hidden="true">{i + 1}</span>}
                  </span>
                  <span className={cn("block pt-2.5 font-semibold transition-colors md:mt-4 md:pt-0", active ? "text-fg" : "text-fg-muted")}>
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.label}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-fg-subtle md:px-1">{s.summary}</span>
                </button>

                {s.branch && (
                  <div className="mt-3 flex items-center gap-2 md:mt-5 md:flex-col md:gap-0">
                    <span aria-hidden="true" className="h-px w-5 border-t border-dashed border-violet-400/70 md:h-5 md:w-px md:border-l md:border-t-0" />
                    <span className="rounded-full border border-violet-400/50 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
                      {s.branch.label}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Detail */}
        <div className="mt-10 grid gap-6 rounded-[var(--radius-lg)] border border-line bg-navy-900/80 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr]" aria-live="polite">
          <div key={`${slug}-${stage.id}`} className="blueprint-detail">
            <p className="text-sm text-fg-subtle">
              Step {stageIndex + 1} of {stages.length}
            </p>
            <h3 className="type-title mt-2">{stage.label}</h3>
            <p className="mt-3 text-fg-muted">{stage.detail}</p>
          </div>
          <div key={`${slug}-${stage.id}-check`} className="blueprint-detail flex flex-col gap-4 border-t border-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                <span className="size-2 bg-cyan-400" aria-hidden="true" />
                Checkpoint
              </p>
              <p className="mt-1.5 text-fg-muted">{stage.checkpoint}</p>
            </div>
            {stage.branch && (
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-violet-300">
                  <span className="size-2 bg-violet-400" aria-hidden="true" />
                  {stage.branch.label}
                </p>
                <p className="mt-1.5 text-fg-muted">{stage.branch.detail}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
          <p className="text-fg-subtle">A simplified view. Each engagement is configured around your own process and tools.</p>
          {!lockService && (
            <Link href={service.href} className="link-signal">
              Explore {service.name}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
