import { z } from "zod";

// The site's CSP forbids eval; jitless mode stops Zod probing for it.
z.config({ jitless: true });

/**
 * Contact inquiry schema — shared by the client form (instant feedback) and
 * the API route (authoritative validation). Keep option lists here so the
 * form, the server and the delivered message always agree.
 */

export const serviceOptions = [
  { value: "content-moderation", label: "Content Moderation" },
  { value: "customer-support", label: "Customer Support" },
  { value: "call-center", label: "Call Center" },
  { value: "back-office", label: "Back-Office Operations" },
  { value: "ai-data-operations", label: "AI Data Operations" },
  { value: "not-sure", label: "Not sure yet — help me decide" },
] as const;

export const teamSizeOptions = [
  { value: "not-sure", label: "Not sure yet" },
  { value: "1-5", label: "1–5 people" },
  { value: "6-15", label: "6–15 people" },
  { value: "16-50", label: "16–50 people" },
  { value: "50-plus", label: "More than 50 people" },
] as const;

export const timelineOptions = [
  { value: "exploring", label: "Exploring options" },
  { value: "within-1-month", label: "Within a month" },
  { value: "1-3-months", label: "In 1–3 months" },
  { value: "3-plus-months", label: "In more than 3 months" },
] as const;

export const contactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "video-call", label: "Video call" },
  { value: "phone", label: "Phone" },
] as const;

type OptionValues<T extends readonly { value: string }[]> = T[number]["value"];
const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [OptionValues<T>, ...OptionValues<T>[]];

/** Minimum time (ms) between form render and submit; faster submissions are treated as automated. */
export const MIN_FILL_TIME_MS = 3000;

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `Enter ${label}.` })
    .trim()
    .min(min, { error: min <= 1 ? `Enter ${label}.` : `${capitalize(label)} needs at least ${min} characters.` })
    .max(max, { error: `${capitalize(label)} must be ${max} characters or fewer.` });

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const contactSchema = z
  .object({
    name: trimmed(2, 100, "your name"),
    email: z
      .string({ error: "Enter your work email." })
      .trim()
      .toLowerCase()
      .max(254, { error: "Email address is too long." })
      .pipe(z.email({ error: "Enter a valid email address, like name@company.com." })),
    company: trimmed(2, 120, "your company name"),
    service: z.enum(values(serviceOptions), { error: "Choose the service you're interested in." }),
    requirements: trimmed(20, 4000, "a short description of what you need"),
    teamSize: z.enum(values(teamSizeOptions)).optional(),
    timeline: z.enum(values(timelineOptions)).optional(),
    contactMethod: z.enum(values(contactMethodOptions), { error: "Choose how you'd like us to contact you." }),
    phone: z
      .string()
      .trim()
      .max(40, { error: "Phone number is too long." })
      .optional()
      .transform((v) => (v ? v : undefined)),
    consent: z.literal(true, { error: "Please confirm you agree to the privacy policy." }),
    /** Honeypot: hidden from people, often filled by bots. Must stay empty. */
    website: z.string().max(0).optional(),
    /** Epoch ms when the form was rendered (spam timing check). */
    startedAt: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contactMethod === "phone") {
      if (!data.phone || !/^\+?[\d\s().-]{7,}$/.test(data.phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Enter a phone number including the country code, like +44 20 1234 5678.",
        });
      }
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactInquiry = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Flattens Zod issues to `{ field: firstMessage }` for form display. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) {
      out[key as ContactField] = issue.message;
    }
  }
  return out;
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.com",
]);

/** True for common personal-mail domains. Used only for a gentle, non-blocking hint. */
export function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? FREE_EMAIL_DOMAINS.has(domain) : false;
}

export function optionLabel(options: readonly { value: string; label: string }[], value: string | undefined): string {
  if (!value) return "Not specified";
  return options.find((o) => o.value === value)?.label ?? value;
}
