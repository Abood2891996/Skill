# Working on this repository

This repository holds the **JoDesx website** (`jodesx/`), the separate **Sanad AI tutor** project (`tutor/`,
see `tutor/README.md` and `tutor/docs/PROJECT-STATUS.md`; run `cd tutor && npm run check` before merging),
and an unrelated Cloudflare `security-audit` skill (`skills/`).

## Always use the RTCCO system
The owner asked that every substantive task follows **RTCCO** (Role, Task, Context, Constraints, Output).
For any real piece of work — website changes, pages, job postings, copy, posts, emails, documents, plans —
use the `rtcco-brief` skill (`.claude/skills/rtcco-brief/`): build the brief, fill Context from
`.claude/skills/rtcco-brief/references/jodesx-context.md`, ask only for genuine gaps (max 3 questions),
show the 5-line brief, then do the work and check it against the brief.
Skip the brief only for quick questions and one-line fixes.

## Owner
- Not a developer. Explain in plain language, one step at a time.
- Writes in Arabic or English — reply in the same language.

## Website rules
- Never invent clients, testimonials, statistics, certifications, prices or promises.
- Before anything reaches `main` (which deploys to https://www.jodesx.com): `cd jodesx && npm run check`.
- Documentation lives in `jodesx/docs/`; keep `PROJECT-STATUS.md` current and rebuild the guide PDF
  (`node jodesx/scripts/build-guide.cjs`) when something it describes changes.
