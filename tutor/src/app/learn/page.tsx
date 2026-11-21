import type { Metadata } from "next";
import { LevelPicker } from "@/components/LevelPicker";
import { GRADES, STAGES, SUBJECTS } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return { title: t.picker.title };
}

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ grade?: string; subject?: string }> }) {
  const { locale, t } = await getDictionary();
  const sp = await searchParams;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{t.picker.title}</h1>
      <LevelPicker
        locale={locale}
        t={t.picker}
        stages={STAGES.map((s) => ({
          id: s.id,
          label: s.label[locale],
          grades: GRADES.filter((g) => g.stage === s.id).map((g) => ({ id: g.id, label: g.label[locale] })),
        }))}
        subjects={SUBJECTS.map((s) => ({ id: s.id, label: s.label[locale] }))}
        initialGrade={sp.grade}
        initialSubject={sp.subject}
      />
    </main>
  );
}
