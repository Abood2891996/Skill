import { qualityPhilosophy } from "@/content/pages";

/** The four-step quality loop, drawn as a closed circuit of units. */
export function QualityLoop() {
  const steps = qualityPhilosophy.loop;
  return (
    <ol className="quality-loop relative grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
      {steps.map((s, i) => (
        <li key={s.title} className="relative bg-surface-raised p-7">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-[6px] border border-line-strong text-xs font-semibold text-fg-muted">
              {i + 1}
            </span>
            <h3 className="type-title">{s.title}</h3>
          </div>
          <p className="mt-3 text-fg-muted">{s.body}</p>
        </li>
      ))}
      {/* Centre unit: the loop returns to the standard */}
      <li aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden size-4 -translate-x-1/2 -translate-y-1/2 bg-violet-600 ring-8 ring-soft-white sm:block" />
    </ol>
  );
}
