/**
 * Site-wide configuration. Values that depend on business facts not yet
 * confirmed (domain, public email, legal entity) are read from environment
 * variables — see .env.example and docs/DEPLOYMENT.md.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.jodesx.com";

export const site = {
  name: "JoDesx",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "en",
  /** Public business email. Empty string hides it everywhere. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  country: "Jordan",
  /** Registered legal entity that operates JoDesx (as provided by the owner, 17 Nov 2026). */
  legal: {
    name: "شركة قلب التقنية المعلوماتية لأنشطة مراكز الاتصال و خدمات الحاسوب و المعلومات /ذات مسؤولية محدودة",
    form: "a limited liability company registered in the Hashemite Kingdom of Jordan",
    country: "the Hashemite Kingdom of Jordan",
  },
  /** Official social profiles (also published as Organization "sameAs" for search engines). */
  social: {
    linkedin: "https://www.linkedin.com/company/jodesx/",
  },
  /** Mailbox (Zoho alias) for privacy requests. */
  privacyEmail: "privacy@jodesx.com",
  description:
    "JoDesx is a Jordan-based business operations company that builds and runs structured operational teams — remote or on-site at its offices in Jordan — for call center, customer support, content moderation, back-office and AI data operations, in Arabic and English.",
  positioning: "Operational support, intelligently connected.",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
