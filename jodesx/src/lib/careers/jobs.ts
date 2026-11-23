import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { jobFrontMatter, type JobFrontMatter } from "./job-schema";
import { parseDocument, type Block } from "./markdown";

/**
 * Job postings live as Markdown files in src/content/jobs/.
 * File name (without .md) becomes the URL: /careers/<file-name>.
 * Files starting with "_" (e.g. _TEMPLATE.md) are ignored.
 */
export const JOBS_DIR = join(process.cwd(), "src/content/jobs");

export interface Job extends JobFrontMatter {
  slug: string;
  blocks: Block[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let cache: Job[] | null = null;

export function getAllJobs(): Job[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = readdirSync(JOBS_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const jobs = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    if (!SLUG.test(slug)) {
      throw new Error(`Job file "${file}": use lowercase letters, numbers and hyphens only (e.g. content-moderator.md).`);
    }
    const { data, blocks } = parseDocument(readFileSync(join(JOBS_DIR, file), "utf8"));
    const parsed = jobFrontMatter.safeParse(data);
    if (!parsed.success) {
      const problems = parsed.error.issues.map((i) => `  - ${i.message}`).join("\n");
      throw new Error(`Job file "${file}" has invalid front matter:\n${problems}`);
    }
    return { ...parsed.data, slug, blocks };
  });
  // Open roles first, newest first.
  jobs.sort((a, b) => (a.status === b.status ? b.posted.localeCompare(a.posted) : a.status === "open" ? -1 : 1));
  cache = jobs;
  return jobs;
}

/** Open roles in their original language (translations are reached from the role page). */
export function getOpenJobs(): Job[] {
  return getAllJobs().filter((j) => j.status === "open" && !j.translationOf);
}

/** The original posting a translation belongs to (or the job itself). */
export function getPrimaryJob(job: Job): Job {
  return (job.translationOf && getJob(job.translationOf)) || job;
}

/** The other-language version of a posting, if one exists. */
export function getCounterpart(job: Job): Job | undefined {
  if (job.translationOf) return getJob(job.translationOf);
  return getAllJobs().find((j) => j.translationOf === job.slug);
}

export function getJob(slug: string): Job | undefined {
  return getAllJobs().find((j) => j.slug === slug);
}

export function formatPosted(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
