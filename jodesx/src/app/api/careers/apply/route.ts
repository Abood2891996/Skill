import { NextResponse, type NextRequest } from "next/server";
import { getJob } from "@/lib/careers/jobs";
import { createReference, deliverMessage } from "@/lib/contact/delivery";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import {
  applicationFieldErrors,
  applicationSchema,
  availabilityOptions,
  checkCvBasics,
  GENERAL_APPLICATION,
  MAX_CV_BYTES,
  safeFileName,
  verifyCvSignature,
  type Application,
} from "@/lib/validation/application";
import { MIN_FILL_TIME_MS } from "@/lib/validation/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = MAX_CV_BYTES + 64 * 1024;
const limiter = createRateLimiter({ limit: 5, windowMs: 30 * 60 * 1000 });

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

function formatText(app: Application, role: string, reference: string, cvName: string | null): string {
  const availability = availabilityOptions.find((o) => o.value === app.availability)?.label ?? app.availability;
  return [
    `New JoDesx job application — ${reference}`,
    "",
    `Role: ${role}`,
    `Name: ${app.fullName}`,
    `Email: ${app.email}`,
    `Phone: ${app.phone}`,
    `Location: ${app.location}`,
    `Languages: ${app.languages}`,
    `Available to start: ${availability}`,
    `Profile / portfolio: ${app.profileUrl ?? "Not provided"}`,
    `CV: ${cvName ? `${cvName} (attached)` : "Not provided (optional for this role)"}`,
    "",
    "About the candidate:",
    app.message,
    "",
    "Consent to privacy policy: yes",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json(403, { ok: false, code: "forbidden", message: "This request was blocked." });

  if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
    return json(415, { ok: false, code: "unsupported", message: "Unsupported request format." });
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_REQUEST_BYTES) {
    return json(413, { ok: false, code: "too_large", message: "Your CV must be 4 MB or smaller." });
  }
  if (!limiter.check(clientKey(req))) {
    return json(429, {
      ok: false,
      code: "rate_limited",
      message: "Too many applications were sent from this connection. Please try again later.",
    });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json(400, { ok: false, code: "invalid_form", message: "Your application could not be read. Please try again." });
  }

  const str = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : undefined;
  };

  // Honeypot: acknowledge silently, deliver nothing.
  if (str("website")) return json(200, { ok: true, reference: null });

  const parsed = applicationSchema.safeParse({
    job: str("job"),
    fullName: str("fullName"),
    email: str("email"),
    phone: str("phone"),
    location: str("location"),
    profileUrl: str("profileUrl"),
    languages: str("languages"),
    availability: str("availability"),
    message: str("message"),
    consent: str("consent") === "true",
    startedAt: Number(str("startedAt")) || undefined,
  });

  const cv = form.get("cv");
  const cvFile = cv instanceof File && cv.size > 0 ? cv : null;
  const jobSlug = str("job");
  const cvOptional = jobSlug !== undefined && jobSlug !== GENERAL_APPLICATION && getJob(jobSlug)?.cv === "no";
  const cvError = cvOptional && !cvFile ? null : checkCvBasics(cvFile);

  if (!parsed.success || cvError) {
    const fields = parsed.success ? {} : applicationFieldErrors(parsed.error);
    if (cvError) fields.cv = cvError;
    return json(422, { ok: false, code: "validation", message: "Some fields need attention.", fields });
  }

  const app = parsed.data;
  if (app.startedAt && Date.now() - app.startedAt < MIN_FILL_TIME_MS) {
    return json(400, { ok: false, code: "too_fast", message: "That was sent faster than expected. Please review and send again." });
  }

  // The role must exist and still be open (or be a general application).
  let roleTitle = "Open application";
  if (app.job !== GENERAL_APPLICATION) {
    const job = getJob(app.job);
    if (!job || job.status !== "open") {
      return json(410, { ok: false, code: "closed", message: "This role is no longer accepting applications." });
    }
    roleTitle = job.title;
  }

  let attachment: { filename: string; contentType: string; base64: string } | null = null;
  if (cvFile) {
    const bytes = new Uint8Array(await cvFile.arrayBuffer());
    const signature = verifyCvSignature(cvFile.name, bytes);
    if (!signature.ok) {
      return json(422, {
        ok: false,
        code: "validation",
        message: "Some fields need attention.",
        fields: { cv: "This file doesn't look like a valid PDF or Word document. Please export your CV again and re-attach it." },
      });
    }
    attachment = { filename: safeFileName(cvFile.name), contentType: signature.mime, base64: Buffer.from(bytes).toString("base64") };
  }

  const reference = createReference("APP");
  const result = await deliverMessage({
    kind: "application",
    subject: `Application ${reference}: ${roleTitle} — ${app.fullName}`,
    text: formatText(app, roleTitle, reference, attachment?.filename ?? null),
    replyTo: app.email,
    payload: {
      reference,
      role: roleTitle,
      roleSlug: app.job,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      location: app.location,
      languages: app.languages,
      availability: app.availability,
      profileUrl: app.profileUrl ?? null,
      message: app.message,
    },
    attachments: attachment ? [attachment] : [],
  });

  if (result.ok) return json(200, { ok: true, reference });
  if (result.reason === "not_configured") {
    return json(503, {
      ok: false,
      code: "not_configured",
      message: "Online applications are not connected yet, so your application was not sent.",
    });
  }
  return json(502, {
    ok: false,
    code: "delivery_failed",
    message: "Your application could not be delivered right now. Please try again in a few minutes.",
  });
}
