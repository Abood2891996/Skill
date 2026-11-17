# JoDesx website

The marketing and inquiry website for **JoDesx** — a Jordan-based business operations company that builds and runs structured remote teams for content moderation, customer support, back-office operations and AI data operations.

Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4. Every page is statically prerendered; one server route handles the inquiry form.

## Quick start

```bash
cd jodesx
cp .env.example .env.local   # optional for local development
npm install
npm run dev                  # http://localhost:3000
```

Requires Node.js 20.9+ to build and run (22.6+ to run the unit tests, which use Node's built-in TypeScript stripping).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm test` | Unit tests for validation, rate limiting and inquiry delivery |
| `npm run check` | All of the above + build — run before every deploy |
| `npm run brand:build` | Regenerate all logo SVGs and the logo geometry module |

Browser QA (needs Playwright; a server running on port 3100 unless `BASE_URL` is set):

```bash
node qa/interactions.cjs          # 66 interaction, accessibility-behaviour and API checks
node qa/screens.cjs <outDir> /,/services 1440,390   # full-page screenshots + overflow check
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: hero with the Signal field, services, challenge selector, Operations Blueprint, principles, engagement rail, quality loop, environments, engagement models, FAQ |
| `/services` | Overview and comparison of the four services |
| `/services/content-moderation` · `/customer-support` · `/back-office` · `/ai-data-operations` | Service pages (shared template) |
| `/why-jodesx` | Ten reasons to choose JoDesx, a three-way comparison and written commitments |
| `/how-we-work` | The six-step engagement process and responsibilities |
| `/about` | Company purpose, philosophy, Jordan-based identity |
| `/contact` | Inquiry form with honest delivery states |
| `/careers` | Careers: why join, filterable job board, hiring process, FAQ |
| `/careers/<job>` | Job description and application form with CV upload |
| `/careers/apply` | Open application |
| `/privacy` | Privacy policy (draft for legal review) |

## Editing content

All copy is in typed files under `src/content/` — no component changes are needed for wording edits:

| File | Contains |
| --- | --- |
| `services.ts` | Everything on each service page, including the workflow stages shown in the Operations Blueprint |
| `pages.ts` | Home, About and How We Work copy; challenge selector entries; comparison table; engagement models; general FAQs |
| `navigation.ts` | Header and footer links |
| `why.ts` | Reasons, comparison table and commitments on the Why JoDesx page |
| `careers.ts` | Careers page copy, hiring steps and candidate FAQs |
| `jobs/*.md` | **Job postings** — one Markdown file per job (see `docs/POSTING-JOBS.md`) |
| `site.ts` | Site name, URL and public email (from environment variables) |

Copy guidelines: `docs/CONTENT-STRATEGY.md`. TypeScript will flag missing fields when you add or change content.

## Posting jobs

Add a Markdown file to `src/content/jobs/` (copy `_TEMPLATE.md`) — it can be done entirely in the GitHub web editor. Set `status: closed` to stop applications. Step-by-step guide: `docs/POSTING-JOBS.md`.

## Brand assets

Logo files are in `public/brand/` (SVG, plus PNG exports). They are **generated** from `scripts/build-brand.mjs` — change geometry there and run `npm run brand:build`, then `node scripts/export-brand-png.cjs` for PNGs. Usage rules: `docs/BRAND-GUIDELINES.md`.

## Contact form

The form validates in the browser and again on the server (`src/app/api/contact/route.ts`), with spam protection (honeypot, timing check, rate limit, same-origin check). Delivery is configured with environment variables — a webhook **or** email via Resend. Until one is configured, the form clearly tells visitors their message was not sent and helps them keep it. Setup: `docs/DEPLOYMENT.md`.

## Environment variables

See `.env.example`. Summary: `NEXT_PUBLIC_SITE_URL` (required in production), `NEXT_PUBLIC_CONTACT_EMAIL` (optional), and one delivery option — `CONTACT_WEBHOOK_URL` (+ optional `CONTACT_WEBHOOK_SECRET`) or `RESEND_API_KEY` + `CONTACT_TO_EMAIL` + `CONTACT_FROM_EMAIL`. Job applications can go elsewhere with `CAREERS_WEBHOOK_URL` / `CAREERS_TO_EMAIL`.

## Directory structure

```
src/app/          routes, API, metadata files
src/components/   brand, navigation, layout, hero, interactive, services, sections, forms, motion, ui
src/content/      all copy (typed)
src/lib/          validation, contact delivery, SEO helpers
src/styles/       tokens and global styles
public/brand/     logo assets
scripts/          brand generation
tests/  qa/       unit tests and browser QA
docs/             project documentation
```

## Documentation

| Document | Contents |
| --- | --- |
| `docs/JoDesx-Website-Guide.pdf` | **Complete illustrated guide** — Part A for the owner (no coding), Part B for developers. Source: `docs/guide/`; rebuild with `node scripts/build-guide.cjs` |
| `docs/POSTING-JOBS.md` | How to post, close and remove jobs; where applications go |
| `docs/PROJECT-STATUS.md` | Completed phases, open dependencies, **decisions needing confirmation** |
| `docs/ARCHITECTURE.md` | Technical architecture, components, form flow, quality record |
| `docs/BRAND-GUIDELINES.md` | Brand platform, logo construction, colour, type, the Signal system |
| `docs/CONTENT-STRATEGY.md` | Messaging, service positioning, copy rules, SEO intent |
| `docs/DEPLOYMENT.md` | Hosting, environment variables, production checklist |
| `docs/COMPETITOR-RESEARCH.md` | Research findings and their limits |
| `docs/SKILLS-AUDIT.md` | Claude Code Skills evaluated, installed and used |

## Deployment

Vercel (set Root Directory to `jodesx`) or any Node.js host. Full instructions: `docs/DEPLOYMENT.md`.

## Licences

Instrument Sans is licensed under the SIL Open Font License 1.1 (`src/app/fonts/OFL-LICENSE.txt`).
