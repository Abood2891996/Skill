import { InViewPlayer } from "@/components/motion/InViewPlayer";

/**
 * Three ways to get operational work done, drawn in the Signal vocabulary:
 * two lanes stop at a gate; the JoDesx lane clears both gates and reaches
 * the reported output.
 */
const LANES = [
  { y: 70, label: "Hiring in-house", stopAt: 150, tone: "muted" },
  { y: 150, label: "Staffing supplier", stopAt: 290, tone: "muted" },
  { y: 230, label: "JoDesx", stopAt: 0, tone: "signal" },
] as const;
const GATES = [
  { x: 170, label: "Process designed" },
  { x: 310, label: "Quality measured" },
];

export function WhyVisual() {
  return (
    <InViewPlayer className="why-visual signal-field relative aspect-[480/290] w-full select-none">
      <svg viewBox="0 0 480 290" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true" focusable="false" style={{ ["--cycle" as string]: "4.2s" }}>
        {GATES.map((g) => (
          <rect key={g.label} className="signal-gate" x={g.x - 12} y={36} width="24" height="230" rx="7" />
        ))}
        {LANES.map((l) =>
          l.tone === "muted" ? (
            <g key={l.label}>
              <path d={`M0 ${l.y}H${l.stopAt}`} stroke="var(--fg)" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 5" />
              <rect x={l.stopAt - 4} y={l.y - 4} width="8" height="8" rx="1.5" fill="var(--danger)" opacity="0.75" />
            </g>
          ) : (
            <g key={l.label}>
              <path d={`M0 ${l.y}H430`} stroke="var(--cyan-400)" strokeOpacity="0.55" strokeWidth="1.5" />
              <path d={`M0 ${l.y}H430`} pathLength={1000} stroke="var(--cyan-400)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="70 3000" className="signal-pulse" />
              {GATES.map((g) => (
                <rect key={g.label} x={g.x - 4} y={l.y - 4} width="8" height="8" rx="1.5" className="signal-indicator" style={{ animationDelay: `${(g.x / 430) * 2.1 * (1000 / 1070)}s` }} />
              ))}
              <rect x="430" y={l.y - 12} width="24" height="24" rx="3" className="signal-output" />
            </g>
          ),
        )}
      </svg>
      {LANES.map((l) => (
        <span
          key={l.label}
          className={`signal-label absolute -translate-y-[calc(100%+7px)] ${l.tone === "signal" ? "!text-cyan-300 font-semibold" : ""}`}
          style={{ left: 0, top: `${(l.y / 290) * 100}%` }}
        >
          {l.label}
        </span>
      ))}
      {GATES.map((g) => (
        <span key={g.label} className="signal-label absolute -translate-x-1/2 -translate-y-[calc(100%+6px)]" style={{ left: `${(g.x / 480) * 100}%`, top: `${(36 / 290) * 100}%` }}>
          {g.label}
        </span>
      ))}
    </InViewPlayer>
  );
}
