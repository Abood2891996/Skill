# JoDesx — standing context for RTCCO briefs

Use the facts relevant to the task. If a fact here conflicts with the codebase or with `jodesx/docs/PROJECT-STATUS.md`, trust those and update this file.

## Business
- **JoDesx** (exact capitalisation) — a Jordan-based business operations and outsourcing company serving international businesses. An operations partner, not a staffing agency, freelance marketplace, software agency or AI company.
- **Four services:** Content Moderation · Customer Support · Back-Office Operations · AI Data Operations (human-in-the-loop; JoDesx does not build AI models).
- **Positioning:** “Operational support, intelligently connected.” Homepage headline: “Operations, structured around your business.”
- **Model:** teams work **remotely or on-site at JoDesx offices in Jordan**, as the client prefers (confirmed by the owner 17 Nov 2026); employees or contracted specialists organised and supervised by JoDesx; scope in writing; documented procedures; quality review; reporting.
- **Time zone:** Jordan, UTC+3 — full overlap with Europe and the Gulf, start of the North American day.
- **Legal entity:** شركة قلب التقنية المعلوماتية لأنشطة مراكز الاتصال و خدمات الحاسوب و المعلومات /ذات مسؤولية محدودة — a limited liability company registered in Jordan; JoDesx is its trading name. Stored in `jodesx/src/content/site.ts` (`legal`). Show only the country (no city/address) unless the owner says otherwise. Privacy email: privacy@jodesx.com.
- **Unconfirmed (do not state as fact without the owner):** clients, results, prices, team size, certifications, language coverage, office address.

## Brand
- Colours: Midnight Navy `#0B1220`, Signal Cyan `#35D6E8`, Digital Violet `#786BFF`, Slate Blue `#172438`, Soft White `#F4F7FB`.
- Font: Instrument Sans (condensed width for headlines). Visual system: “The JoDesx Signal” (lanes, gates, a violet square unit).
- Voice: precise, calm, specific, sentence case, no hype. Details: `jodesx/docs/BRAND-GUIDELINES.md`, `jodesx/docs/CONTENT-STRATEGY.md`.

## Live setup
- Website: **https://www.jodesx.com** (jodesx.com redirects to www).
- Code: GitHub repo `abood2891996/Skill`, website in folder `jodesx/`, live branch `main`.
- Hosting: Vercel project `skill-dawz` (Root Directory `jodesx`); DNS managed in Vercel.
- Domain registrar: Spaceship — expires 16 Nov 2027, auto-renew on, transfer lock on.
- DMARC: `p=none` since 17 Nov 2026; switch to `p=quarantine` in early–mid December 2026.
- Email: Zoho Mail inboxes on @jodesx.com; website forms delivered by Resend. Settings are Vercel environment variables (see `jodesx/docs/DEPLOYMENT.md`).
- Google Search Console verified; sitemap submitted.
- Owner is not a developer: explain steps simply, one action at a time.

## Where things live (website)
| Need | Location |
|---|---|
| Page copy | `jodesx/src/content/*.ts` (pages, services, why, careers, navigation, site) |
| Job postings | `jodesx/src/content/jobs/*.md` — copy `_TEMPLATE.md`; guide in `jodesx/docs/POSTING-JOBS.md` |
| Pages / routes | `jodesx/src/app/` |
| Components | `jodesx/src/components/` |
| Design tokens | `jodesx/src/styles/tokens.css` |
| Forms & email | `jodesx/src/lib/validation/`, `jodesx/src/lib/contact/delivery.ts`, `jodesx/src/app/api/` |
| Full guide | `jodesx/docs/JoDesx-Website-Guide.pdf` (source `jodesx/docs/guide/`, rebuild `node scripts/build-guide.cjs`) |
| Quality gate | `cd jodesx && npm run check` (+ `node qa/interactions.cjs` against a running build) |
