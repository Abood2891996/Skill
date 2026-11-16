# Competitor research

Research date: 16 November 2026.

## 1. Access limitation — read this first

**None of the 13 competitor websites could be opened from the build environment.** Every direct request was refused by the session's network policy (`CONNECT 403` from the egress proxy; `ENOTFOUND` from the page-fetch tool) for:

TaskUs, Teleperformance, Concentrix, Foundever, TTEC, TELUS Digital, SupportNinja, Helpware, ModSquad, PartnerHero, Welocalize, Scale AI, Invisible Technologies.

Therefore this document **does not claim to have inspected any competitor's live website** — no visual analysis of their colours, layouts, animation or markup was possible, and none is invented here. What follows is limited to:

1. **Secondary evidence** from web-search results (search snippets and third-party pages), labelled as such and cited.
2. **Category-level hypotheses** about common B2B outsourcing site patterns, labelled as hypotheses, used only to set design goals — not as claims about any named company.

**Recommended follow-up:** allow these domains in the environment's network settings (or review them manually in a browser) and complete §5 with first-hand observations. The design decisions in §4 do not depend on that follow-up, but it should be done before any competitive claims are made publicly.

## 2. Secondary evidence (search results only)

| Company | What search results indicated | Source type |
| --- | --- | --- |
| TaskUs | UK homepage title: "Speak Every Customer's Language, Scale CX Seamlessly". Its Trust & Safety section cites Everest Group PEAK Matrix recognition (2023, 2024) and groups moderation under user safety, platform/business integrity and actor integrity. | Company pages as indexed by search ([taskus.com/en-gb/home](https://www.taskus.com/en-gb/home/)) |
| Concentrix / Teleperformance | Described by a third-party review as running large-scale Trust & Safety programmes combining human moderation with automation; TP described as covering moderation, appeals and policy operations. No homepage copy retrieved. | Third party ([labelyourdata.com](https://labelyourdata.com/articles/content-moderation-companies/)) |
| SupportNinja | Homepage shows "Get a Quote" alongside "Get started" and "Explore solutions" CTAs; solution pages per support type. | Company pages as indexed ([supportninja.com](https://www.supportninja.com/home)) |
| Helpware | Organised as divisions: CX, AI, Tech, Media. | Company blog ([helpware.com](https://helpware.com/blog/saas-customer-service)) |
| PartnerHero | Search results indicate a merger/acquisition with Crescendo; brand may now appear under that name. | Third party ([ringly.io](https://www.ringly.io/blog/partnerhero-alternatives)) |
| ModSquad | Positions "on-demand, multilingual" specialist "Mods". | Company page as indexed ([modsquad.com](https://modsquad.com/customer-support-outsourcing)) |
| TELUS Digital | Data annotation page describes end-to-end labelling from workflow setup and annotator selection to delivery, and a named labelling platform. A TELUS article argues for moving from "human-in-the-loop" to "human-on-the-loop". | Company pages as indexed ([telusdigital.com](https://www.telusdigital.com/solutions/ai-data-solutions/platform)) |
| Scale AI / Invisible / Welocalize | Only competitor-authored or directory descriptions found (e.g. Invisible's own comparison post). Treated as low-reliability. | Third party / competitor marketing |

## 3. What the evidence suggests about the category

These are **observations from the limited evidence above**, not site audits:

- **Trust is built on scale signals** — analyst rankings, delivery-centre counts, contributor numbers, client logos. JoDesx has none of these to show (and must not invent them), so it cannot compete on that axis.
- **Service architecture is broad** — large providers present many divisions and solution pages. Breadth is a strength for them and a source of decision fatigue for a buyer with one problem.
- **Generic CTAs** ("Get started", "Get a quote") appear without context about what happens next.
- **AI positioning is crowded** — several providers frame themselves as AI companies. JoDesx must not, because it does not build AI.

## 4. Design decisions derived from this

| Opportunity | Hypothesis | JoDesx implementation |
| --- | --- | --- |
| Credibility without scale claims | A buyer evaluating a newer provider looks for evidence of operational thinking. | Show the operation itself: the **Operations Blueprint** (per-service workflow with checkpoints and escalation branches), a written **quality loop**, explicit **responsibilities on both sides**, and FAQs that answer hard questions directly. No logos, stats or testimonials. |
| Decision fatigue | Buyers arrive with a problem, not a service name. | **Challenge selector**: pick the pressure point → service, diagnosis and first step → pre-filled inquiry. |
| Vague engagement process | "Get started" hides what happens next. | Six-step **How we work** page; "What happens next" beside the contact form; CTAs that name their outcome ("Discuss this challenge"). |
| Generic contact forms | Long or opaque forms deter qualified buyers. | Grouped form (about you / the work / how to reach you), optional sizing fields, honest delivery states, data preserved on failure. |
| Undifferentiated AI messaging | Overclaiming AI erodes trust. | Explicit note: "JoDesx does not build or train AI models." Position as the human operations AI teams rely on. |
| Stock-photo sameness (category hypothesis) | Outsourcing sites lean on office and headset imagery. | No photography at all: an original SVG visual system (The JoDesx Signal) carries the brand. |

## 5. To complete when access is available

For each company, record first-hand: hero headline and visual, navigation and services IA, primary/secondary CTA placement, contact-form fields, trust elements, mobile navigation, motion, and Lighthouse scores. Then revisit §4 and confirm or revise each hypothesis.
