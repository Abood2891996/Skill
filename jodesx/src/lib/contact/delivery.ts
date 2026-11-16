import { createHmac, randomBytes } from "node:crypto";
import {
  contactMethodOptions,
  optionLabel,
  serviceOptions,
  teamSizeOptions,
  timelineOptions,
  type ContactInquiry,
} from "../validation/contact.ts";

/**
 * Contact inquiry delivery.
 *
 * Exactly one channel is used, chosen from server-only environment variables:
 *   1. CONTACT_WEBHOOK_URL (+ optional CONTACT_WEBHOOK_SECRET) — JSON POST
 *   2. RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL — email via Resend
 * When neither is configured the API reports `not_configured` honestly instead
 * of pretending the message was sent.
 */

export type DeliveryChannel = "webhook" | "resend";

export type DeliveryResult =
  | { ok: true; channel: DeliveryChannel }
  | { ok: false; reason: "not_configured" | "delivery_failed" };

type Env = Record<string, string | undefined>;

export function resolveChannel(env: Env = process.env): DeliveryChannel | null {
  if (env.CONTACT_WEBHOOK_URL?.startsWith("https://")) return "webhook";
  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL) return "resend";
  return null;
}

/** Short human-friendly reference, e.g. "JDX-7K2Q9P", shown to the sender and included in the message. */
export function createReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let ref = "";
  for (const b of bytes) ref += alphabet[b % alphabet.length];
  return `JDX-${ref}`;
}

export function formatInquiryText(inquiry: ContactInquiry, reference: string): string {
  const lines = [
    `New JoDesx inquiry — ${reference}`,
    "",
    `Name: ${inquiry.name}`,
    `Work email: ${inquiry.email}`,
    `Company: ${inquiry.company}`,
    `Service: ${optionLabel(serviceOptions, inquiry.service)}`,
    `Estimated team size: ${optionLabel(teamSizeOptions, inquiry.teamSize)}`,
    `Timeline: ${optionLabel(timelineOptions, inquiry.timeline)}`,
    `Preferred contact: ${optionLabel(contactMethodOptions, inquiry.contactMethod)}${inquiry.phone ? ` (${inquiry.phone})` : ""}`,
    "",
    "Requirements:",
    inquiry.requirements,
    "",
    "Consent to privacy policy: yes",
  ];
  return lines.join("\n");
}

function payload(inquiry: ContactInquiry, reference: string) {
  // Only the fields a person needs — never the honeypot or timing data.
  return {
    reference,
    submittedAt: new Date().toISOString(),
    name: inquiry.name,
    email: inquiry.email,
    company: inquiry.company,
    service: inquiry.service,
    teamSize: inquiry.teamSize ?? null,
    timeline: inquiry.timeline ?? null,
    contactMethod: inquiry.contactMethod,
    phone: inquiry.phone ?? null,
    requirements: inquiry.requirements,
    text: formatInquiryText(inquiry, reference),
  };
}

export async function deliverInquiry(
  inquiry: ContactInquiry,
  reference: string,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  const channel = resolveChannel(env);
  if (!channel) return { ok: false, reason: "not_configured" };

  try {
    if (channel === "webhook") {
      const body = JSON.stringify(payload(inquiry, reference));
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (env.CONTACT_WEBHOOK_SECRET) {
        headers["X-JoDesx-Signature"] = createHmac("sha256", env.CONTACT_WEBHOOK_SECRET).update(body).digest("hex");
      }
      const res = await fetchImpl(env.CONTACT_WEBHOOK_URL as string, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(8000),
      });
      return res.ok ? { ok: true, channel } : { ok: false, reason: "delivery_failed" };
    }

    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: inquiry.email,
        subject: `New inquiry ${reference}: ${inquiry.company} — ${optionLabel(serviceOptions, inquiry.service)}`,
        text: formatInquiryText(inquiry, reference),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? { ok: true, channel } : { ok: false, reason: "delivery_failed" };
  } catch {
    return { ok: false, reason: "delivery_failed" };
  }
}
