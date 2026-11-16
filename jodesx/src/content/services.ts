import type { Service, ServiceSlug } from "./types";

const contentModeration: Service = {
  slug: "content-moderation",
  name: "Content Moderation",
  href: "/services/content-moderation",
  tagline: "Human review for the content your platform carries.",
  summary: "Review queues, policy enforcement and escalations, handled by trained moderators against your guidelines.",
  meta: {
    title: "Content Moderation Services",
    description:
      "Outsourced content moderation from JoDesx: live and community moderation, user-generated content review, policy enforcement support and structured escalation, run against your guidelines.",
  },
  hero: {
    title: "Moderation that follows your policy, one decision at a time.",
    lead: "JoDesx moderators review user-generated content against the guidelines you define, apply them consistently, and route the hard cases to the people who should decide them.",
  },
  problems: [
    "Review queues grow faster than your internal team can clear them.",
    "Reviewers interpret the same guideline in different ways.",
    "Ambiguous cases reach the wrong people, or no one at all.",
    "Policy updates take weeks to show up in day-to-day decisions.",
  ],
  capabilitiesTitle: "Moderation types",
  capabilities: [
    {
      title: "Live content moderation",
      body: "Monitoring of live and near-real-time content — chats, comments and streams — where the time to act is measured in minutes.",
    },
    {
      title: "Community moderation",
      body: "Keeping forums, groups and comment sections inside your community rules, with a consistent tone when moderators step in.",
    },
    {
      title: "User-generated content review",
      body: "Profiles, listings, images, text and reviews checked before or after publication, depending on where risk sits for you.",
    },
    {
      title: "Policy enforcement support",
      body: "Applying the actions your policy specifies — remove, restrict, label or warn — and recording the reason for each one.",
    },
    {
      title: "Trust and safety operations",
      body: "Report queues, account reviews and repeat-violation tracking, working under the direction of your trust and safety team.",
    },
    {
      title: "Escalation handling",
      body: "Ambiguous, sensitive or high-risk items are routed to your designated contacts with the context they need to decide quickly.",
    },
  ],
  workflowIntro:
    "Every item follows the same path, so decisions can be traced back to the guideline that produced them.",
  workflow: [
    {
      id: "intake",
      label: "Content intake",
      summary: "Items enter a prioritized queue.",
      detail:
        "Content arrives from your tools — report queues, pre-publication holds or live streams — and is ordered by the priority rules agreed during setup, so time-sensitive items are seen first.",
      checkpoint: "Queue priority matches the agreed rules.",
    },
    {
      id: "review",
      label: "Review",
      summary: "A trained moderator examines the item.",
      detail:
        "The moderator reviews the content and its context — account history, surrounding conversation, prior actions — before forming a decision.",
      checkpoint: "Full context considered before deciding.",
    },
    {
      id: "policy",
      label: "Policy assessment",
      summary: "The decision is mapped to your guideline.",
      detail:
        "Each decision references the specific policy clause it applies. Where the guideline does not clearly cover the case, the item is not guessed at — it is escalated.",
      checkpoint: "Every action cites a policy reference.",
      branch: {
        label: "Escalation if needed",
        detail:
          "Edge cases, sensitive material and potential legal issues go to your designated escalation contacts, with the content, context and the moderator's notes attached.",
      },
    },
    {
      id: "action",
      label: "Action",
      summary: "The agreed enforcement action is applied.",
      detail:
        "The moderator applies the action your policy specifies and records it, so you have an audit trail for appeals and reporting.",
      checkpoint: "Action logged with reason and reviewer.",
    },
    {
      id: "resolution",
      label: "Resolution",
      summary: "Closed, sampled and reported.",
      detail:
        "Resolved items are sampled for second review. Disagreements feed calibration sessions and, where needed, proposed clarifications to your guidelines.",
      checkpoint: "Sample reviewed; trends reported.",
    },
  ],
  qualityTitle: "How consistency is protected",
  quality: [
    {
      title: "Calibration, not assumption",
      body: "Moderators review the same sample cases together on a regular cadence, so the team converges on one reading of each guideline.",
    },
    {
      title: "Sampled second review",
      body: "A portion of completed decisions is re-reviewed. The sample size is agreed with you and adjusted to the risk of the queue.",
    },
    {
      title: "A visible guideline history",
      body: "Policy changes are logged with an effective date, so every decision can be read against the rules that applied when it was made.",
    },
    {
      title: "Sustainable review work",
      body: "Moderation shifts are planned with rotation and breaks in mind. Consistent judgment depends on people who are not overexposed.",
    },
  ],
  useCases: [
    { title: "Social and community platforms", body: "Posts, comments, groups and user reports." },
    { title: "Marketplaces and classifieds", body: "Listings, seller profiles, reviews and prohibited items." },
    { title: "Dating and social discovery", body: "Profile review, photo checks and safety reports." },
    { title: "Gaming communities", body: "In-game chat, forums and player reports." },
    { title: "Streaming and creator platforms", body: "Live chat and comment moderation alongside broadcasts." },
  ],
  engagement: [
    { title: "Dedicated moderation team", body: "A consistent group of moderators assigned to your platform and trained on your policies." },
    { title: "Queue overflow support", body: "Additional review capacity for backlog reduction or seasonal volume." },
    { title: "Extended coverage hours", body: "Coverage across the hours your internal team is offline, agreed during scoping." },
  ],
  faqs: [
    {
      question: "Whose guidelines do moderators follow?",
      answer:
        "Yours. Moderators are trained on your platform's policies. If your guidelines are still informal, we can help you structure them into clear reviewer guidance before operations begin — the final decisions on policy stay with you.",
    },
    {
      question: "What happens with cases the guideline does not cover?",
      answer:
        "They are escalated, not guessed. Escalation paths, contacts and expected response times are defined during setup, and each escalated item carries the moderator's notes and context.",
    },
    {
      question: "Can moderation run outside our business hours?",
      answer:
        "Coverage hours are agreed during scoping, based on when your content volume actually arrives and on team availability. We confirm what we can staff before committing to it.",
    },
    {
      question: "How is exposure to harmful content handled?",
      answer:
        "Shift structure, rotation between queue types and break planning are part of how moderation work is organized. Specific measures are discussed openly during scoping for queues with high exposure.",
    },
  ],
  cta: {
    title: "Describe your review queues.",
    body: "Tell us what you moderate, how much arrives and where decisions currently slow down. We'll come back with a proposed structure.",
  },
};

const customerSupport: Service = {
  slug: "customer-support",
  name: "Customer Support",
  href: "/services/customer-support",
  tagline: "Support conversations, handled the way you would handle them.",
  summary: "Email, chat and ticket support delivered inside your help desk, in your tone, against your policies.",
  meta: {
    title: "Outsourced Customer Support",
    description:
      "Outsourced customer support from JoDesx: email, live chat and ticket management delivered inside your help desk, with documented response standards and quality review.",
  },
  hero: {
    title: "Customer support that answers in your voice.",
    lead: "JoDesx support teams work inside your existing help desk, follow your tone and policies, and keep every inquiry moving from first response to resolution.",
  },
  problems: [
    "Response times stretch whenever volume rises.",
    "Your product or operations team spends its days answering tickets.",
    "Answers vary depending on who picks up the conversation.",
    "Customers in other time zones wait overnight for a reply.",
  ],
  capabilitiesTitle: "Support capabilities",
  capabilities: [
    {
      title: "Email support",
      body: "Clear, complete written replies that resolve the question in as few exchanges as possible.",
    },
    {
      title: "Live chat support",
      body: "Real-time conversations on your website or app, with handover rules for anything that needs your team.",
    },
    {
      title: "Ticket management",
      body: "Triage, tagging, prioritization and follow-up inside your help desk, so nothing sits unassigned.",
    },
    {
      title: "Customer inquiry handling",
      body: "Order, account and general product questions handled within the permissions you define.",
    },
    {
      title: "Customer experience support",
      body: "Follow-ups, feedback collection and review responses that close the loop after the ticket is solved.",
    },
    {
      title: "Multilingual support",
      body: "Additional languages can be scoped where qualified team members are available. We confirm language coverage before committing to it.",
    },
  ],
  channels: {
    title: "Channels",
    items: ["Email", "Live chat", "Help desk tickets", "In-app messaging", "Social messaging inboxes"],
  },
  workflowIntro: "A ticket's path is defined before the first reply is sent — including where it leaves our hands.",
  workflow: [
    {
      id: "inquiry",
      label: "Incoming inquiry",
      summary: "A message arrives on any agreed channel.",
      detail:
        "Inquiries arrive in your help desk from email, chat or messaging. Nothing is handled outside your systems, so your team keeps full visibility.",
      checkpoint: "Every inquiry is logged as a ticket.",
    },
    {
      id: "classify",
      label: "Classification",
      summary: "Tagged by topic, urgency and owner.",
      detail:
        "The agent identifies what the customer needs, tags it for reporting and decides whether it can be resolved at this level or needs your team.",
      checkpoint: "Correct tag and priority applied.",
      branch: {
        label: "Handover to your team",
        detail:
          "Requests outside the agreed scope — refunds above a threshold, technical faults, legal questions — are handed to your team with a summary, so the customer never has to repeat themselves.",
      },
    },
    {
      id: "respond",
      label: "Response workflow",
      summary: "Answered from your knowledge base and policies.",
      detail:
        "Replies follow your documented policies, macros and tone guide. Where the knowledge base is missing an answer, the gap is recorded so it can be fixed once.",
      checkpoint: "Reply matches policy and tone guide.",
    },
    {
      id: "qa",
      label: "Quality review",
      summary: "Conversations are sampled and scored.",
      detail:
        "A sample of conversations is scored against an agreed rubric — accuracy, completeness, tone and policy adherence — and feedback goes back to the agent.",
      checkpoint: "Sample scored against the rubric.",
    },
    {
      id: "resolve",
      label: "Resolution",
      summary: "Solved, confirmed and reported.",
      detail:
        "The ticket is closed when the customer's issue is resolved, not just answered. Volumes, response times and recurring issues are summarized in regular reporting.",
      checkpoint: "Resolved status confirmed.",
    },
  ],
  qualityTitle: "Quality principles",
  quality: [
    {
      title: "Written standards before the first ticket",
      body: "Tone, response structure and policy boundaries are documented during setup, so quality is measured against something specific.",
    },
    {
      title: "Accuracy over speed",
      body: "Response-time targets matter, but a fast wrong answer creates a second ticket. Targets are set with both in view.",
    },
    {
      title: "A knowledge base that improves",
      body: "Unanswered questions and outdated macros are reported back, so your documentation gets better as the team works.",
    },
    {
      title: "Clean handovers",
      body: "When a conversation needs your team, it arrives with a summary and the customer's history — not a forwarded thread.",
    },
  ],
  useCases: [
    { title: "E-commerce and direct-to-consumer brands", body: "Order status, returns, delivery questions and product inquiries." },
    { title: "Software and SaaS products", body: "First-line support, account questions and onboarding help." },
    { title: "Marketplaces and platforms", body: "Buyer and seller support across both sides of the platform." },
    { title: "Subscription services", body: "Billing questions, plan changes and retention conversations within your rules." },
    { title: "Travel and booking services", body: "Booking changes, confirmations and pre-trip questions." },
  ],
  engagement: [
    { title: "Dedicated support team", body: "A consistent team that learns your product and customers over time." },
    { title: "Overflow and peak coverage", body: "Extra capacity for launches, promotions or seasonal peaks." },
    { title: "After-hours coverage", body: "Responses during the hours your in-house team is offline." },
  ],
  faqs: [
    {
      question: "Do you work in our existing help desk?",
      answer:
        "Yes. The team works inside the tools you already use, with accounts and permissions you control. Your data and conversation history stay in your systems.",
    },
    {
      question: "How do agents learn our product?",
      answer:
        "Through your documentation, a structured onboarding period and supervised early tickets. Where documentation is thin, we work with you to fill the gaps before volume is handed over.",
    },
    {
      question: "Which languages can you support?",
      answer:
        "Language coverage depends on team availability and is confirmed during scoping. We will not commit to a language we cannot staff properly.",
    },
    {
      question: "What can agents do without asking us?",
      answer:
        "Exactly what you authorise. Refund limits, account changes and exceptions are defined in writing, and everything outside those limits is handed to your team.",
    },
  ],
  cta: {
    title: "Tell us how your support runs today.",
    body: "Share your channels, typical volumes and the questions that take up the most time. We'll propose how a JoDesx team would fit in.",
  },
};

const backOffice: Service = {
  slug: "back-office",
  name: "Back-Office Operations",
  href: "/services/back-office",
  tagline: "The repeatable work that keeps everything else running.",
  summary: "Administrative support, data handling and documentation workflows, run to documented procedures.",
  meta: {
    title: "Back-Office Outsourcing",
    description:
      "Back-office outsourcing from JoDesx: administrative support, data entry and processing, documentation workflows, records organization and order processing — run to documented procedures.",
  },
  hero: {
    title: "Back-office work, done accurately and on schedule.",
    lead: "JoDesx takes on structured, repeatable operational tasks — from data entry to order processing — and runs them to documented procedures with verification built in.",
  },
  problems: [
    "Skilled people spend hours on data entry and admin.",
    "Records live in too many places and drift out of date.",
    "Processes depend on one person who knows how it works.",
    "Errors surface downstream, long after the work was done.",
  ],
  capabilitiesTitle: "What we handle",
  capabilities: [
    { title: "Administrative support", body: "Inbox management, scheduling, document preparation and the daily coordination that keeps teams moving." },
    { title: "Data entry", body: "Accurate entry of records from forms, documents and systems into the places your business relies on." },
    { title: "Data processing", body: "Cleaning, formatting, de-duplicating and transforming data so it is usable for reporting and operations." },
    { title: "Documentation workflows", body: "Creating, updating and filing documents to a consistent structure, with version history you can follow." },
    { title: "Records organization", body: "Bringing scattered records into an agreed structure — and keeping them there." },
    { title: "Order processing support", body: "Order entry, status updates, exception follow-ups and the admin around fulfilment." },
    { title: "Operational coordination", body: "Status tracking, vendor follow-ups and recurring checklists that would otherwise fall between roles." },
  ],
  workflowIntro: "Each task type gets a written procedure. The procedure, not memory, is what the team follows.",
  workflow: [
    {
      id: "intake",
      label: "Task intake",
      summary: "Work arrives through an agreed channel.",
      detail:
        "Tasks come in through a defined route — shared inbox, task board, file drop or your own system — with a clear owner and expected turnaround for each type.",
      checkpoint: "Task matches a documented procedure.",
    },
    {
      id: "process",
      label: "Data processing",
      summary: "The procedure is followed step by step.",
      detail:
        "The task is completed according to its standard operating procedure. Anything that doesn't fit the procedure is flagged as an exception rather than improvised.",
      checkpoint: "Exceptions flagged, not guessed.",
      branch: {
        label: "Exception reported",
        detail:
          "Missing information, conflicting records or unusual requests are returned to your designated contact with a clear question, and tracked until answered.",
      },
    },
    {
      id: "verify",
      label: "Verification",
      summary: "Output is checked against the source.",
      detail:
        "Entered or processed data is checked against its source. Verification depth is matched to the risk of the task — higher for financial data, lighter for routine filing.",
      checkpoint: "Output matches source records.",
    },
    {
      id: "qa",
      label: "Quality review",
      summary: "A sample is reviewed independently.",
      detail:
        "A second person reviews a sample of completed work. Error patterns lead to procedure updates, not just individual corrections.",
      checkpoint: "Error rate tracked by task type.",
    },
    {
      id: "complete",
      label: "Completion",
      summary: "Delivered, logged and reported.",
      detail:
        "Completed work is delivered where agreed, logged with a timestamp and summarized in regular reporting on volume, turnaround and exceptions.",
      checkpoint: "Turnaround and volume reported.",
    },
  ],
  qualityTitle: "Accuracy principles",
  quality: [
    { title: "Procedures are written down", body: "Every recurring task has a standard operating procedure that a new team member could follow." },
    { title: "Checks sized to the risk", body: "Verification effort goes where an error would cost the most, rather than being spread evenly." },
    { title: "Exceptions are surfaced", body: "When something doesn't fit, the team asks. Silent workarounds are how records drift." },
    { title: "Least access needed", body: "Team members are given access only to the systems and data each task requires." },
  ],
  useCases: [
    { title: "E-commerce operations", body: "Product data, order admin and marketplace listings upkeep." },
    { title: "Logistics and supply chain", body: "Shipment records, documentation and status updates." },
    { title: "Professional services firms", body: "Document preparation, client records and scheduling." },
    { title: "Property management", body: "Tenant records, maintenance requests and document filing." },
    { title: "Finance operations support", body: "Invoice data entry and reconciliation preparation — administrative work, not financial advice." },
  ],
  engagement: [
    { title: "Dedicated operations team", body: "A team that owns a defined set of recurring processes." },
    { title: "Project-based processing", body: "One-off work such as data migration, clean-up or backlog clearance." },
    { title: "Flexible task capacity", body: "Additional hands for recurring peaks such as month-end." },
  ],
  faqs: [
    {
      question: "What if our processes aren't documented?",
      answer:
        "That's common. Part of the setup phase is documenting each process with you, step by step, before the team takes it over. You keep the documentation.",
    },
    {
      question: "How do you protect access to our systems?",
      answer:
        "Access is granted by you, per person and per system, limited to what each task requires. You can review and revoke it at any time. Specific security requirements are agreed in writing during scoping.",
    },
    {
      question: "Can we start with one process?",
      answer:
        "Yes, and it's often the best way to begin. One well-defined process shows how the team works before more is handed over.",
    },
  ],
  cta: {
    title: "Which tasks are taking your team's time?",
    body: "List the recurring work you'd like to hand over. We'll help you work out what is ready to transfer and what needs documenting first.",
  },
};

const aiDataOperations: Service = {
  slug: "ai-data-operations",
  name: "AI Data Operations",
  href: "/services/ai-data-operations",
  tagline: "Human judgment, structured for AI training data.",
  summary: "Annotation, labeling, text evaluation and data quality review, run by people following your guidelines.",
  meta: {
    title: "AI Data Annotation and Labeling Services",
    description:
      "Human-in-the-loop AI data operations from JoDesx: data annotation, labeling, text evaluation, data quality review and training data preparation, with validation in every batch.",
  },
  hero: {
    title: "Careful human work behind better training data.",
    lead: "JoDesx teams annotate, label, evaluate and review data for AI projects — following your guidelines, with validation and quality review built into every batch.",
  },
  problems: [
    "Labeling quality varies too much to trust the dataset.",
    "Your ML engineers spend their time on annotation instead of modeling.",
    "Guidelines change faster than the annotation team adapts.",
    "Model outputs need human evaluation at a volume you can't staff.",
  ],
  capabilitiesTitle: "What the work includes",
  capabilities: [
    { title: "Data annotation", body: "Marking up text and other data types according to your project schema, with consistent application of edge-case rules." },
    { title: "Data labeling and categorization", body: "Assigning labels and categories at scale, with clear handling of ambiguous items." },
    { title: "Text evaluation", body: "Rating and comparing written outputs for accuracy, relevance, tone and guideline adherence." },
    { title: "Data quality review", body: "Auditing existing datasets for label errors, inconsistencies and gaps." },
    { title: "Training data preparation", body: "Cleaning, formatting and structuring data so it is ready for your pipeline." },
    { title: "Human-in-the-loop review", body: "Human checkpoints inside automated pipelines — reviewing low-confidence items, exceptions and samples." },
  ],
  workflowIntro: "Each batch passes through validation before it leaves us, so you receive data you can use, not data you need to check.",
  workflow: [
    {
      id: "intake",
      label: "Data intake",
      summary: "Batches arrive with guidelines and schema.",
      detail:
        "Data is received through the method you specify, together with the labeling schema and annotation guidelines. Unclear guideline points are raised before work starts.",
      checkpoint: "Guidelines confirmed for the batch.",
    },
    {
      id: "annotate",
      label: "Annotation",
      summary: "Annotators apply your schema.",
      detail:
        "Trained annotators label or evaluate each item according to the guidelines. Items the guidelines don't resolve are flagged for clarification rather than labelled inconsistently.",
      checkpoint: "Ambiguous items flagged.",
      branch: {
        label: "Guideline clarification",
        detail:
          "Recurring ambiguities are collected and sent to your team as specific questions. Answers are added to the guidelines and applied to the rest of the batch.",
      },
    },
    {
      id: "validate",
      label: "Validation",
      summary: "Checked against known answers.",
      detail:
        "Work is checked against gold-standard items and, where the project calls for it, overlapping annotations to measure agreement between annotators.",
      checkpoint: "Agreement and accuracy measured.",
    },
    {
      id: "qa",
      label: "Quality review",
      summary: "Reviewers audit a sample.",
      detail:
        "Experienced reviewers audit a sample of each batch. Systematic errors trigger re-training and, where needed, re-work of affected items.",
      checkpoint: "Batch meets agreed thresholds.",
    },
    {
      id: "output",
      label: "Structured output",
      summary: "Delivered in your format.",
      detail:
        "The batch is delivered in the agreed format with a short quality summary: volumes, agreement measures, open questions and guideline changes applied.",
      checkpoint: "Format and summary delivered.",
    },
  ],
  qualityTitle: "How quality is built in",
  quality: [
    { title: "Guidelines first", body: "Annotators are trained and tested on your guidelines before production work, not during it." },
    { title: "Gold-standard checks", body: "Known-answer items are mixed into the work to measure accuracy continuously." },
    { title: "Agreement is measured", body: "Where it matters, overlapping annotations show whether the guideline is being read the same way by everyone." },
    { title: "Feedback reaches the guideline", body: "Patterns in errors are treated as signals that a guideline needs clarifying, not only as individual mistakes." },
  ],
  useCases: [
    { title: "AI product teams", body: "Evaluation and labeling for features built on language models." },
    { title: "Machine learning teams", body: "Annotation capacity alongside in-house data work." },
    { title: "Data and research teams", body: "Dataset audits, categorization and structured review." },
    { title: "Data service providers", body: "Additional, guideline-trained capacity for active projects." },
  ],
  engagement: [
    { title: "Pilot batch", body: "A defined sample to calibrate guidelines and measure quality before scaling." },
    { title: "Ongoing annotation team", body: "A trained team for continuous labeling or evaluation work." },
    { title: "Dataset audit project", body: "A one-off review of an existing dataset's quality." },
  ],
  note: "JoDesx does not build or train AI models. We provide the human operations that AI teams rely on.",
  faqs: [
    {
      question: "Do you use your own annotation platform?",
      answer:
        "No. The team works in the tools your project uses — your own platform or the labeling tool you have chosen. That keeps your data in your environment.",
    },
    {
      question: "Which data types can you work with?",
      answer:
        "Text-based work — classification, evaluation, extraction and categorization — is the core. Other data types can be discussed during scoping, and we will be clear about what the team is ready for.",
    },
    {
      question: "How do you start a new annotation project?",
      answer:
        "Usually with a pilot batch. It tests the guidelines, establishes quality baselines and shows you real output before any larger commitment.",
    },
  ],
  cta: {
    title: "Share your annotation brief.",
    body: "Describe the data, the task and the quality you need. We'll suggest how to structure a pilot.",
  },
};

export const services: Service[] = [contentModeration, customerSupport, backOffice, aiDataOperations];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: ServiceSlug): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as string[]).includes(value);
}
