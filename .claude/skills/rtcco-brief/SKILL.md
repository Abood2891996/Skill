---
name: rtcco-brief
description: Structures every substantive request with the RTCCO framework (Role, Task, Context, Constraints, Output) before doing the work, and fills the Context automatically from the JoDesx project facts. Use this skill whenever the user asks for any real piece of work on JoDesx — website changes, new pages, job postings, copy, marketing posts, emails, proposals, documents, research, plans — and whenever they mention RTCCO, "the system", a brief, or a prompt. Use it even for short or vague requests (in Arabic or English), because turning them into a clear brief is the point. Skip it only for quick factual questions and one-line fixes.
---

# RTCCO brief

The owner of JoDesx asked that work follows the RTCCO system. RTCCO makes a request complete before work starts:

| | Part | Answers |
|---|---|---|
| **R** | Role | Which expert should do this? |
| **T** | Task | What exactly must be produced or changed? |
| **C** | Context | What background is needed (business, audience, what exists already)? |
| **C** | Constraints | What is forbidden or required (truthfulness, tone, language, length, brand)? |
| **O** | Output | What form does the result take (file, page, PDF, table, published change)? |

The owner is not a developer and often writes briefly, sometimes in Arabic. Your job is to do the structuring for them — never make them fill a form.

## Workflow

1. **Classify.** Quick question or tiny fix (e.g. "change this word") → just do it, no brief. Anything bigger → continue.
2. **Draft the brief silently** from the request plus what you already know:
   - **Role** — pick the most fitting expert (e.g. senior B2B copywriter, recruiter, Next.js engineer, brand designer, legal-drafting assistant). Combine roles if needed.
   - **Task** — one or two sentences, concrete and testable.
   - **Context** — read `references/jodesx-context.md` and use the facts that matter for this task. Add what the user just said. Check the codebase when the task touches the website.
   - **Constraints** — always include the standing constraints below, plus task-specific ones.
   - **Output** — the exact deliverable and where it goes (published on www.jodesx.com, a PDF, a reply, a file in `jodesx/docs/`…).
3. **Find real gaps.** A gap is information that would change the result and that you cannot infer — e.g. a job's location or contract type, a client's name, a price. Ask only those, in **one** message, at most 3 questions, with options when possible (use AskUserQuestion when available). If there are no real gaps, do not ask.
4. **Show the brief briefly** — a compact RTCCO block (5 short lines) in the user's language at the top of your reply, so they see how you understood them. For large or irreversible work (publishing, deleting, sending, spending money), wait for a "yes"; otherwise continue straight away.
5. **Do the work**, then **check it against the brief**: every Constraint respected, Output in the promised form. Report in plain language (no jargon), in the user's language.

## Standing constraints (always apply)

- **Truthfulness:** never invent clients, testimonials, statistics, certifications, awards, history, prices or promises. If something must be confirmed by the owner, say so and use neutral wording meanwhile.
- **JoDesx does not build AI models** — it provides human operations for AI teams.
- **Brand voice:** precise, calm, understated; sentence case; no “world-class / cutting-edge / seamless / best”. See `jodesx/docs/CONTENT-STRATEGY.md` and `BRAND-GUIDELINES.md` for anything visual or written.
- **Language:** reply to the owner in the language they wrote in (Arabic ↔ English). Website copy stays in US English unless asked otherwise.
- **Safety of the live site:** website changes must pass `npm run check` in `jodesx/` before they reach `main`; mention how to roll back if something is risky.
- **Privacy:** never put the owner's personal email or secrets (API keys, passwords) in files, commits or outputs.

## Brief format to show the user

Arabic:
```
الدور: …
المهمة: …
السياق: …
القيود: …
شكل النتيجة: …
```
English:
```
Role: … | Task: … | Context: … | Constraints: … | Output: …
```

Keep it short — it is a confirmation of understanding, not a document.

## Reference files

- `references/jodesx-context.md` — business facts, live setup, and where things live in the codebase. Read it for every brief that touches JoDesx.
- `assets/template-ar.md`, `assets/template-en.md` — blank templates the owner can copy when they want to write a full brief themselves. Offer them if the owner asks how to write a good request.
