import { NextResponse, type NextRequest } from "next/server";
import { createReference, deliverInquiry } from "@/lib/contact/delivery";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { contactSchema, fieldErrors, MIN_FILL_TIME_MS } from "@/lib/validation/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

/** Rejects cross-site posts: the Origin (when sent) must match this host. */
function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/** Reads the body as text, aborting once it exceeds `limit` bytes (returns null). */
async function readCapped(req: NextRequest, limit: number): Promise<string | null> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return json(403, { ok: false, code: "forbidden", message: "This request was blocked." });
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json(415, { ok: false, code: "unsupported", message: "Unsupported request format." });
  }

  if (!limiter.check(clientKey(req))) {
    return json(429, {
      ok: false,
      code: "rate_limited",
      message: "Too many inquiries were sent from this connection. Please wait a few minutes and try again.",
    });
  }

  const tooLarge = () =>
    json(413, { ok: false, code: "too_large", message: "The inquiry is too long. Please shorten it and try again." });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLarge();
  const raw = await readCapped(req, MAX_BODY_BYTES);
  if (raw === null) return tooLarge();

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, code: "invalid_json", message: "The inquiry could not be read." });
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    // A filled honeypot is a bot: acknowledge without delivering, revealing nothing.
    const honeypot = (data as { website?: unknown } | null)?.website;
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return json(200, { ok: true, reference: null });
    }
    return json(422, {
      ok: false,
      code: "validation",
      message: "Some fields need attention.",
      fields: fieldErrors(parsed.error),
    });
  }

  const inquiry = parsed.data;
  if (inquiry.startedAt && Date.now() - inquiry.startedAt < MIN_FILL_TIME_MS) {
    return json(400, {
      ok: false,
      code: "too_fast",
      message: "That was sent faster than expected. Please review your details and send again.",
    });
  }

  const reference = createReference();
  const result = await deliverInquiry(inquiry, reference);

  if (result.ok) {
    return json(200, { ok: true, reference });
  }

  if (result.reason === "not_configured") {
    return json(503, {
      ok: false,
      code: "not_configured",
      message: "Online inquiries are not connected yet, so your message was not sent.",
    });
  }

  return json(502, {
    ok: false,
    code: "delivery_failed",
    message: "Your inquiry could not be delivered right now. Please try again in a few minutes.",
  });
}
