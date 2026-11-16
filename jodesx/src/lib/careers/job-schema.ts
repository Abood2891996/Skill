import { z } from "zod";

z.config({ jitless: true });

export const jobTeams = ["Content Moderation", "Customer Support", "Back-Office Operations", "AI Data Operations", "Operations & Quality", "Company"] as const;
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
});

export type JobFrontMatter = z.infer<typeof jobFrontMatter>;
