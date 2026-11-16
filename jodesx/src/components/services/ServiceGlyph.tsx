import type { ReactNode } from "react";
import type { ServiceSlug } from "@/content/types";
import { cn } from "@/lib/utils/cn";

/**
 * Service glyphs drawn from the JoDesx Signal vocabulary:
 * lanes (lines), gates (outlined squares) and units (filled squares).
 * Colours come from CSS variables so glyphs adapt to any surface.
 * Elements with `.glyph-unit` animate on hover of a `.group` parent.
 */
export function ServiceGlyph({ slug, className, size = 48 }: { slug: ServiceSlug; className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      className={cn("service-glyph", className)}
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[slug]}
    </svg>
  );
}

const lane = "var(--fg-subtle)";
const accent = "var(--accent-text)";
const unit = "var(--signal)";

const GLYPHS: Record<ServiceSlug, ReactNode> = {
  // Three lanes enter a review gate; one is diverted down (escalation), two pass.
  "content-moderation": (
    <>
      <path d="M4 14H18M4 24H18M4 34H18" stroke={lane} strokeWidth="1.5" />
      <rect x="18.75" y="8.75" width="10.5" height="30.5" rx="1.5" stroke={accent} strokeWidth="1.5" />
      <path d="M29 14H44M29 24H44" stroke={lane} strokeWidth="1.5" />
      <path d="M29 34H35V44" stroke={unit} strokeWidth="1.5" />
      <rect className="glyph-unit" x="38" y="21" width="6" height="6" fill={unit} />
    </>
  ),
  // Two conversation lanes converge into one resolved line.
  "customer-support": (
    <>
      <path d="M4 12H14C18 12 20 14 22 18L24 22" stroke={lane} strokeWidth="1.5" />
      <path d="M4 36H14C18 36 20 34 22 30L24 26" stroke={lane} strokeWidth="1.5" />
      <path d="M24 24H44" stroke={accent} strokeWidth="1.5" />
      <rect x="20.75" y="20.75" width="6.5" height="6.5" rx="1" stroke={accent} strokeWidth="1.5" />
      <rect className="glyph-unit" x="38" y="21" width="6" height="6" fill={unit} />
    </>
  ),
  // Stacked records pass a verification column.
  "back-office": (
    <>
      <path d="M4 10H44M4 20H44M4 30H44M4 40H44" stroke={lane} strokeWidth="1.5" />
      <rect x="27.75" y="5.75" width="8.5" height="38.5" rx="1.5" stroke={accent} strokeWidth="1.5" />
      <rect x="10" y="7" width="6" height="6" fill={lane} opacity="0.5" />
      <rect x="10" y="27" width="6" height="6" fill={lane} opacity="0.5" />
      <rect className="glyph-unit" x="29" y="17" width="6" height="6" fill={unit} />
    </>
  ),
  // A field of data points; selected ones are annotated.
  "ai-data-operations": (
    <>
      {[8, 20, 32].map((y) =>
        [6, 18, 30].map((x) => (
          <rect key={`${x}-${y}`} x={x + 0.75} y={y + 0.75} width="6.5" height="6.5" rx="1" stroke={lane} strokeWidth="1.5" />
        )),
      )}
      <path d="M38 12H44M38 24H44M38 36H44" stroke={accent} strokeWidth="1.5" />
      <rect x="18" y="20" width="8" height="8" rx="1" fill={accent} />
      <rect className="glyph-unit" x="31" y="9" width="6" height="6" fill={unit} />
    </>
  ),
};
