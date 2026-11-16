import { HORIZONTAL_LOCKUP, SYMBOL_PATHS } from "./logo-geometry";

type Tone = "dark" | "light";

const TONES: Record<Tone, { j: string; d: string; signal: string; word: string }> = {
  // "dark" = for use on dark backgrounds
  dark: { j: "#35D6E8", d: "#F4F7FB", signal: "#786BFF", word: "#F4F7FB" },
  light: { j: "#0E8FA0", d: "#0B1220", signal: "#5B4FE0", word: "#0B1220" },
};

interface LogoProps {
  tone?: Tone;
  /** Height in px; width follows the lockup proportions. */
  height?: number;
  className?: string;
  /** Decorative instances (next to visible text "JoDesx") should pass true. */
  decorative?: boolean;
}

function SymbolShapes({ tone }: { tone: Tone }) {
  const c = TONES[tone];
  const s = SYMBOL_PATHS.signal;
  return (
    <>
      <path fill={c.j} d={SYMBOL_PATHS.j} />
      <path fill={c.d} d={SYMBOL_PATHS.d} />
      <rect fill={c.signal} x={s.x} y={s.y} width={s.size} height={s.size} />
    </>
  );
}

/** Horizontal lockup (symbol + outlined wordmark). */
export function Logo({ tone = "dark", height = 28, className, decorative = false }: LogoProps) {
  const { width, height: h, symbolTransform, wordTransform, wordPath } = HORIZONTAL_LOCKUP;
  return (
    <svg
      viewBox={`0 0 ${width} ${h}`}
      height={height}
      width={(height * width) / h}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "JoDesx"}
      focusable="false"
    >
      <g transform={symbolTransform}>
        <SymbolShapes tone={tone} />
      </g>
      <path fill={TONES[tone].word} transform={wordTransform} d={wordPath} />
    </svg>
  );
}

/** Symbol only, on the 48-unit construction grid. */
export function LogoSymbol({ tone = "dark", size = 32, className }: { tone?: Tone; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <SymbolShapes tone={tone} />
    </svg>
  );
}
