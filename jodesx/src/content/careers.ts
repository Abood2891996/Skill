import type { Faq, TextBlock } from "./types";

/** Copy for /careers. Job postings themselves live in src/content/jobs/*.md. */

export const careersHero = {
  title: "Do careful work for companies around the world — from Jordan.",
  lead: "JoDesx teams moderate content, support customers, run back-office processes and prepare AI training data for international businesses. We give you the training, clear procedures and support to do that work well — and to grow while you do it.",
};

export const reasonsToJoin: (TextBlock & { icon: "training" | "clarity" | "feedback" | "global" | "wellbeing" | "growth" })[] = [
  {
    icon: "training",
    title: "Trained before you start",
    body: "Every role begins with structured onboarding on the client's product, policies and tools. You start with supervised work, not a deep end.",
  },
  {
    icon: "clarity",
    title: "Clear procedures, not guesswork",
    body: "Written guidelines for every task and a defined path for anything unusual. You always know what good looks like — and who to ask.",
  },
  {
    icon: "feedback",
    title: "Feedback that makes you better",
    body: "Regular quality reviews and calibration sessions show you exactly where you're strong and what to sharpen next.",
  },
  {
    icon: "global",
    title: "International experience, close to home",
    body: "Work with businesses from around the world and build the skills global companies look for — without leaving Jordan.",
  },
  {
    icon: "wellbeing",
    title: "Work designed to be sustainable",
    body: "Schedules are planned with breaks and rotation in mind — especially in content moderation, where wellbeing is part of doing the job well.",
  },
  {
    icon: "growth",
    title: "Room to grow",
    body: "As engagements grow, so do the roles around them: quality review, training, and team leadership are built from people who know the work.",
  },
];

export const whatWeLookFor: TextBlock[] = [
  { title: "Careful readers", body: "You notice detail and read context before deciding." },
  { title: "Clear writers", body: "You explain things simply — to customers, colleagues and clients." },
  { title: "Reliable", body: "People can count on you to show up, follow through and ask when unsure." },
  { title: "Curious", body: "You want to understand why a process works, and how it could work better." },
];

export const hiringSteps = [
  { title: "Apply", body: "Choose a role and send your application. It takes about five minutes." },
  { title: "Application review", body: "A person on our team reads every application against the role's requirements." },
  { title: "Skills assessment", body: "A short task based on the real work — so you can show what you can do." },
  { title: "Interview", body: "A video conversation about the role, your experience and your questions." },
  { title: "Offer", body: "If it's a match, you receive an offer with the role, schedule and terms in writing." },
  { title: "Training and start", body: "Structured onboarding before you take on live work." },
];

export const careersFaqs: Faq[] = [
  {
    question: "Do I need previous experience?",
    answer:
      "Not always. Many roles value careful judgment, strong English and reliability more than a specific background. Each posting lists what is required and what is a bonus.",
  },
  {
    question: "Are the roles remote or on-site?",
    answer: "Each posting states its workplace — remote, on-site or hybrid — and location. Remote roles need a reliable computer and internet connection.",
  },
  {
    question: "Can I apply for more than one role?",
    answer: "Yes. Apply to each role that fits you. If nothing fits right now, send an open application and we'll consider you for future roles.",
  },
  {
    question: "Will I hear back?",
    answer: "Every application is read by a person. If your profile matches the role, we'll contact you about the next step using the details you provide.",
  },
  {
    question: "What happens to my CV and personal details?",
    answer:
      "They are used only for recruitment at JoDesx and kept for up to six months from the date we receive them, then deleted. If you join us, they become part of your employment records. You can ask us to delete them sooner at any time. See the privacy policy for details.",
  },
];
