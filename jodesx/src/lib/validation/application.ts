import { z } from "zod";

z.config({ jitless: true });

/**
 * Job application schema — shared by the browser form and the API route.
 * The CV file is validated separately (size, extension and file signature).
 */

export const availabilityOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "2-weeks", label: "Within 2 weeks" },
  { value: "1-month", label: "Within a month" },
  { value: "later", label: "More than a month" },
] as const;

export const GENERAL_APPLICATION = "general";

/** Vercel caps request bodies at 4.5 MB; keep the file comfortably below that. */
export const MAX_CV_BYTES = 4 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,.doc,.docx";

const text = (min: number, max: number, label: string) =>
  z
    .string({ error: `Enter ${label}.` })
    .trim()
    .min(min, { error: min <= 2 ? `Enter ${label}.` : `Please write at least ${min} characters for ${label}.` })
    .max(max, { error: `Please keep ${label} under ${max} characters.` });

export const applicationSchema = z.object({
  job: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "Unknown role." }),
  fullName: text(2, 100, "your full name"),
  email: z
    .string({ error: "Enter your email address." })
    .trim()
    .toLowerCase()
    .max(254)
    .pipe(z.email({ error: "Enter a valid email address, like name@example.com." })),
  phone: z
    .string({ error: "Enter your phone number." })
    .trim()
    .regex(/^\+?[\d\s().-]{7,25}$/, { error: "Enter a phone number including the country code, like +962 7 9123 4567." }),
  location: text(2, 100, "your city and country"),
  profileUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.url({ protocol: /^https?$/, error: "Enter a full link starting with https://" }).optional()),
  languages: text(2, 200, "the languages you speak"),
  availability: z.enum(availabilityOptions.map((o) => o.value) as [string, ...string[]], {
    error: "Choose when you could start.",
  }),
  message: text(50, 3000, "a short note about yourself"),
  consent: z.literal(true, { error: "Please confirm you agree to the privacy policy." }),
  website: z.string().max(0).optional(),
  startedAt: z.number().int().positive().optional(),
});

/** Same as applicationSchema, but the "Why are you a good fit?" answer may be left empty. */
export const applicationSchemaOptionalMessage = applicationSchema.extend({
  message: z
    .string()
    .trim()
    .max(3000, { error: "Please keep a short note about yourself under 3000 characters." })
    .optional()
    .transform((v) => v ?? ""),
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type Application = z.output<typeof applicationSchema>;
export type ApplicationField = keyof ApplicationInput | "cv";

export function applicationFieldErrors(error: z.ZodError): Partial<Record<ApplicationField, string>> {
  const out: Partial<Record<ApplicationField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) out[key as ApplicationField] = issue.message;
  }
  return out;
}

const CV_TYPES: Record<string, { mime: string; magic: number[] }> = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", magic: [0x50, 0x4b, 0x03, 0x04] }, // ZIP
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2
};

/** Quick checks usable in the browser before upload. */
export function checkCvBasics(file: { name: string; size: number } | null | undefined): string | null {
  if (!file || file.size === 0) return "Attach your CV as a PDF or Word document.";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(ext in CV_TYPES)) return "Your CV must be a PDF, DOC or DOCX file.";
  if (file.size > MAX_CV_BYTES) return "Your CV must be 4 MB or smaller.";
  return null;
}

/**
 * Server-side check: the file's first bytes must match its extension, so a
 * renamed executable or script cannot pass as a CV. Returns the MIME type.
 */
export function verifyCvSignature(name: string, bytes: Uint8Array): { ok: true; mime: string } | { ok: false } {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = CV_TYPES[ext];
  if (!type || bytes.length < 4) return { ok: false };
  return type.magic.every((b, i) => bytes[i] === b) ? { ok: true, mime: type.mime } : { ok: false };
}

/** Removes path parts and unusual characters from an uploaded file name. */
export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "cv";
  const cleaned = base.replace(/[^\w.\- ]+/g, "").replace(/\s+/g, "-").slice(-120);
  return cleaned || "cv";
}
