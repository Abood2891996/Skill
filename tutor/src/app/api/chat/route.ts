/**
 * POST /api/chat — sends the student's message to the tutor and streams the reply.
 *
 * Response: plain text streamed piece by piece. If something goes wrong
 * mid-reply, the stream ends with the STATUS_MARK character followed by a
 * small JSON object, e.g. {"error":"busy"}.
 */

import { cookies, headers } from "next/headers";
import { LIMITS } from "@/config/ai";
import { findGrade, findSubject } from "@/config/catalog";
import { takeMessage } from "@/lib/rate-limit";
import { isDemoMode, pickModel, streamTutorReply, toChatError } from "@/lib/tutor/claude";
import { demoReply, streamDemo } from "@/lib/tutor/demo";
import { buildSessionContext } from "@/lib/tutor/prompt";
import { STATUS_MARK } from "@/lib/tutor/protocol";
import { chatRequestSchema, prepareHistory } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VISITOR_COOKIE = "sid";

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status });
}

/** Blocks requests sent from other websites (CSRF protection). */
function isSameOrigin(h: Headers): boolean {
  const origin = h.get("origin");
  if (!origin) return false;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const h = await headers();
  if (!isSameOrigin(h)) return jsonError("forbidden", 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid", 400);
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError("invalid", 400);
  const input = parsed.data;

  const grade = findGrade(input.grade);
  const subject = findSubject(input.subject);
  if (!grade || !subject) return jsonError("invalid", 400);

  const history = prepareHistory(input.messages);
  if (!history.ok) return jsonError(history.error, history.error === "too_long" ? 413 : 400);

  // Identify the visitor by an anonymous cookie and by IP address.
  const jar = await cookies();
  let sid = jar.get(VISITOR_COOKIE)?.value;
  if (!sid || !/^[a-f0-9-]{36}$/.test(sid)) {
    sid = crypto.randomUUID();
    jar.set(VISITOR_COOKIE, sid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();

  const limit = takeMessage([`sid:${sid}`, `ip:${ip}`], LIMITS.guestDailyMessages, LIMITS.perMinute);
  if (!limit.ok) return jsonError(limit.reason, 429);

  const demo = isDemoMode();
  const role = pickModel(input.mode);
  const sessionContext = buildSessionContext({
    grade,
    subject,
    mode: input.mode,
    uiLocale: input.uiLocale,
    course: input.course?.trim() || undefined,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (text: string) => controller.enqueue(encoder.encode(text));
      try {
        if (demo) {
          const last = history.messages[history.messages.length - 1]!.content;
          for await (const piece of streamDemo(demoReply(last, input.uiLocale))) write(piece);
        } else {
          const result = await streamTutorReply({
            role,
            sessionContext,
            messages: history.messages,
            onText: (t) => write(t.replaceAll(STATUS_MARK, "")),
            signal: request.signal,
          });
          if (result.refused) write(`${STATUS_MARK}${JSON.stringify({ error: "refused" })}`);
          // Phase 5 stores this in the database for the cost reports.
          if (result.usage) console.info("[usage]", JSON.stringify({ ...result.usage, mode: input.mode, grade: grade.id, subject: subject.id }));
        }
      } catch (err) {
        if (request.signal.aborted) return controller.close();
        console.error("[chat] tutor error", err instanceof Error ? err.message : err);
        write(`${STATUS_MARK}${JSON.stringify({ error: toChatError(err) })}`);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Remaining": String(limit.remaining),
      "X-Demo": demo ? "1" : "0",
    },
  });
}
