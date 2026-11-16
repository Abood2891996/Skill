import { InViewPlayer } from "@/components/motion/InViewPlayer";

/**
 * THE JODESX SIGNAL — hero composition.
 *
 * Four operational lanes enter from the left, pass two gates (Review, Quality)
 * and converge into one reported output. A pulse travels each lane in turn;
 * gate indicators light as the pulse passes them. Pure SVG + CSS animation,
 * paused when off-screen, static under prefers-reduced-motion.
 *
 * Geometry is computed here so timing stays in sync with path lengths.
 */

const VB = { w: 640, h: 560 };
const OUT_Y = 280;
const TURN_X = 436;
const R = 24;
const OUT_END = 588;
const GATES = [
  { x: 196, label: "Review" },
  { x: 316, label: "Quality" },
] as const;
const LANES = [
  { y: 104, label: "Content" },
  { y: 200, label: "Inquiries" },
  { y: 360, label: "Tasks" },
  { y: 456, label: "Data" },
] as const;

const CYCLE_S = 6.4; // one full rotation through all four lanes
const TRAVEL_SHARE = 0.5; // portion of the cycle a pulse spends travelling
const DASH = 70; // pulse length in normalised path units (path length = 1000)

function lanePath(y: number) {
  const dir = Math.sign(OUT_Y - y);
  const straight = TURN_X - R;
  const vertical = Math.abs(OUT_Y - y) - 2 * R;
  const arc = (Math.PI / 2) * R;
  const length = straight + arc + vertical + arc + (OUT_END - (TURN_X + R));
  const d = [
    `M0 ${y}`,
    `H${straight}`,
    `Q${TURN_X} ${y} ${TURN_X} ${y + dir * R}`,
    `V${OUT_Y - dir * R}`,
    `Q${TURN_X} ${OUT_Y} ${TURN_X + R} ${OUT_Y}`,
    `H${OUT_END}`,
  ].join(" ");
  return { d, length };
}

/** Seconds after the lane's pulse starts at which its head reaches `distance`. */
function arrival(distance: number, length: number) {
  const travel = CYCLE_S * TRAVEL_SHARE;
  return ((distance / length) * 1000 * travel) / (1000 + DASH);
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function SignalField() {
  const lanes = LANES.map((lane, i) => {
    const { d, length } = lanePath(lane.y);
    const start = (i * CYCLE_S) / LANES.length;
    return { ...lane, d, length, start };
  });

  return (
    <InViewPlayer className="signal-field relative aspect-[640/560] w-full select-none">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
        aria-hidden="true"
        focusable="false"
        style={{ ["--cycle" as string]: `${CYCLE_S}s` }}
      >
        <defs>
          <linearGradient id="lane-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--fg)" stopOpacity="0" />
            <stop offset="0.18" stopColor="var(--fg)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--fg)" stopOpacity="0.28" />
          </linearGradient>
          <radialGradient id="out-glow">
            <stop offset="0" stopColor="var(--cyan-400)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--cyan-400)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Gates */}
        {GATES.map((g) => (
          <rect
            key={g.label}
            className="signal-gate"
            x={g.x - 14}
            y={LANES[0].y - 40}
            width="28"
            height={LANES[3].y - LANES[0].y + 80}
            rx="8"
          />
        ))}

        {/* Lanes (base strokes, drawn in on load) */}
        {lanes.map((l, i) => (
          <path
            key={l.label}
            d={l.d}
            pathLength={1000}
            stroke="url(#lane-fade)"
            strokeWidth="1.5"
            className="signal-lane"
            style={{ animationDelay: `${0.15 + i * 0.12}s` }}
          />
        ))}

        {/* Output segment emphasis */}
        <circle cx={OUT_END + 12} cy={OUT_Y} r="70" fill="url(#out-glow)" className="signal-glow" />
        <path d={`M${TURN_X + R} ${OUT_Y}H${OUT_END}`} stroke="var(--cyan-400)" strokeOpacity="0.5" strokeWidth="1.5" />

        {/* Travelling pulses */}
        {lanes.map((l) => (
          <path
            key={`pulse-${l.label}`}
            d={l.d}
            pathLength={1000}
            stroke="var(--cyan-400)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${DASH} 3000`}
            className="signal-pulse"
            style={{ animationDelay: `${l.start}s` }}
          />
        ))}

        {/* Gate indicators: one per lane per gate, lit when the pulse passes */}
        {lanes.map((l) =>
          GATES.map((g) => (
            <rect
              key={`${l.label}-${g.label}`}
              x={g.x - 4}
              y={l.y - 4}
              width="8"
              height="8"
              rx="1.5"
              className="signal-indicator"
              style={{ animationDelay: `${l.start + arrival(g.x, l.length)}s` }}
            />
          )),
        )}

        {/* Output unit — echoes the signal square in the JoDesx symbol */}
        <rect x={OUT_END} y={OUT_Y - 12} width="24" height="24" rx="3" className="signal-output" />
        {lanes.map((l) => (
          <rect
            key={`out-${l.label}`}
            x={OUT_END}
            y={OUT_Y - 12}
            width="24"
            height="24"
            rx="3"
            className="signal-output-flash"
            style={{ animationDelay: `${l.start + arrival(l.length, l.length)}s` }}
          />
        ))}
      </svg>

      {/* HTML labels keep text crisp and legible at every size */}
      {LANES.map((l) => (
        <span
          key={l.label}
          className="signal-label absolute -translate-y-[calc(100%+6px)]"
          style={{ left: "8%", top: pct(l.y, VB.h) }}
        >
          {l.label}
        </span>
      ))}
      {GATES.map((g) => (
        <span
          key={g.label}
          className="signal-label absolute -translate-x-1/2 -translate-y-[calc(100%+8px)]"
          style={{ left: pct(g.x, VB.w), top: pct(LANES[0].y - 40, VB.h) }}
        >
          {g.label}
        </span>
      ))}
      <span
        className="signal-label signal-label-out absolute -translate-x-1/2 translate-y-[22px]"
        style={{ left: pct(OUT_END + 12, VB.w), top: pct(OUT_Y, VB.h) }}
      >
        Reported
      </span>
    </InViewPlayer>
  );
}
