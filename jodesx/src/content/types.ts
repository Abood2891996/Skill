export type ServiceSlug = "content-moderation" | "customer-support" | "back-office" | "ai-data-operations";

export interface TextBlock {
  title: string;
  body: string;
}

export interface Faq {
  question: string;
  answer: string;
}

/** One step of a service workflow, rendered by the Operations Blueprint. */
export interface BlueprintStage {
  id: string;
  label: string;
  /** One-line description shown under the stage node. */
  summary: string;
  /** Longer explanation shown in the detail panel when the stage is selected. */
  detail: string;
  /** What is checked before work moves on. */
  checkpoint: string;
  /** Optional side path (e.g. escalation) that leaves this stage. */
  branch?: { label: string; detail: string };
}

export interface Service {
  slug: ServiceSlug;
  name: string;
  href: `/services/${ServiceSlug}`;
  /** Card headline used on overview grids. */
  tagline: string;
  /** One-sentence plain description. */
  summary: string;
  meta: { title: string; description: string };
  hero: { title: string; lead: string };
  /** Business problems this service addresses. */
  problems: string[];
  capabilitiesTitle: string;
  capabilities: TextBlock[];
  /** Optional channel / format list (e.g. support channels). */
  channels?: { title: string; items: string[] };
  workflow: BlueprintStage[];
  workflowIntro: string;
  qualityTitle: string;
  quality: TextBlock[];
  useCases: TextBlock[];
  engagement: TextBlock[];
  faqs: Faq[];
  note?: string;
  cta: { title: string; body: string };
}
