import { InViewPlayer } from "@/components/motion/InViewPlayer";
import { engagementFlow } from "@/content/pages";

/**
 * Client requirement → … → Reporting, drawn as a single signal rail.
 * The rail fills once when it scrolls into view; each checkpoint lights in turn.
 */
export function EngagementRail() {
  return (
    <InViewPlayer className="engagement-rail relative">
      <ol className="relative grid gap-0 md:grid-cols-6 md:gap-6">
        <span aria-hidden="true" className="rail-track absolute left-[7px] top-2 bottom-2 w-px bg-line-strong md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto" />
        <span
          aria-hidden="true"
          className="rail-progress absolute left-[7px] top-2 bottom-2 w-px bg-cyan-400 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto"
        />
        {engagementFlow.map((step, i) => (
          <li key={step.id} className="relative pb-9 pl-10 last:pb-0 md:pb-0 md:pl-0 md:pt-10">
            <span
              aria-hidden="true"
              className="rail-node absolute left-0 top-1 size-[15px] border border-line-strong bg-navy-950 md:top-0"
              style={{ animationDelay: `${0.25 + i * 0.4}s` }}
            />
            <h3 className="font-semibold text-fg">{step.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </InViewPlayer>
  );
}
