import { InViewPlayer } from "@/components/motion/InViewPlayer";

/**
 * How a JoDesx engagement comes together, drawn in the Signal vocabulary:
 * scope, team and quality each pass the "documented" and "reviewed" gates and
 * converge into one reported result. Describes JoDesx only — no comparisons.
 */
const OUT = { x: 430, y: 150 };
const TURN = 380;
const R = 24;
const LANES = [
  { y: 70, label: "Scope", delay: 0 },
  { y: 150, label: "Team", delay: 1.4 },
  { y: 230, label: "Quality", delay: 2.8 },
] as const;
const GATES = [
  { x: 170, label: "Documented" },
  { x: 300, label: "Reviewed" },
];
const CYCLE = 4.2;
const TRAVEL = CYCLE * 0.5;

function lane(y: number) {
  if (y === OUT.y) return { d: `M0 ${y}H${OUT.x}`, length: OUT.x };
  const dir = Math.sign(OUT.y - y);
  const vertical = Math.abs(OUT.y - y) - 2 * R;
  const arc = (Math.PI / 2) * R;
  return {
    d: `M0 ${y}H${TURN - R}Q${TURN} ${y} ${TURN} ${y + dir * R}V${OUT.y - dir * R}Q${TURN} ${OUT.y} ${TURN + R} ${OUT.y}H${OUT.x}`,
    length: TURN - R + arc + vertical + arc + (OUT.x - TURN - R),
  };
}

/** Seconds after a pulse starts at which it reaches horizontal distance `x` (gates sit on the straight part). */
const arrival = (x: number, length: number) => ((x / length) * 1000 * TRAVEL) / 1070;

export function WhyVisual() {
  return (
    <InViewPlayer className="why-visual signal-field relative aspect-[480/290] w-full select-none">
      <svg
        viewBox="0 0 480 290"
        className="absolute inset-0 h-full w-full"
        fill="none"
        aria-hidden="true"
        focusable="false"
        style={{ ["--cycle" as string]: `${CYCLE}s` }}
      >
        {GATES.map((g) => (
          <rect key={g.label} className="signal-gate" x={g.x - 12} y={36} width="24" height="230" rx="7" />
        ))}
        {LANES.map((l) => {
          const { d, length } = lane(l.y);
          return (
            <g key={l.label}>
              <path d={d} stroke="var(--fg)" strokeOpacity="0.28" strokeWidth="1.5" />
              <path
                d={d}
                pathLength={1000}
                stroke="var(--cyan-400)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="70 3000"
                className="signal-pulse"
                style={{ animationDelay: `${l.delay}s` }}
              />
              {GATES.map((g) => (
                <rect
                  key={g.label}
                  x={g.x - 4}
                  y={l.y - 4}
                  width="8"
                  height="8"
                  rx="1.5"
                  className="signal-indicator"
                  style={{ animationDelay: `${l.delay + arrival(g.x, length)}s` }}
                />
              ))}
            </g>
          );
        })}
        <path d={`M${TURN + R} ${OUT.y}H${OUT.x}`} stroke="var(--cyan-400)" strokeOpacity="0.6" strokeWidth="1.5" />
        <rect x={OUT.x} y={OUT.y - 12} width="24" height="24" rx="3" className="signal-output" />
      </svg>
      {LANES.map((l) => (
        <span key={l.label} className="signal-label absolute -translate-y-[calc(100%+7px)]" style={{ left: 0, top: `${(l.y / 290) * 100}%` }}>
          {l.label}
        </span>
      ))}
      {GATES.map((g) => (
        <span
          key={g.label}
          className="signal-label absolute -translate-x-1/2 -translate-y-[calc(100%+6px)]"
          style={{ left: `${(g.x / 480) * 100}%`, top: `${(36 / 290) * 100}%` }}
        >
          {g.label}
        </span>
      ))}
      <span
        className="signal-label signal-label-out absolute -translate-x-1/2 translate-y-[20px]"
        style={{ left: `${((OUT.x + 12) / 480) * 100}%`, top: `${(OUT.y / 290) * 100}%` }}
      >
        Reported
      </span>
    </InViewPlayer>
  );
}
