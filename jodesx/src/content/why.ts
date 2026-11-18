/**
 * "Why JoDesx" — the reasons a business should choose JoDesx.
 * Every reason is a mechanism (something we actually do) paired with the
 * benefit the client feels. No unverifiable superlatives, no invented proof.
 */

export interface Reason {
  id: string;
  title: string;
  body: string;
  /** The tangible outcome for the client. */
  outcome: string;
}

export const whyHero = {
  title: "An operations partner that takes ownership of the work.",
  lead: "JoDesx designs, staffs and runs each operation with you — from a written scope to quality review and reporting. Here is what that means for your business.",
};

/** The four reasons that lead on the homepage. */
export const coreReasons: Reason[] = [
  {
    id: "operation",
    title: "A running operation from the first week",
    body: "We deliver a working workflow — procedures written, supervision in place, quality checked and results reported. Your team reviews outcomes while we handle the day-to-day.",
    outcome: "Less management load from the first week.",
  },
  {
    id: "written",
    title: "Nothing starts until it's written down",
    body: "Scope, responsibilities, decision rights, escalation paths and quality measures are agreed in writing before the first task. Everyone knows what is expected and who decides what.",
    outcome: "No ambiguity, no scope drift, no surprises.",
  },
  {
    id: "pilot",
    title: "Prove it small, then scale",
    body: "Start with one queue, one process or one pilot batch. You see real output and real quality data before committing to more — and you expand only when the results justify it.",
    outcome: "A low-risk start with evidence before commitment.",
  },
  {
    id: "quality",
    title: "Quality you can inspect, not just trust",
    body: "Sampled reviews, calibration sessions, error tracking and regular reports are built into every engagement. You see the same numbers we see.",
    outcome: "Decisions based on evidence, not reassurance.",
  },
];

/** Further reasons, shown on the Why JoDesx page. */
export const moreReasons: Reason[] = [
  {
    id: "control",
    title: "Your tools, your data, your control",
    body: "Our teams work inside your systems with access you grant and can revoke at any time. Your data, conversation history and records stay where they belong — with you.",
    outcome: "Nothing locked inside a vendor's platform.",
  },
  {
    id: "timezone",
    title: "A time zone that works in your favor",
    body: "From Jordan (UTC+3), our working day overlaps fully with Europe and the Gulf. For North American teams, work moves forward while you sleep and is ready when your day begins.",
    outcome: "Faster turnaround and longer daily coverage.",
  },
  {
    id: "trained",
    title: "Trained on your work before touching it",
    body: "Every team member learns your product, policies and tools through structured onboarding, then works under supervision before taking on full volume.",
    outcome: "Fewer early mistakes, a faster path to full quality.",
  },
  {
    id: "access",
    title: "Direct access to the people running your work",
    body: "You get a named contact who knows your operation in detail and can answer quickly, with the full context of your work.",
    outcome: "Issues raised early and resolved quickly.",
  },
  {
    id: "honest",
    title: "Straight answers about fit",
    body: "If a process isn't ready to hand over, or a language is one we can't staff well, we tell you before you sign — not after. We only commit to what we can deliver.",
    outcome: "Expectations that match reality.",
  },
  {
    id: "flexible",
    title: "Capacity that moves with your business",
    body: "Scale the team up for a launch, a backlog or a seasonal peak, and back down when volume settles — within the flexibility agreed in your engagement.",
    outcome: "The capacity you need, when you need it.",
  },
];

export interface Inclusion {
  label: string;
  detail: string;
}

/** What every JoDesx engagement includes (shown on the Why JoDesx page). */
export const inclusions: Inclusion[] = [
  { label: "Workflow design", detail: "Designed with you and documented before work begins." },
  { label: "Recruiting and training", detail: "Handled by JoDesx, including onboarding on your tools, products and policies." },
  { label: "Supervision", detail: "Day-to-day supervision by JoDesx; you review outcomes." },
  { label: "Quality measurement", detail: "Sampling, calibration and error tracking built into every engagement." },
  { label: "Reporting", detail: "Volumes, turnaround and quality findings, on a schedule agreed with you." },
  { label: "Working model", detail: "Remote or on-site at our offices in Jordan, as your operation requires." },
  { label: "Scaling", detail: "Capacity adjusted within the flexibility agreed in your engagement." },
  { label: "Documentation", detail: "Written procedures for every task — and yours to keep." },
];

/** Plain-language commitments. */
export const commitments: string[] = [
  "We put scope in writing before work begins.",
  "We only commit to what we can staff properly.",
  "You will hear about problems from us first.",
  "Your data stays in your systems wherever possible.",
  "The documentation we create belongs to you.",
  "Reporting arrives on the schedule we agreed.",
];
