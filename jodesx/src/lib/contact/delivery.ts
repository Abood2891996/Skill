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
 * Message delivery for the inquiry form and job applications.
 *
 * One channel is used per message kind, chosen from server-only env vars:
 *   1. Webhook — JSON POST, optionally HMAC-signed
 *        inquiries:     CONTACT_WEBHOOK_URL (+ CONTACT_WEBHOOK_SECRET)
 *        applications:  CAREERS_WEBHOOK_URL, falling back to CONTACT_WEBHOOK_URL
 *   2. Email via Resend — RESEND_API_KEY + CONTACT_FROM_EMAIL and a recipient
 *        inquiries:     CONTACT_TO_EMAIL
 *        applications:  CAREERS_TO_EMAIL, falling back to CONTACT_TO_EMAIL
 * When nothing is configured the API reports `not_configured` honestly instead
 * of pretending the message was sent.
 */

export type DeliveryChannel = "webhook" | "resend";
export type MessageKind = "inquiry" | "application";

export type DeliveryResult =
  | { ok: true; channel: DeliveryChannel }
  | { ok: false; reason: "not_configured" | "delivery_failed" };

type Env = Record<string, string | undefined>;

interface ChannelConfig {
  channel: DeliveryChannel;
  webhookUrl?: string;
  webhookSecret?: string;
  to?: string;
}

function channelConfig(kind: MessageKind, env: Env): ChannelConfig | null {
  const webhookUrl = kind === "application" ? env.CAREERS_WEBHOOK_URL || env.CONTACT_WEBHOOK_URL : env.CONTACT_WEBHOOK_URL;
  const webhookSecret =
    kind === "application" && env.CAREERS_WEBHOOK_URL ? env.CAREERS_WEBHOOK_SECRET : env.CONTACT_WEBHOOK_SECRET;
  if (webhookUrl?.startsWith("https://")) return { channel: "webhook", webhookUrl, webhookSecret };

  const to = kind === "application" ? env.CAREERS_TO_EMAIL || env.CONTACT_TO_EMAIL : env.CONTACT_TO_EMAIL;
  if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && to) return { channel: "resend", to };
  return null;
}

export function resolveChannel(env: Env = process.env, kind: MessageKind = "inquiry"): DeliveryChannel | null {
  return channelConfig(kind, env)?.channel ?? null;
}

/** Short human-friendly reference, e.g. "JDX-7K2Q9P", shown to the sender and included in the message. */
export function createReference(prefix = "JDX"): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let ref = "";
  for (const b of bytes) ref += alphabet[b % alphabet.length];
  return `${prefix}-${ref}`;
}

export interface Attachment {
  filename: string;
  contentType: string;
  /** Base64-encoded file content. */
  base64: string;
}

export interface OutgoingMessage {
  kind: MessageKind;
  subject: string;
  text: string;
  replyTo: string;
  /** Structured fields for webhook consumers. Never include spam-check fields. */
  payload: Record<string, unknown>;
  attachments?: Attachment[];
}

export async function deliverMessage(
  message: OutgoingMessage,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  const config = channelConfig(message.kind, env);
  if (!config) return { ok: false, reason: "not_configured" };

  try {
    if (config.channel === "webhook") {
      const body = JSON.stringify({
        type: message.kind,
        submittedAt: new Date().toISOString(),
        ...message.payload,
        text: message.text,
        attachments: message.attachments ?? [],
      });
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (config.webhookSecret) {
        headers["X-JoDesx-Signature"] = createHmac("sha256", config.webhookSecret).update(body).digest("hex");
      }
      const res = await fetchImpl(config.webhookUrl as string, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(15000),
      });
      return res.ok ? { ok: true, channel: "webhook" } : { ok: false, reason: "delivery_failed" };
    }

    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [config.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        ...(message.attachments?.length
          ? { attachments: message.attachments.map((a) => ({ filename: a.filename, content: a.base64 })) }
          : {}),
      }),
      signal: AbortSignal.timeout(15000),
    });
    return res.ok ? { ok: true, channel: "resend" } : { ok: false, reason: "delivery_failed" };
  } catch {
    return { ok: false, reason: "delivery_failed" };
  }
}

/* ---------------------------------------------------------------------------
 * Inquiries
 * ------------------------------------------------------------------------ */

export function formatInquiryText(inquiry: ContactInquiry, reference: string): string {
  return [
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
  ].join("\n");
}

export function deliverInquiry(
  inquiry: ContactInquiry,
  reference: string,
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  return deliverMessage(
    {
      kind: "inquiry",
      subject: `New inquiry ${reference}: ${inquiry.company} — ${optionLabel(serviceOptions, inquiry.service)}`,
      text: formatInquiryText(inquiry, reference),
      replyTo: inquiry.email,
      payload: {
        reference,
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company,
        service: inquiry.service,
        teamSize: inquiry.teamSize ?? null,
        timeline: inquiry.timeline ?? null,
        contactMethod: inquiry.contactMethod,
        phone: inquiry.phone ?? null,
        requirements: inquiry.requirements,
      },
    },
    env,
    fetchImpl,
  );
}
