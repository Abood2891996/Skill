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
| 2 | **Inquiry delivery** — webhook or Resend, and the receiving inbox | ✅ Done 17 Nov 2026: Resend (domain jodesx.com verified) → Zoho Mail inbox; end-to-end test email received | Vercel environment variables on project `skill-dawz` |
| 3 | **Public contact email** | Set by the owner in Vercel if desired | `NEXT_PUBLIC_CONTACT_EMAIL` |
| 4 | **Privacy policy legal review** | Privacy Policy completed and Terms of Use added 17 Nov 2026 (legal entity named, Jordan PDPL + GDPR rights, processors listed, 6-month applicant retention). **Still recommended: one review by a Jordanian lawyer.** Zoho alias `privacy@jodesx.com` created by the owner (17 Nov 2026). | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/content/site.ts` |
| 5 | **Engagement models** — dedicated team / managed workflow / flexible capacity; "pilot first" approach | Presented as available options | `src/content/pages.ts` → `engagementModels`; service `engagement` arrays |
| 6 | **Coverage hours & languages** | Described as "agreed during scoping" / "confirmed before committing" | `services.ts` FAQs |
| 7 | **Data-handling commitments** (e.g. NDAs, access controls you can contractually offer) | Phrased as "agreed in writing during scoping" | `pages.ts` → `generalFaqs` |
| 8 | **AI data types beyond text** | Text-based work stated as the core | `services.ts` → AI Data Operations FAQ |
| 9 | **Social profiles** (LinkedIn etc.) | None linked | Footer + Organization JSON-LD `sameAs` |
| 10 | **Job postings** | ✅ Example postings removed 17 Nov 2026 at the owner's request; careers page shows open applications until real roles are posted | `src/content/jobs/` (see POSTING-JOBS.md) |
| 11 | **Candidate-facing commitments** — structured onboarding, supervised start, rotation/break planning for moderators, growth into QA/training/leadership, "every application is read by a person" | Stated on Careers | `src/content/careers.ts` |
| 12 | **Why JoDesx commitments** — named contact per client, documentation belongs to the client, scope in writing | Stated as commitments | `src/content/why.ts` |
| 13 | **Applicant data retention period** | ✅ Decided 17 Nov 2026: **6 months** from receipt, then deleted (hired candidates → employment records). Stated in Privacy §3 and the careers FAQ; applied in Zoho by a filter + monthly clean-up (see guide A9) | `src/app/privacy/page.tsx`, `src/content/careers.ts` |

## Live setup (17 Nov 2026)

- Hosting: Vercel project **`skill-dawz`**, deploying `main` with Root Directory `jodesx`. (Projects `skill` and `skill-h11f` are earlier duplicates and can be deleted.)
- Domain: **www.jodesx.com** (canonical); `jodesx.com` redirects to it. DNS managed by Vercel.
- Registrar: **Spaceship** (spaceship.com). Expires **16 Nov 2027**. Transfer lock **on** (verified in the .com registry 17 Nov 2026); auto-renew **on** and account 2FA set by the owner (17 Nov 2026). Nameservers: ns1/ns2.vercel-dns.com — do not change.
- Email: Zoho Mail mailboxes on jodesx.com; website forms delivered through Resend.
- Security headers: securityheaders.com grade **A** (17 Nov 2026). `'unsafe-inline'` scripts accepted deliberately (see ARCHITECTURE.md); CORS limited to the site's origin.
- DMARC: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:dmarc@jodesx.com` added 17 Nov 2026, verified with MXToolbox. **To do (early–mid December 2026):** switch to `p=quarantine` after 2–4 weeks without delivery problems.

## Services update (18 Nov 2026)

Call Center added as a fifth service (inbound, outbound, technical support, telesales). Arabic and English confirmed for all services. Check with the TRC (Telecommunications Regulatory Commission) whether any licence or registration applies to JoDesx's voice operations before launching voice work.

## Security programme (18 Nov 2026)

Documents in `docs/security/` (v1.0): client-facing Security Overview, Information Security Policy (employee acknowledgement), Confidentiality Agreement (**draft — lawyer review and Arabic version required**), checklists. Decisions by the owner: company-owned laptops only; screening = identity + non-conviction certificate; client notification within 24 hours of a confirmed incident. **Do not send the Security Overview to clients until the "before sending" items in `docs/security/IMPLEMENTATION-AR.md` are complete** (security@ alias, MFA everywhere, Bitwarden, encrypted managed laptops with tested remote wipe, signed NDAs, office measures).

## Client contract (18 Nov 2026)

`docs/contracts/`: Master Services Agreement with a Statement of Work template and a Data Processing Addendum outline (**draft — lawyer review required, do not send or sign**). `LAWYER-BRIEF-AR.md` lists the questions for a Jordanian lawyer and the commercial decisions left to the owner in [brackets]. No prices in the contract; fees go in each SOW. Built by `node scripts/build-security-docs.cjs` (now covers `docs/security/` and `docs/contracts/`).

## Unresolved dependencies

- First-hand competitor review (needs network access to the 13 domains).
- Optional later: client proof (case studies, testimonials, logos) **once real and approved** — the layout leaves room for a proof section without redesign.
