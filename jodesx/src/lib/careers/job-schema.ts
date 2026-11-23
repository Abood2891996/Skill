import { z } from "zod";

z.config({ jitless: true });

export const jobTeams = ["Content Moderation", "Customer Support", "Call Center", "Back-Office Operations", "AI Data Operations", "Operations & Quality", "Company"] as const;
export const jobTypes = ["Full-time", "Part-time", "Contract"] as const;
export const workplaces = ["Remote", "On-site", "Hybrid"] as const;

/** Front-matter contract for files in src/content/jobs/. Build fails with a clear message if a post breaks it. */
export const jobFrontMatter = z.object({
  title: z.string().min(3, { error: "title is required" }),
  team: z.enum(jobTeams, { error: `team must be one of: ${jobTeams.join(", ")}` }),
  type: z.enum(jobTypes, { error: `type must be one of: ${jobTypes.join(", ")}` }),
  workplace: z.enum(workplaces, { error: `workplace must be one of: ${workplaces.join(", ")}` }),
  location: z.string().min(2, { error: "location is required" }),
  status: z.enum(["open", "closed"], { error: "status must be open or closed" }),
  posted: z.iso.date({ error: "posted must be a date like 2026-11-16" }),
  summary: z.string().min(20, { error: "summary needs at least 20 characters" }).max(220),
  languages: z.string().optional(),
  /** Two-letter country code of the work location (for search engines). Defaults to JO. */
  country: z.string().regex(/^[A-Z]{2}$/, { error: "country must be a two-letter code such as JO or SA" }).optional(),
  /** "no" makes the CV optional for this role (e.g. hands-on work where CVs are uncommon). Defaults to "yes". */
  cv: z.enum(["yes", "no"], { error: "cv must be yes or no" }).optional(),
  /** "no" makes the "Why are you a good fit?" answer optional for this role. Defaults to "yes". */
  motivation: z.enum(["yes", "no"], { error: "motivation must be yes or no" }).optional(),
  /** Language of this posting. Defaults to "en". */
  lang: z.enum(["en", "ar"], { error: "lang must be en or ar" }).optional(),
  /** For a translated posting: the file name (without .md) of the original job. */
  translationOf: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "translationOf must be the original job's file name" }).optional(),
});

export const COUNTRY_NAMES: Record<string, string> = { JO: "Jordan", SA: "Saudi Arabia", AE: "United Arab Emirates", QA: "Qatar" };

export type JobFrontMatter = z.infer<typeof jobFrontMatter>;
