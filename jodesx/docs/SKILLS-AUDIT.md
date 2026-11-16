# Skills audit

Audit date: 16 November 2026. This records which Claude Code Skills were inspected, found, selected, rejected and used while building the JoDesx website, and why.

## 1. Method

1. **Inventory** — listed every Skill available to the session: user-level (`~/.claude/skills`), synced account Skills, plugin Skills, and the Skill shipped inside this repository (`skills/security-audit`).
2. **Read, not skim** — read each candidate's `SKILL.md` in full (not just its name or description) before judging relevance.
3. **External search** — searched for additional Skills relevant to premium web design, brand identity, accessibility, SEO, CRO and browser QA (web search + the account's Skill search).
4. **Security inspection** — for any external Skill: verified the source, read all instructions, and read every executable script for network access, credential access or destructive commands before installing.
5. **Install** only where a Skill added real expertise not already covered; verify installation on disk.

## 2. Environment constraints (stated plainly)

- The account Skill search (`SearchSkills`) returned **no results** for design, branding, accessibility, SEO, Next.js or logo keywords.
- `api.github.com` was blocked by the session's network policy, but **`git clone` of `github.com/anthropics/skills` succeeded** (commit `e4bb5d960d87`, 16 Nov 2026), so the official Anthropic Skills repository was inspected directly.
- Community Skill registries surfaced by web search (skills.sh, tessl.io, playbooks.com, and various mirrors) were **not installed**: they are third-party mirrors of the same official Skills or unvetted copies, and the official source was available.

## 3. Skills already available

| Skill | Source | Relevant? | Decision |
| --- | --- | --- | --- |
| `security-audit` | This repository (`skills/security-audit`, Cloudflare-authored, MIT) | **Yes** — security phase | **Used** in *guidance mode* for a focused review of the contact API (see §6). Full-audit mode was not run: its own rules reserve that for explicit full-audit requests and require an OS-enforced sandbox for executing target code. |
| `artifact-design` | Built-in | Partial | Not used. Designed for claude.ai Artifact pages, not a Next.js codebase. |
| `dataviz` | Built-in | No | Not used. The site contains no data charts (deliberately: no fabricated metrics). |
| `run` | Built-in | Partial | Not needed; server lifecycle handled directly with `next start`. |
| `code-review`, `simplify` | Built-in | Partial | Not invoked; equivalent review was done through the test and audit passes below. |
| `skill-creator`, `docx`, `pptx`, `xlsx`, `pdf`, `docs`, `google-workspace`, `morning`, `import-memory`, `ai-english-engine-architect`, `computer-use`, `chrome-browser`, `built-in-browser`, `artifact-emulator`, `deep-research` | Account / built-in | No | Not relevant to building this website. `deep-research` was considered for competitor research but competitor sites were unreachable (see COMPETITOR-RESEARCH.md). |
| `session-start-hook` | User-level | No | Not relevant. |

## 4. Official Anthropic Skills inspected (github.com/anthropics/skills)

| Skill | Purpose | Decision | Reason |
| --- | --- | --- | --- |
| **`frontend-design`** | Distinctive, non-templated visual design; plan → review → build → critique; copy guidance | **Installed & used** | Directly addresses the brief's central risk ("do not produce a generic template"). Prose only, no scripts. |
| **`webapp-testing`** | Playwright-based testing of local web apps | **Installed & used** | Matches the browser-QA requirement. One helper script (`with_server.py`) inspected: uses `subprocess` to start local servers and `socket` to probe `localhost` only — no external network, no credential access. |
| `brand-guidelines` | Applies **Anthropic's** brand colors/typography | Rejected | Would impose another company's identity — the opposite of what JoDesx needs. |
| `theme-factory` | Pre-made themes for artifacts | Rejected | Generic themes conflict with the bespoke JoDesx palette. |
| `canvas-design` | Static poster/art generation (raster) | Rejected | The logo must be clean editable vector SVG; raster art direction not needed. |
| `web-artifacts-builder` | Bundles React artifacts for claude.ai | Rejected | Targets claude.ai artifacts, not a production Next.js site; bundles shadcn tarball not needed. |
| `algorithmic-art`, `slack-gif-creator`, `internal-comms`, `doc-coauthoring`, `mcp-builder`, `claude-api`, `academy-guide`, `discernment-nudge`, office-format Skills | Various | Rejected | Not relevant to this project. |

## 5. Installation record

| Skill | Location | Method | Verified |
| --- | --- | --- | --- |
| `frontend-design` | `.claude/skills/frontend-design/` (repository root) | Copied from the official repository clone; project-level Skills directory is a supported install location | Yes — files present on disk |
| `webapp-testing` | `.claude/skills/webapp-testing/` | Same | Yes |

Project-level Skills load automatically in future Claude Code sessions opened in this repository. In this session their instructions were read directly and applied.

## 6. How each Skill was applied

| Phase | Skill | Concrete effect |
| --- | --- | --- |
| Brand & visual direction | `frontend-design` | Chose one typeface family (Instrument Sans) and made its **width axis** the typographic signature instead of pairing default fonts. Avoided the listed "generated page" tells: removed ALL-CAPS eyebrows, monospace data labels, single-word accent colour in headlines, ordinal dots that implied ranking, and fade-up-on-every-section motion. Numbered markers kept only where content is a real sequence (process steps, workflow stages). "Spend boldness in one place": the Signal field and Operations Blueprint carry the expressive motion; everything else is quiet. |
| Copywriting | `frontend-design` (writing section) | Active-voice CTAs that say what happens ("Send inquiry", "Discuss this challenge"); errors that explain how to fix the problem; no filler. |
| QA | `webapp-testing` | Reconnaissance-then-action Playwright scripts (`qa/screens.cjs`, `qa/interactions.cjs`): wait for `networkidle`, inspect rendered DOM, then act. Found and fixed 3 real bugs (see ARCHITECTURE.md → Quality record). |
| Security | `security-audit` (guidance mode) | Mapped the single trust boundary (public `POST /api/contact`), checked input surfaces, abuse paths and output handling. Finding fixed: body was fully buffered before the size check → now capped while streaming. Noted (documented, not a vulnerability in source): `X-Forwarded-For`-keyed rate limiting is only as trustworthy as the hosting proxy. |

## 7. Additional tools used (not Skills)

- **axe-core 4** — automated WCAG 2.2 AA + best-practice audit, all pages at 1440px and 390px.
- **Lighthouse 12** — performance, accessibility, best practices and SEO, mobile and desktop.
- **opentype.js** — converts the wordmark to outlines so logo SVGs never depend on installed fonts.

These were installed into a scratch directory (audit tools) or as dev dependencies (opentype.js), never globally.

## 8. Limitations

- No dedicated SEO, CRO or motion-design Skill from a trustworthy source was found; that expertise was applied directly and documented in CONTENT-STRATEGY.md and ARCHITECTURE.md.
- Skill discovery was re-checked when problems arose (LCP measurement, CSP noise, accessibility contrast); in each case the existing toolset was sufficient, so nothing further was installed.
