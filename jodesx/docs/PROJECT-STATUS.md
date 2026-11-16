# Project status

Last updated: 16 November 2026.

## Phases

| # | Phase | Status | Notes |
| --- | --- | --- | --- |
| 1 | Repository inspection | Done | Repo contained a Cloudflare `security-audit` Skill. The website was built in `jodesx/` so that work is untouched. |
| 2 | Skills discovery | Done | 2 official Anthropic Skills installed (`frontend-design`, `webapp-testing`); repo's `security-audit` used in guidance mode. See SKILLS-AUDIT.md. |
| 3 | Competitor research | **Partial** | All 13 competitor sites were blocked by the build environment's network policy. Only search-result evidence was available; nothing was fabricated. See COMPETITOR-RESEARCH.md §5 for the follow-up. |
| 4 | Brand strategy | Done | BRAND-GUIDELINES.md §1, CONTENT-STRATEGY.md |
| 5 | Logo and identity | Done | Original Signal Mark; 12 SVG variants + PNG exports, generated from one script |
| 6 | Design system | Done | Tokens, surfaces, type roles, controls, motion |
| 7 | Architecture | Done | |
| 8 | Homepage | Done | |
| 9 | Remaining pages | Done | Services overview, 4 service pages, How we work, About, Contact, Privacy, 404 |
| 10 | Operations Blueprint | Done | |
| 11 | Conversion experience | Done | Challenge selector, contextual CTAs, pre-filled inquiry, honest form states |
| 12 | Responsive optimisation | Done | 1440 / 768 / 390 verified; zero horizontal overflow |
| 13 | SEO, security, accessibility | Done | |
| 14 | Testing | Done | See ARCHITECTURE.md §11 |
| 15 | Refinement passes | Done | Pass 1: functional/a11y/perf fixes. Pass 2: visual, copy and motion refinements |
| 16 | Documentation | Done | |

## Decisions that need your confirmation

These are business facts or authorisations the site depends on. Each has a safe default in place.

| # | Item | Current default | Where to change |
| --- | --- | --- | --- |
| 1 | **Production domain** | `https://www.jodesx.com` — confirmed (domain purchased; `jodesx.com` redirects to www in Vercel) | `NEXT_PUBLIC_SITE_URL` |
| 2 | **Inquiry delivery** — webhook or Resend, and the receiving inbox | Not configured → form reports this honestly | Environment variables (DEPLOYMENT.md) |
| 3 | **Public contact email** | Hidden | `NEXT_PUBLIC_CONTACT_EMAIL` |
| 4 | **Privacy policy legal review** — legal entity name, registered address, applicable law (e.g. Jordan's data protection law; GDPR/UK GDPR for European visitors), retention periods, list of processors (host, form provider) | Generic but accurate draft describing what the site actually does (no cookies/analytics) | `src/app/privacy/page.tsx` |
| 5 | **Engagement models** — dedicated team / managed workflow / flexible capacity; "pilot first" approach | Presented as available options | `src/content/pages.ts` → `engagementModels`; service `engagement` arrays |
| 6 | **Coverage hours & languages** | Described as "agreed during scoping" / "confirmed before committing" | `services.ts` FAQs |
| 7 | **Data-handling commitments** (e.g. NDAs, access controls you can contractually offer) | Phrased as "agreed in writing during scoping" | `pages.ts` → `generalFaqs` |
| 8 | **AI data types beyond text** | Text-based work stated as the core | `services.ts` → AI Data Operations FAQ |
| 9 | **Social profiles** (LinkedIn etc.) | None linked | Footer + Organization JSON-LD `sameAs` |
| 10 | **The four example job postings** (Content Moderator, Customer Support Specialist, Data Annotation Specialist, Back-Office Operations Assistant) are live as `status: open`. Confirm each is a real opening — or set it to `closed` — before sharing the site publicly. Confirm location ("Jordan"), contract types and languages. | Open | `src/content/jobs/*.md` |
| 11 | **Candidate-facing commitments** — structured onboarding, supervised start, rotation/break planning for moderators, growth into QA/training/leadership, "every application is read by a person" | Stated on Careers | `src/content/careers.ts` |
| 12 | **Why JoDesx commitments** — named contact per client, documentation belongs to the client, scope in writing | Stated as commitments | `src/content/why.ts` |
| 13 | **Applicant data retention period** | "No longer than necessary for recruitment" | Privacy policy §3 |

## Unresolved dependencies

- First-hand competitor review (needs network access to the 13 domains).
- An end-to-end delivery test with real credentials (logic is unit-tested with mocked webhook and Resend calls).
- Optional later: client proof (case studies, testimonials, logos) **once real and approved** — the layout leaves room for a proof section without redesign.
