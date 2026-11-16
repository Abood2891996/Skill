# Architecture

## 1. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16.4** (App Router), React 19.3 | Static prerendering for every page + one server route for the form; first-class metadata, sitemap and OG image APIs. |
| Language | **TypeScript 5.9**, `strict` + `noUncheckedIndexedAccess` | Catch content/shape errors at build time. No `any` (lint-enforced). |
| Styling | **Tailwind CSS 4.3** + CSS custom-property tokens | Utilities for layout; tokens and a small components layer for the design system. |
| Validation | **Zod 4** (jitless mode) | One schema shared by client and server. |
| Icons | **lucide-react** | UI affordances only (chevrons, menu, alerts). Brand illustrations are bespoke SVG. |
| Fonts | Instrument Sans variable, self-hosted via `next/font/local` | No third-party font requests; width axis drives the display style. |

Deliberately **not** added: an animation library (CSS handles all motion, keeping JS small), a UI kit (bespoke components are smaller and on-brand), analytics or third-party scripts (privacy, CSP, performance).

## 2. Directory structure

```
src/
  app/                         Routes (App Router)
    page.tsx                   Home
    services/                  Overview + 4 service routes (+ per-service OG images)
    how-we-work/  about/  contact/  privacy/
    api/contact/route.ts       Inquiry endpoint (the only dynamic route)
    layout.tsx  template.tsx   Shell, fonts, metadata, route transition
    sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg  apple-icon.png  not-found.tsx
  components/
    brand/          Logo + generated logo geometry
    navigation/     SiteHeader (desktop dropdown), MobileMenu
    layout/         SiteFooter
    hero/           SignalField (hero visual)
    interactive/    OperationsBlueprint, ChallengeSelector
    services/       ServiceGlyph, ServiceGrid, ServicePageTemplate
    sections/       PageHero, ClosingCta, EngagementRail, QualityLoop
    forms/          ContactForm, field primitives
    motion/         InViewPlayer, RouteTransition
    ui/             Section, ButtonLink, TextLink, FaqList, Breadcrumbs, JsonLd
  content/          ALL copy and structured content (typed)
  hooks/            useDismiss, usePrefersReducedMotion
  lib/
    validation/     contact schema + option lists
    contact/        delivery adapters, rate limiter
    seo/            metadata factory, JSON-LD builders, OG renderer
    utils/          cn()
  styles/           tokens.css, globals.css, navigation.css, signal.css
public/brand/       Logo assets (generated)
scripts/            build-brand.mjs, export-brand-png.cjs
tests/              Unit tests (node:test)
qa/                 Playwright screenshot + interaction suites
docs/               This documentation
```

## 3. Design system

- **Tokens** (`styles/tokens.css`): palette, fluid type scale, spacing, radius hierarchy (controls 6 → panels 16 → stages 28), motion curves/durations. Exposed to Tailwind through `@theme inline` in `globals.css` (e.g. `bg-navy-900`, `ease-signal`).
- **Surfaces**: every section declares `.surface-dark` or `.surface-light`, which set contextual variables (`--fg`, `--fg-muted`, `--line`, `--accent`, `--signal`, `--focus`…). Components read only these variables, so the same component renders correctly on either surface — e.g. `ServiceGlyph` and `FaqList` are used on both.
- **Typographic roles**: `.type-display-xl|lg|md`, `.type-title`, `.type-lead`, `.type-small` (components layer).
- **Controls**: `.btn` + `.btn-primary|secondary|sm`, `.link-signal`, `.panel`, `.form-control`, `.field-error`.

## 4. Routing and rendering

All pages are **statically prerendered** (`○` in the build output). `/api/contact` is the only dynamic route (`ƒ`). Service pages share `ServicePageTemplate`; each route file only selects its content and metadata, so adding a service means adding content + one 12-line route.

## 5. Data structures

`src/content/types.ts` defines `Service`, `BlueprintStage`, `Faq`, `TextBlock`. A `Service` holds everything a service page needs: hero, problems, capabilities, optional channels, **workflow stages** (consumed by the Blueprint), quality principles, use cases, engagement options, FAQs, CTA and SEO metadata. `pages.ts` holds home/about/process copy, the challenge → service map, comparison rows and engagement models.

## 6. Signature components

### SignalField (hero)
Pure SVG + CSS. Lane paths and their lengths are computed in TypeScript so gate-indicator flash delays are derived from geometry (`arrival(distance, length)`), keeping pulses and lights in sync without JS timers. Labels are HTML overlays (crisp at any scale). Wrapped in `InViewPlayer`, which pauses CSS animations off-screen via `data-playing`.

### OperationsBlueprint
Client component. WAI-ARIA tabs (roving tabindex; Arrow/Home/End keys) select a service; stage buttons (`aria-pressed`) select a step; the detail panel is an `aria-live="polite"` region. A walkthrough auto-advances every 3.2s **only while visible**, stops permanently once the visitor picks a stage, has a visible Pause control (WCAG 2.2.2) and is disabled under reduced motion. Per-stage connectors (not one absolute track) keep the diagram correct in both the horizontal (≥768px) and vertical layouts. `lockService` mode embeds a single service's workflow on its page.

### ChallengeSelector
Native radio inputs (keyboard support for free) mapped to a recommendation with diagnosis, first step and a CTA linking to `/contact?service=…&challenge=…`, which the form reads to pre-fill. On single-column layouts the result is scrolled into view.

### Navigation
Services menu uses the **disclosure** pattern (not `role="menu"`), opens on click, keyboard, or mouse hover, and closes on Escape (focus returns to the button), outside press or navigation. A click shortly after a hover-open keeps it open. The mobile menu is rendered **outside** `<header>` because the header's translate (hide-on-scroll) would otherwise become the containing block for the fixed panel; it traps focus, locks scroll, and restores focus on close.

## 7. Form architecture

```
ContactForm (client)                       POST /api/contact (server)
 ├─ contactSchema.safeParse → inline errors  ├─ same-origin check (Origin vs Host)  → 403
 ├─ honeypot field + render timestamp        ├─ JSON content-type                   → 415
 └─ fetch → handle status codes              ├─ rate limit 5 / 10 min / client IP   → 429
                                             ├─ body ≤ 16 KB (streamed cap)         → 413
                                             ├─ contactSchema (authoritative)       → 422 + field errors
                                             ├─ honeypot filled                     → 200 (silently dropped)
                                             ├─ submitted < 3 s after render        → 400
                                             └─ deliverInquiry()
                                                  ├─ CONTACT_WEBHOOK_URL (HMAC-signed JSON)
                                                  ├─ Resend email (reply-to = sender)
                                                  └─ none configured                → 503 not_configured
```

The UI never claims success unless the server confirms delivery. On `not_configured` or failure, the visitor's input is preserved, a mailto link (if a public email is configured) and a "Copy my inquiry" button are offered. Successful submissions show a reference (`JDX-XXXXXX`) that is also included in the delivered message.

## 8. Careers

- **Jobs as content files.** `src/content/jobs/*.md` → `lib/careers/jobs.ts` reads them at build time, validates front matter with Zod (`job-schema.ts`) and fails the build with a readable message if a post is invalid. Pages `/careers/[slug]` are statically generated (`dynamicParams = false`).
- **Safe Markdown.** `lib/careers/markdown.ts` supports only headings, lists, paragraphs and bold, producing data that `JobBody` renders as React elements — no HTML injection path.
- **Applications.** `POST /api/careers/apply` (multipart): same-origin check, size cap (4 MB CV; Vercel's 4.5 MB body limit), rate limit (5 per 30 min per client), honeypot and timing checks, shared Zod schema, **file-signature verification** (PDF/DOC/DOCX magic bytes must match the extension), file-name sanitising, and a check that the role exists and is open (410 otherwise). `outputFileTracingIncludes` ships the job files with the function.
- **Structured data.** Open roles publish `JobPosting` JSON-LD (eligible for Google's job search experience).

## 9. SEO

`createMetadata()` gives every page a unique title, description, canonical URL, Open Graph and Twitter card. JSON-LD: `Organization` + `WebSite` (layout), `Service` + `FAQPage` + `BreadcrumbList` (service pages), `FAQPage` (home), `BreadcrumbList` (other pages). Generated `sitemap.xml`, `robots.txt` (disallows `/api/`), branded OG images per service. One `h1` per page; headings follow document order.

## 10. Security

- Strict CSP (`default-src 'self'`, no third-party origins, `frame-ancestors 'none'`, `object-src 'none'`), HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP. `script-src` allows `'unsafe-inline'` because Next.js injects inline bootstrap scripts; a nonce-based CSP via `proxy.ts` is possible but would force every page to render dynamically. Revisit if third-party scripts are ever added.
- Zod runs in `jitless` mode so nothing needs `eval`.
- JSON-LD is serialised with `<` escaped; it is the only `dangerouslySetInnerHTML`, and its input is local constant data.
- Secrets are server-only env vars; nothing secret is prefixed `NEXT_PUBLIC_`.
- The webhook channel accepts only `https://` URLs from environment configuration (no user-controlled destinations).

## 11. Performance and accessibility

- Static HTML, self-hosted variable font, no images on the critical path (all visuals are inline SVG), CSS-only animation paused off-screen. CLS is 0 on every page.
- The route fade runs only on client-side navigations: starting first paint at `opacity: 0` prevented Chrome from recording LCP.
- Accessibility: skip link, landmarks, visible focus on every control, labelled form fields with `aria-invalid`/`aria-describedby`, focus moved to the first invalid field and to result messages, `aria-live` for dynamic regions, native `<details>` FAQs, reduced-motion still frames.

## 12. Quality record (16 Nov 2026)

| Check | Result |
| --- | --- |
| `tsc --noEmit` | Pass |
| ESLint (next/core-web-vitals + typescript) | Pass, 0 warnings |
| Unit tests (`npm test`) | 21 / 21 pass |
| Playwright interaction suite (`qa/interactions.cjs`) | 66 / 66 pass, repeatable |
| Layout sweep: 10 pages × 1440 / 768 / 390px | 0px horizontal overflow, 0 console errors |
| axe-core WCAG 2.2 AA + best practice, 10 pages × 2 widths | 0 violations |
| Lighthouse desktop (8 pages) | 100 / 100 / 100 / 100 |
| Lighthouse mobile (8 pages) | Performance 95–99; Accessibility, Best Practices, SEO 100; CLS 0 |

Bugs found by testing and fixed: hover-then-click closed the services menu; mobile menu unclickable after reopening (containing-block bug); header hide-on-scroll reset by small deltas; `NO_LCP` caused by the opacity-0 route fade; CSP violation from Zod's eval probe; low-contrast outlined numerals; contact body buffered before size check.
