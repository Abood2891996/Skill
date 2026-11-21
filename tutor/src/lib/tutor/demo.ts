/**
 * الوضع التجريبي: ردود نموذجية عندما لا يوجد مفتاح Claude.
 * Demo mode: sample replies used when ANTHROPIC_API_KEY is not set, so the
 * site can be tried end to end (streaming, tables, math, quick actions)
 * without spending anything. Replies are clearly labelled as samples.
 */

import { detectLanguage } from "./language";

const AR = `**(رد نموذجي — الوضع التجريبي)**

هذا مثال على شكل ردود المدرّس. عندما يُضاف مفتاح Claude سيجاوب المدرّس على سؤالك فعلاً.

**مثال على جدول:**

| الكلمة | نوعها | علامتها |
|---|---|---|
| الطالبُ | فاعل | الضمة |
| الدرسَ | مفعول به | الفتحة |

**مثال على معادلة:** مساحة الدائرة $A = \\pi r^2$، وإذا كان نصف القطر $r = 3$:

$$
 A = \\pi \\times 3^2 = 9\\pi \\approx 28.27
$$

جرّب أنت: ما مساحة دائرة نصف قطرها $2$؟`;

const EN = `**(Sample reply — demo mode)**

This shows what the tutor's replies look like. Once the Claude key is added, the tutor will answer your actual question.

**A table:**

| Word | Part of speech | Example |
|---|---|---|
| quick | adjective | a **quick** answer |
| quickly | adverb | she answered **quickly** |

**An equation:** the area of a circle is $A = \\pi r^2$. With $r = 3$:

$$
 A = \\pi \\times 3^2 = 9\\pi \\approx 28.27
$$

Your turn: what is the area when $r = 2$?`;

export function demoReply(studentMessage: string, uiLocale: "ar" | "en"): string {
  return detectLanguage(studentMessage, uiLocale) === "ar" ? AR : EN;
}

/** Streams text in small pieces, like the real tutor does. */
export async function* streamDemo(text: string, delayMs = 18): AsyncGenerator<string> {
  const parts = text.match(/\S+\s*/g) ?? [text];
  for (const p of parts) {
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    yield p;
  }
}
