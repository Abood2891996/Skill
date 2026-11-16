# JoDesx brand guidelines

## 1. Brand platform

| | |
| --- | --- |
| **Positioning statement** | For international businesses whose operational workload is outgrowing their internal teams, JoDesx is the Jordan-based operations partner that designs, staffs and runs structured remote teams — so the work gets done consistently and visibly, without the client having to manage it. |
| **Brand idea** | Operational support, intelligently connected. |
| **Brand promise** | Clear responsibilities. Structured workflows. Consistent execution. |
| **Personality** | Intelligent, calm, confident, precise, modern, approachable, international, organised, technologically aware. |
| **We are not** | A call centre, a staffing marketplace, a cybersecurity startup, an AI company. |

### Values

1. **Clarity before capacity** — define the work before adding people.
2. **Human judgment, supported by structure** — people decide; process makes good decisions repeatable.
3. **Transparency by default** — volumes, quality and open issues are visible to the client.
4. **Say what is true** — no inflated claims, no commitments we cannot staff.

### Messaging hierarchy

1. **What we do** — build and run remote operational teams in four areas.
2. **How we do it** — written scope, documented procedures, quality review, reporting.
3. **Why it matters** — operations stop competing with the work that moves the business forward.
4. **Proof** — shown, not claimed: workflows, checkpoints, responsibilities, honest FAQs.

## 2. The logo

### Concept — the Signal Mark

The symbol joins a **J** and a **D** around a single square:

- **J (Signal Cyan)** — the connection to the client; the stroke that brings work in.
- **D (white / navy)** — the structure JoDesx builds around that work.
- **The unit (Digital Violet)** — the operation itself, held inside the structure: defined, contained, visible.

The J and D never touch. The **5-unit channel** between them is the signal path — a deliberate gap that keeps the mark legible at 16px and expresses "connected, not merged".

### Construction (48-unit grid)

| Element | Geometry |
| --- | --- |
| J stem | x 10–16, from cap line y = 5 to y = 31 |
| J hook | Quarter-turn, outer radius 12 / inner radius 6, terminating on the baseline bar y 37–43 |
| D bars | Start at x = 21 (5-unit channel after the J stem), thickness 6 |
| D bowl | Outer radius 19, inner radius 13, centred on y = 24 |
| Signal unit | 6 × 6 square; left edge on the D-bar line (x = 21); centred on the bowl axis (y = 24) |
| Visual bounds | x 4–45, y 5–43 |

Stroke weight is constant (6 units) across J, D bars and bowl. All geometry lives in one place: `scripts/build-brand.mjs`.

### Wordmark

"JoDesx" set in **Instrument Sans SemiBold**, tracking −1.5%, converted to outlines. Capitalisation is always **JoDesx** — never JODESX, Jodesx or JoDesX.

### Lockups

| Lockup | Use | Proportions |
| --- | --- | --- |
| Primary (stacked) | Covers, social headers, square formats | Symbol height = 2.6 × cap height; gap = 0.9 × cap height |
| Horizontal | Website header, documents, email signatures | Symbol height = 1.45 × cap height; gap = 0.42 × symbol height |
| Symbol only | Favicon, avatars, small spaces, decorative sign-off | — |

**Clear space:** at least the width of the J stem (6 grid units, scaled) on all sides; for the horizontal lockup, use the height of the signal unit × 2.
**Minimum size:** horizontal lockup 96px wide on screen; symbol 16px.

### Asset files (`public/brand/`)

| File | Description |
| --- | --- |
| `jodesx-logo-primary-dark.svg` / `-light.svg` | Stacked lockup for dark / light backgrounds |
| `jodesx-logo-horizontal-dark.svg` / `-light.svg` (+ `.png`) | Horizontal lockup |
| `jodesx-logo-mono-white.svg` / `-mono-navy.svg` | Single-colour versions (one ink, including the unit) |
| `jodesx-symbol-dark.svg` / `-light.svg` / `-mono-navy.svg` | Symbol only |
| `jodesx-favicon.svg` | Symbol on a rounded navy tile (also `src/app/icon.svg`, `src/app/apple-icon.png`) |
| `jodesx-social-avatar.svg` / `.png` | 400/800px square avatar |

Regenerate with `npm run brand:build` (SVG) and `node scripts/export-brand-png.cjs` (PNG). Never edit the SVGs by hand.

### Misuse

Do not: recolour the J and D the same cyan; close the channel between J and D; rotate, skew or outline the mark; add effects (glow, gradients, shadows); place the full-colour mark on mid-tone or busy backgrounds — use a mono version instead; retype the wordmark in another font.

## 3. Colour

| Token | Hex | Role |
| --- | --- | --- |
| Midnight Navy | `#0B1220` | Primary dark field, text on light |
| Navy 950 | `#070C16` | Deepest field (footer, emphasised dark sections) |
| Slate Blue | `#172438` | Raised surfaces on dark |
| Soft White | `#F4F7FB` | Primary light field, text on dark |
| Paper | `#FFFFFF` | Raised surfaces on light |
| Signal Cyan | `#35D6E8` | Primary action on dark, signal pulses, active states |
| Cyan 700 | `#0B7483` | Cyan for **text** on light backgrounds (meets WCAG AA) |
| Digital Violet | `#786BFF` | The signal unit; secondary accent on dark |
| Violet 600 | `#5B4FE0` | Violet on light backgrounds; focus ring on light |
| Mist 300 / 400 | `#B4BFD0` / `#8C9AB0` | Secondary / tertiary text on dark |
| Ink muted | `#4A5970` | Secondary text on light |

**Rules**
- Navy and Soft White do the work; cyan and violet are signals, used sparingly. Never fill large areas with cyan or violet.
- Gradients appear only as a single hairline (cyan → violet) on hover, and as a faint radial glow behind the Signal output.
- Interactive states: hover lightens the accent ~14%; focus is always a 2px outline (cyan on dark, violet on light) with 3px offset; error `#C2334A` on light / `#FF8A94` on dark; success `#13795B` / `#4FD6A6`.
- Every text pairing used on the site passes WCAG 2.2 AA (verified with axe-core).

Tokens: `src/styles/tokens.css`. Surface-aware variables (`--fg`, `--accent`, `--line`…) switch automatically inside `.surface-dark` and `.surface-light`.

## 4. Typography

One family: **Instrument Sans** (variable, OFL-1.1), self-hosted.

- **Display** — weight 600, **width axis 80** (condensed), tight leading (0.98–1.08), tracking −2 to −2.8%. The condensed width is the typographic signature: it reads engineered and precise without needing a second typeface.
- **Titles** — 600, width 92.
- **Body** — 400, width 100, 17px, line-height 1.65, measure ≤ 62–68ch.

Scale (fluid, `clamp`): Display XL 42→86px · Display L 34→62px · Display M 27→42px · Title 19→23px · Lead 17→20px · Body 17px · Small 14px.

Avoid: all-caps labels, accenting a single word in a headline, monospace for labels.

## 5. The JoDesx Signal

The visual system that expresses "operational connectivity". Vocabulary:

| Element | Meaning | Where |
| --- | --- | --- |
| **Lane** — a thin horizontal line | A stream of work | Hero, service glyphs, closing CTA |
| **Gate** — an outlined, rounded column or square | A checkpoint (review, quality) | Hero, glyphs, Blueprint nodes |
| **Pulse** — a short cyan segment travelling a lane | Work moving through the system | Hero animation |
| **Indicator** — a small square that lights | A checkpoint passed | Hero gates, Blueprint |
| **Unit** — a solid violet square | The operation / an outcome; echoes the logo | Logo, hero output, kickers, bullets |
| **Rail** — a line with square nodes that fills | A sequence progressing | Engagement rail, contact "what happens next" |

Rules: lanes are orthogonal with soft radius turns — never random networks, particles, circuit traces or brains. Motion only travels *forward* (left → right, top → bottom). One expressive moment per view.

## 6. Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-signal` | `cubic-bezier(.22,.8,.24,1)` | Signals, reveals, indicator fills |
| `--ease-out-soft` | `cubic-bezier(.25,.6,.3,1)` | Hover, colour, small UI changes |
| `--dur-fast / base / slow` | 160 / 260 / 480 ms | Hover · panels · detail transitions |

Animations pause off-screen and are replaced by a composed still frame under `prefers-reduced-motion`. The route fade runs only on client-side navigation (never on first load, which would delay LCP).

## 7. Voice

Precise, understated, plain. Write from the client's side of the table. Specific over impressive. See `CONTENT-STRATEGY.md`.
