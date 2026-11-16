# Posting and managing jobs

Job postings are simple text files in `src/content/jobs/`. Each file is one job. You can manage them entirely from the GitHub website — no coding tools needed.

## Post a new job (about 5 minutes)

1. On GitHub, open the repository and go to `jodesx/src/content/jobs/`.
2. Open `_TEMPLATE.md` and copy all of its text.
3. Go back to the folder and click **Add file → Create new file**.
4. Name the file after the job, using lowercase letters and hyphens, ending in `.md` — for example `quality-reviewer.md`. This name becomes the web address: `/careers/quality-reviewer`.
5. Paste the template, then fill in the fields between the two `---` lines:

| Field | What to write | Allowed values |
| --- | --- | --- |
| `title` | Job title | Any text |
| `team` | Which team the role belongs to | `Content Moderation`, `Customer Support`, `Back-Office Operations`, `AI Data Operations`, `Operations & Quality`, `Company` |
| `type` | Contract type | `Full-time`, `Part-time`, `Contract` |
| `workplace` | Where the work happens | `Remote`, `On-site`, `Hybrid` |
| `location` | City/country | e.g. `Amman, Jordan` or `Jordan` |
| `status` | Whether people can apply | `open` or `closed` |
| `posted` | Date posted | `YYYY-MM-DD`, e.g. `2026-12-01` |
| `summary` | 1–2 sentences shown on the job board | 20–220 characters |
| `languages` | Optional language requirements | Any text |

6. Write the job description below the second `---`. You can use:
   - `## Heading` for section titles (e.g. `## What you'll do`)
   - `- item` for bullet points
   - `**bold**` for emphasis
   - blank lines between paragraphs
7. Click **Commit changes**. The site rebuilds automatically (on Vercel, about a minute) and the job appears on `/careers`, in the sitemap and in Google's job search data.

## Close a job

Change `status: open` to `status: closed`. The page stays online but shows "no longer accepting applications", the role disappears from the job board, and the server refuses new applications for it.

## Remove a job completely

Delete the file. Its page will no longer exist.

## If the build fails

The site checks every job file before publishing. If a field is missing or has a value that isn't allowed, Vercel's build log names the file and the problem — for example `Job file "quality-reviewer.md" has invalid front matter: team must be one of: …`. Fix the field and commit again; the live site is not affected while the build is failing.

## Where applications go

Each application — with the CV attached — is sent to the destination configured in Vercel's environment variables (see `DEPLOYMENT.md`):

- `CAREERS_TO_EMAIL` — inbox for applications (falls back to `CONTACT_TO_EMAIL`), when using Resend email delivery; or
- `CAREERS_WEBHOOK_URL` — a webhook such as an ATS, Zapier or Make (falls back to `CONTACT_WEBHOOK_URL`).

Until one is configured, applicants are told plainly that online applications aren't connected yet, and their form is kept so nothing is lost.
