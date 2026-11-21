/**
 * Detects whether a piece of text is mainly Arabic or English.
 * Used for demo replies and for the wording of quick-action buttons;
 * the real tutor detects language itself (see prompt.ts).
 */

const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LATIN = /[A-Za-z]/g;

export function detectLanguage(text: string, fallback: "ar" | "en" = "ar"): "ar" | "en" {
  const arabic = text.match(ARABIC)?.length ?? 0;
  const latin = text.match(LATIN)?.length ?? 0;
  if (arabic === 0 && latin === 0) return fallback;
  // Arabic speakers often mix in English terms, so a message that is
  // at least 30% Arabic letters counts as Arabic.
  return arabic / (arabic + latin) >= 0.3 ? "ar" : "en";
}
