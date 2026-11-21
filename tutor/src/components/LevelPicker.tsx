"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type Option = { id: string; label: string };
type StageGroup = { id: string; label: string; grades: Option[] };

const STORAGE_KEY = "sanad:last-level";

/** A radio option styled as a tappable chip. Real radio inputs keep keyboard and screen-reader support. */
function Chip({ name, option, checked, onChange }: { name: string; option: Option; checked: boolean; onChange: (id: string) => void }) {
  return (
    <label
      className={`inline-flex min-h-11 cursor-pointer select-none items-center justify-center rounded-xl border px-4 py-2 text-[0.95rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pen ${
        checked ? "border-pen bg-pen text-on-pen" : "border-rule bg-sheet text-ink hover:border-pen"
      }`}
    >
      <input type="radio" name={name} value={option.id} checked={checked} onChange={() => onChange(option.id)} className="sr-only" />
      {option.label}
    </label>
  );
}

export function LevelPicker({
  t,
  stages,
  subjects,
  initialGrade,
  initialSubject,
}: {
  locale: Locale;
  t: Dictionary["picker"];
  stages: StageGroup[];
  subjects: Option[];
  initialGrade?: string;
  initialSubject?: string;
}) {
  const router = useRouter();
  const [grade, setGrade] = useState(initialGrade ?? "");
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [course, setCourse] = useState("");

  // Pre-select the student's last choice (stored only in this browser).
  useEffect(() => {
    if (initialGrade || initialSubject) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { grade?: string; subject?: string } | null;
      // Browser storage can only be read after hydration, so state is set in an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved?.grade) setGrade(saved.grade);
      if (saved?.subject) setSubject(saved.subject);
    } catch {
      /* storage unavailable: start empty */
    }
  }, [initialGrade, initialSubject]);

  const ready = Boolean(grade && subject);

  const start = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ grade, subject }));
    } catch {
      /* ignore */
    }
    const q = new URLSearchParams({ grade, subject });
    if (grade === "uni" && course.trim()) q.set("course", course.trim().slice(0, 80));
    router.push(`/learn/chat?${q}`);
  };

  return (
    <form onSubmit={start} className="mt-8 space-y-9">
      <fieldset>
        <legend className="text-lg font-semibold">{t.gradeQ}</legend>
        <div className="mt-4 space-y-5">
          {stages.map((s) => (
            <div key={s.id} role="group" aria-label={s.label}>
              <p className="mb-2 text-sm text-ink-soft">{s.label}</p>
              <div className="flex flex-wrap gap-2">
                {s.grades.map((g) => (
                  <Chip key={g.id} name="grade" option={g} checked={grade === g.id} onChange={setGrade} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {grade === "uni" && (
        <div>
          <label htmlFor="course" className="text-lg font-semibold">
            {t.courseQ}
          </label>
          <input
            id="course"
            value={course}
            maxLength={80}
            onChange={(e) => setCourse(e.target.value)}
            placeholder={t.coursePlaceholder}
            dir="auto"
            className="mt-3 block h-12 w-full rounded-xl border border-rule bg-sheet px-4 text-ink placeholder:text-ink-soft/70 focus:border-pen focus:outline-none"
          />
        </div>
      )}

      <fieldset>
        <legend className="text-lg font-semibold">{t.subjectQ}</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <Chip key={s.id} name="subject" option={s} checked={subject === s.id} onChange={setSubject} />
          ))}
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled={!ready}
          className="inline-flex h-12 items-center rounded-full bg-pen px-7 font-semibold text-on-pen transition-colors hover:bg-pen-strong disabled:cursor-not-allowed disabled:opacity-45"
        >
          {t.start}
        </button>
        {!ready && <p className="mt-2 text-sm text-ink-soft">{t.chooseFirst}</p>}
      </div>
    </form>
  );
}
