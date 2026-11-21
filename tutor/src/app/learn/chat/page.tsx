import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TutorChat } from "@/components/TutorChat";
import { findGrade, findSubject } from "@/config/catalog";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return { title: t.nav.learn };
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string; subject?: string; course?: string }>;
}) {
  const sp = await searchParams;
  const grade = findGrade(sp.grade);
  const subject = findSubject(sp.subject);
  if (!grade || !subject) redirect("/learn");

  const { locale } = await getDictionary();
  const course = grade.id === "uni" ? sp.course?.slice(0, 80) : undefined;

  return (
    <TutorChat
      locale={locale}
      gradeId={grade.id}
      subjectId={subject.id}
      gradeLabel={grade.label[locale]}
      subjectLabel={subject.label[locale]}
      course={course}
    />
  );
}
