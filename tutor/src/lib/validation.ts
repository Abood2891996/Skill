/**
 * Checks everything the browser sends to /api/chat before it is used.
 * Never trust the browser: lengths, roles and ids are all verified here.
 */

import { z } from "zod";
import { LIMITS } from "../config/ai.ts";
import { MODES } from "../config/catalog.ts";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(LIMITS.maxAssistantMessageChars),
});

export const chatRequestSchema = z.object({
  grade: z.string().max(10),
  subject: z.string().max(20),
  mode: z.enum(MODES),
  uiLocale: z.enum(["ar", "en"]),
  course: z.string().max(80).optional(),
  messages: z.array(messageSchema).min(1).max(200),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatMessage = z.infer<typeof messageSchema>;

/**
 * Prepares the conversation for the model:
 * - keeps only the most recent messages (cost control),
 * - makes sure it starts with a student message and roles alternate,
 * - rejects a final student message that is too long.
 */
export function prepareHistory(messages: ChatMessage[]): { ok: true; messages: ChatMessage[] } | { ok: false; error: "too_long" | "invalid" } {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return { ok: false, error: "invalid" };
  if (last.content.length > LIMITS.maxStudentMessageChars) return { ok: false, error: "too_long" };

  // Merge accidental consecutive messages with the same role.
  const merged: ChatMessage[] = [];
  for (const m of messages) {
    const content = m.content.trim();
    if (!content) continue;
    const prev = merged[merged.length - 1];
    if (prev && prev.role === m.role) prev.content += `\n\n${content}`;
    else merged.push({ role: m.role, content });
  }

  let recent = merged.slice(-LIMITS.maxHistoryMessages);
  while (recent.length > 0 && recent[0]?.role !== "user") recent = recent.slice(1);
  if (recent.length === 0) return { ok: false, error: "invalid" };
  return { ok: true, messages: recent };
}
