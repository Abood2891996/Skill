import type { Faq, ServiceSlug, TextBlock } from "./types";

/* ------------------------------------------------------------------------
 * Home
 * --------------------------------------------------------------------- */
export const home = {
  hero: {
    title: "Operations, structured around your business.",
    lead: "JoDesx builds and runs remote operational teams for content moderation, customer support, back-office work and AI data operations — with defined workflows, human review and clear reporting.",
    primaryCta: "Start an inquiry",
    secondaryCta: "See how we work",
  },
  intro: {
    title: "Four areas of operational work. One way of running them.",
    body: "Each service is different in content and identical in discipline: scope agreed in writing, procedures documented, quality reviewed, results reported.",
  },
  closing: {
    title: "Let's make your next operation work better.",
    body: "Tell us what you need to run. The first conversation is about understanding your operation — not selling you a package.",
  },
};

/* ------------------------------------------------------------------------
 * Operational challenge selector
 * --------------------------------------------------------------------- */
export interface Challenge {
  id: string;
  label: string;
  service: ServiceSlug;
  diagnosis: string;
  firstStep: string;
}

export const challenges: Challenge[] = [
  {
    id: "review-backlog",
    label: "User content is waiting too long for review",
    service: "content-moderation",
    diagnosis:
      "A review backlog is usually a capacity problem and a consistency problem at once. Adding reviewers without shared guidelines moves the backlog without fixing it.",
    firstStep: "Map your queues and guidelines, then size a moderation team to the volume that actually arrives.",
  },
  {
    id: "inconsistent-decisions",
    label: "Policy decisions are inconsistent",
    service: "content-moderation",
    diagnosis:
      "When the same content gets different outcomes, the guideline is being read differently. Calibration and decision logging make the reading visible.",
    firstStep: "Review a sample of recent decisions against your policy to find where interpretations split.",
  },
  {
    id: "slow-responses",
    label: "Customers are waiting too long for answers",
    service: "customer-support",
    diagnosis:
      "Slow responses often come from tickets without a clear owner, or from questions that need an answer your knowledge base doesn't have.",
    firstStep: "Classify last month's tickets by type to see which can be resolved at first contact.",
  },
  {
    id: "team-on-tickets",
    label: "Our core team spends its day on support",
    service: "customer-support",
    diagnosis:
      "If product or operations staff are the default support team, most repeat questions can move to a trained first line with clear handover rules.",
    firstStep: "Define what a support team can answer alone and what must come back to you.",
  },
  {
    id: "admin-load",
    label: "Admin and data entry are crowding out real work",
    service: "back-office",
    diagnosis:
      "Repeatable tasks are the easiest to transfer — once they are written down. The procedure is the hand-over.",
    firstStep: "List recurring tasks with their frequency, then document the first one together.",
  },
  {
    id: "records-drift",
    label: "Our records are scattered and unreliable",
    service: "back-office",
    diagnosis: "Records drift when no one owns their structure. A defined format plus regular verification keeps them usable.",
    firstStep: "Agree the target structure, then clean and verify records in priority order.",
  },
  {
    id: "label-quality",
    label: "Our training data quality is uneven",
    service: "ai-data-operations",
    diagnosis:
      "Uneven labels usually trace back to ambiguous guidelines. Measuring agreement shows which instructions are being read differently.",
    firstStep: "Run a pilot batch with gold-standard items to set a measurable quality baseline.",
  },
  {
    id: "evaluation-volume",
    label: "We need human evaluation at volume",
    service: "ai-data-operations",
    diagnosis:
      "Evaluating model outputs needs a stable rubric and reviewers trained to apply it the same way, batch after batch.",
    firstStep: "Turn your evaluation criteria into a rubric with worked examples, then calibrate on a pilot.",
  },
];

/* ------------------------------------------------------------------------
 * Why JoDesx
 * --------------------------------------------------------------------- */
export const principles: TextBlock[] = [
  {
    title: "An operations partner, not a list of people",
    body: "We design how the work runs — workflow, responsibilities, checks and reporting — and then staff it. You get an operation, not a headcount to manage.",
  },
  {
    title: "Structure from the first week",
    body: "Scope, procedures and escalation paths are agreed in writing before work starts. Everyone knows what is expected and who decides what.",
  },
  {
    title: "Human judgment where it matters",
    body: "Moderation calls, customer conversations and data labels all depend on people reading context well. We build the work around that, not around shortcuts.",
  },
  {
    title: "Transparent by default",
    body: "You see the volumes, the turnaround, the quality samples and the open questions. Reporting is part of the service, not an extra.",
  },
];

/* ------------------------------------------------------------------------
 * Engagement lifecycle (home visualization + How We Work page)
 * --------------------------------------------------------------------- */
export const engagementFlow = [
  { id: "requirement", label: "Client requirement", body: "What needs to be done, at what volume, to what standard." },
  { id: "planning", label: "Operational planning", body: "Workflows, coverage hours, tools and escalation paths." },
  { id: "team", label: "Team structure", body: "Roles, team size, supervision and training plan." },
  { id: "execution", label: "Execution", body: "Daily operations inside your tools and procedures." },
  { id: "quality", label: "Quality review", body: "Sampling, calibration and feedback against agreed standards." },
  { id: "reporting", label: "Reporting", body: "Volumes, turnaround, quality findings and improvements." },
] as const;

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  activities: string[];
  outcome: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    summary: "We learn how your operation works today and what needs to change.",
    activities: [
      "Discussion of goals, volumes and current pain points",
      "Review of existing tools, guidelines and procedures",
      "Identification of what is ready to transfer and what isn't",
    ],
    outcome: "A shared understanding of the work and its constraints.",
  },
  {
    number: "02",
    title: "Define",
    summary: "Scope, responsibilities, workflows and expectations go in writing.",
    activities: [
      "Scope of work and service boundaries",
      "Decision rights and escalation paths",
      "Quality measures and reporting cadence",
    ],
    outcome: "A written operating agreement both sides can check against.",
  },
  {
    number: "03",
    title: "Build",
    summary: "We organize the operational structure the work requires.",
    activities: [
      "Team composition and supervision structure",
      "Training on your products, policies and tools",
      "Documented procedures for each task type",
    ],
    outcome: "A trained team with procedures ready to follow.",
  },
  {
    number: "04",
    title: "Integrate",
    summary: "Communication and reporting are connected to your team.",
    activities: [
      "Access to your tools, with permissions you control",
      "Named contacts and communication channels",
      "Reporting format and review meetings",
    ],
    outcome: "A team that works inside your environment, visibly.",
  },
  {
    number: "05",
    title: "Operate",
    summary: "The agreed responsibilities are carried out, day after day.",
    activities: [
      "Daily execution against documented procedures",
      "Escalation of anything outside scope",
      "Ongoing quality sampling",
    ],
    outcome: "Consistent execution you can measure.",
  },
  {
    number: "06",
    title: "Improve",
    summary: "Performance is reviewed and processes are refined.",
    activities: [
      "Regular review of quality findings and trends",
      "Procedure and guideline updates",
      "Adjustment of scope or capacity as needs change",
    ],
    outcome: "An operation that gets sharper over time, not just older.",
  },
];

/* ------------------------------------------------------------------------
 * Quality philosophy
 * --------------------------------------------------------------------- */
export const qualityPhilosophy = {
  title: "Quality is a process, not a promise.",
  body: "Every JoDesx engagement runs on the same quality loop. It doesn't depend on any one person having a good day.",
  loop: [
    { title: "Standard", body: "What good looks like is written down before work begins." },
    { title: "Sample", body: "Completed work is reviewed against that standard on a regular cadence." },
    { title: "Calibrate", body: "Disagreements and errors are discussed until the team reads the standard the same way." },
    { title: "Refine", body: "Procedures and guidelines are updated, and the change is recorded." },
  ],
};

/* ------------------------------------------------------------------------
 * Business environments
 * --------------------------------------------------------------------- */
export const environments: { title: string; body: string; services: ServiceSlug[] }[] = [
  {
    title: "Online platforms and communities",
    body: "Platforms that host user content and conversations.",
    services: ["content-moderation", "customer-support"],
  },
  {
    title: "E-commerce and marketplaces",
    body: "Businesses with orders, listings and customers to look after.",
    services: ["customer-support", "back-office", "content-moderation"],
  },
  {
    title: "Software and SaaS companies",
    body: "Product teams that need support and operations to scale with users.",
    services: ["customer-support", "back-office"],
  },
  {
    title: "AI and data teams",
    body: "Teams that need reliable human judgment in their data pipeline.",
    services: ["ai-data-operations"],
  },
  {
    title: "Service and operations businesses",
    body: "Companies whose growth is limited by administrative load.",
    services: ["back-office", "customer-support"],
  },
];

/* ------------------------------------------------------------------------
 * Engagement models
 * --------------------------------------------------------------------- */
export const engagementModels: (TextBlock & { fit: string })[] = [
  {
    title: "Dedicated team",
    body: "A consistent team assigned to your operation, trained on your processes and reporting to your contacts.",
    fit: "Best for ongoing work with steady volume.",
  },
  {
    title: "Managed workflow",
    body: "JoDesx owns a defined workflow end to end and reports on agreed outputs and quality measures.",
    fit: "Best when you want outcomes, not people management.",
  },
  {
    title: "Flexible capacity",
    body: "Additional capacity for peaks, backlogs, after-hours coverage or a defined project.",
    fit: "Best for variable or time-bound needs.",
  },
];

/* ------------------------------------------------------------------------
 * General FAQ (home)
 * --------------------------------------------------------------------- */
export const generalFaqs: Faq[] = [
  {
    question: "What exactly does JoDesx do?",
    answer:
      "JoDesx organizes and runs remote operational teams for four kinds of work: content moderation, customer support, back-office operations and AI data operations. We define the workflow with you, staff it, review quality and report on results.",
  },
  {
    question: "Is JoDesx a staffing or recruitment agency?",
    answer:
      "No. A staffing agency supplies people for you to manage. JoDesx takes responsibility for how the work is run — procedures, supervision, quality review and reporting — within the scope we agree.",
  },
  {
    question: "Where is the team based?",
    answer:
      "JoDesx is based in Jordan and works with businesses internationally. Jordan's time zone overlaps fully with European and Gulf business hours and with the start of the North American working day; coverage hours for your engagement are agreed during scoping.",
  },
  {
    question: "Who works on our account?",
    answer:
      "Depending on the engagement, work is carried out by remote employees or contracted specialists organized and supervised by JoDesx. The team structure is described in the operating agreement, so you know how your work is staffed.",
  },
  {
    question: "How do we start?",
    answer:
      "With a conversation about your operation. If there's a fit, we define scope in writing and usually begin with a contained piece of work before expanding.",
  },
  {
    question: "How do you handle our data?",
    answer:
      "The team works inside your tools wherever possible, with access you grant and can revoke. Confidentiality and data-handling terms are agreed in writing before any access is given.",
  },
];

/* ------------------------------------------------------------------------
 * About
 * --------------------------------------------------------------------- */
export const about = {
  hero: {
    title: "A company built on the belief that operations should create clarity.",
    lead: "JoDesx is a Jordan-based business operations company. We help international businesses extend their operational capacity through structured remote teams, human expertise and well-defined workflows.",
  },
  why: {
    title: "Why JoDesx exists",
    paragraphs: [
      "Growing companies reach a point where operational work — reviewing content, answering customers, processing data — starts to compete with the work that moves the business forward. Outsourcing is the obvious answer, and often the disappointing one: people are supplied, but the operation still has to be designed, supervised and corrected by the client.",
      "JoDesx was set up to close that gap. We treat every engagement as an operation to be designed: what the work is, how it flows, who decides what, how quality is checked and how results are reported. The people matter enormously — and they do their best work inside a structure that makes good judgment repeatable.",
    ],
  },
  philosophy: [
    {
      title: "Clarity before capacity",
      body: "Adding people to an unclear process multiplies the confusion. We define the work first.",
    },
    {
      title: "People do the judgment work",
      body: "Moderation, support and data review depend on human reading of context. Our job is to give people the training, guidelines and support to do it well.",
    },
    {
      title: "Process is the safety net",
      body: "Documented procedures, quality sampling and escalation paths protect outcomes on the days when something unexpected happens.",
    },
    {
      title: "Say what is true",
      body: "We tell clients what we can staff, what we can't, and where a process isn't ready to transfer yet.",
    },
  ] satisfies TextBlock[],
  jordan: {
    title: "Based in Jordan, working internationally",
    paragraphs: [
      "JoDesx is based in Jordan, and our work is oriented toward international businesses. Jordan sits at UTC+3, which overlaps with the working day across Europe and the Gulf and with the start of the working day in North America.",
      "We see that position as practical, not decorative: it shapes coverage planning and how we communicate with clients across time zones.",
    ],
  },
};

/* ------------------------------------------------------------------------
 * Services overview — comparison
 * --------------------------------------------------------------------- */
export const comparisonRows: { label: string; values: Record<ServiceSlug, string> }[] = [
  {
    label: "What you hand over",
    values: {
      "content-moderation": "Review queues, reports and your content policy",
      "customer-support": "Inbound conversations and your support policies",
      "back-office": "Recurring administrative and data tasks",
      "ai-data-operations": "Datasets, a labeling schema and guidelines",
    },
  },
  {
    label: "What comes back",
    values: {
      "content-moderation": "Consistent, logged decisions and escalations",
      "customer-support": "Resolved tickets and insight into recurring issues",
      "back-office": "Verified records, delivered on schedule",
      "ai-data-operations": "Validated, structured data with a quality summary",
    },
  },
  {
    label: "Decisions that stay with you",
    values: {
      "content-moderation": "Policy, edge cases and appeals",
      "customer-support": "Refund limits, exceptions and technical faults",
      "back-office": "Approvals and anything outside procedure",
      "ai-data-operations": "Guideline definitions and acceptance thresholds",
    },
  },
  {
    label: "A typical first step",
    values: {
      "content-moderation": "Review a sample of decisions against your policy",
      "customer-support": "Classify recent tickets by type and complexity",
      "back-office": "Document one recurring process together",
      "ai-data-operations": "Run a calibrated pilot batch",
    },
  },
];
