/**
 * المراحل والصفوف والمواد (حسب نظام التعليم في الكويت).
 * Stages, grades and subjects. In phase 2 this moves to the database so the
 * admin can edit it without code; until then, edit this file.
 *
 * Kuwait: primary = grades 1–5, intermediate = 6–9, secondary = 10–12.
 */

import type { Locale } from "@/lib/i18n/dictionaries";

type Label = Record<Locale, string>;

export type StageId = "primary" | "intermediate" | "secondary" | "university";

export type Grade = {
  id: string;
  stage: StageId;
  label: Label;
  /** Short description for the tutor: who the student is. Written in English for the model. */
  forModel: string;
  /** Rough age, so the tutor can pitch the language. */
  age: string;
};

export type Subject = {
  id: "arabic" | "english";
  label: Label;
};

export const STAGES: { id: StageId; label: Label }[] = [
  { id: "primary", label: { ar: "ابتدائي", en: "Primary" } },
  { id: "intermediate", label: { ar: "متوسط", en: "Intermediate" } },
  { id: "secondary", label: { ar: "ثانوي", en: "Secondary" } },
  { id: "university", label: { ar: "جامعي", en: "University" } },
];

const AR_ORDINALS = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر", "الحادي عشر", "الثاني عشر"];

function stageOf(n: number): StageId {
  if (n <= 5) return "primary";
  if (n <= 9) return "intermediate";
  return "secondary";
}

export const GRADES: Grade[] = [
  ...Array.from({ length: 12 }, (_, i): Grade => {
    const n = i + 1;
    return {
      id: `g${n}`,
      stage: stageOf(n),
      label: { ar: `الصف ${AR_ORDINALS[i]}`, en: `Grade ${n}` },
      forModel: `Grade ${n} student (${stageOf(n)} stage, Kuwaiti school system)`,
      age: `${n + 5}–${n + 6}`,
    };
  }),
  {
    id: "uni",
    stage: "university",
    label: { ar: "جامعي", en: "University" },
    forModel: "University student",
    age: "18+",
  },
];

export const SUBJECTS: Subject[] = [
  { id: "arabic", label: { ar: "اللغة العربية", en: "Arabic" } },
  { id: "english", label: { ar: "اللغة الإنجليزية", en: "English" } },
];

export function findGrade(id: string | undefined | null): Grade | undefined {
  return GRADES.find((g) => g.id === id);
}

export function findSubject(id: string | undefined | null): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export const MODES = ["lesson", "quick", "homework", "review", "exam"] as const;
export type Mode = (typeof MODES)[number];
