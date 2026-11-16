import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "How the JoDesx website collects, uses and protects personal information submitted through it.",
  path: "/privacy",
});

const LAST_UPDATED = "16 November 2026";

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "scope",
    title: "1. Who this policy covers",
    body: (
      <>
        <p>
          This policy explains how JoDesx (&ldquo;JoDesx&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information collected through
          this website. JoDesx is a business operations company based in Jordan.
        </p>
        <p>
          It covers visitors to the website and people who contact us through it. Personal information we process on behalf of clients during
          an engagement is governed by the agreement with that client, not by this policy.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "2. Information we collect",
    body: (
      <>
        <p>
          <strong>Information you give us.</strong> When you submit the inquiry form, we collect your name, work email address, company name,
          the service you are interested in, the description of your requirements, optional details about team size and timing, your preferred
          contact method and, if you choose phone, your phone number.
        </p>
        <p>
          <strong>Technical information.</strong> Like most websites, our hosting provider automatically processes basic technical data — such as
          IP address, browser type and the pages requested — to deliver the site securely and to protect it against abuse. The inquiry form
          uses your IP address briefly to limit repeated automated submissions.
        </p>
        <p>
          <strong>What we do not collect.</strong> This website does not use advertising or analytics cookies, tracking pixels or third-party
          analytics scripts.
        </p>
      </>
    ),
  },
  {
    id: "candidates",
    title: "3. Job applicants",
    body: (
      <>
        <p>
          When you apply for a role, we collect your name, email address, phone number, city and country, the languages you speak, your
          availability, any profile link you provide, your message, and your CV.
        </p>
        <p>
          We use this information only to assess your application, contact you about it and, with open applications, consider you for future
          roles. Applications are delivered to the people at JoDesx responsible for hiring and are not shared with clients without your
          permission. We keep applicant information no longer than necessary for recruitment, and you can ask us to delete it at any time.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "4. How we use it",
    body: (
      <ul>
        <li>To read and respond to your inquiry, and to arrange a conversation you have asked for.</li>
        <li>To prepare a proposal if you ask us to.</li>
        <li>To keep the website secure and prevent spam and misuse.</li>
        <li>To meet legal obligations that apply to us.</li>
      </ul>
    ),
  },
  {
    id: "basis",
    title: "5. Legal basis",
    body: (
      <p>
        Where data protection law requires a legal basis, we rely on your consent (given when you submit the form), on steps taken at your
        request before entering into a contract, and on our legitimate interest in operating a secure website and responding to business
        inquiries.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "6. Sharing",
    body: (
      <>
        <p>We do not sell personal information or share it for advertising.</p>
        <p>
          We use a small number of service providers to run this website and deliver inquiries to our team — for example our hosting provider
          and the email or workflow service that forwards form submissions. They process information only on our instructions. We may also
          disclose information where the law requires it.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "7. International transfers",
    body: (
      <p>
        Because we work with businesses internationally and use service providers that may operate in other countries, your information may be
        processed outside the country where you live. Where required, we take steps to ensure appropriate safeguards are in place.
      </p>
    ),
  },
  {
    id: "retention",
    title: "8. How long we keep it",
    body: (
      <p>
        We keep inquiry information for as long as needed to respond and to follow up on the conversation. If we begin working together, related
        information is kept for the duration of the relationship and afterwards only as long as required for legal or accounting purposes.
        Otherwise, we delete inquiry information when it is no longer needed.
      </p>
    ),
  },
  {
    id: "security",
    title: "9. Security",
    body: (
      <p>
        The website is served over an encrypted connection, form submissions are validated on our server, and access to inquiry information is
        limited to the people who need it to respond. No method of transmission or storage is completely secure, but we work to protect your
        information appropriately.
      </p>
    ),
  },
  {
    id: "rights",
    title: "10. Your rights",
    body: (
      <p>
        Depending on where you live, you may have the right to access, correct or delete the personal information we hold about you, to object to
        or restrict its use, to withdraw consent, and to complain to a data protection authority. To make a request, contact us using the details
        below.
      </p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact",
    body: site.contactEmail ? (
      <p>
        For privacy questions or requests, email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    ) : (
      <p>
        For privacy questions or requests, contact us through the <a href="/contact">inquiry form</a> and mention &ldquo;privacy&rdquo; in your
        message.
      </p>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to this policy",
    body: <p>We may update this policy as the website or our practices change. The date at the top shows when it was last revised.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="surface-dark pt-[calc(var(--header-h)+3.5rem)] pb-14">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Privacy policy", path: "/privacy" },
            ]}
          />
          <h1 className="type-display-lg mt-10">Privacy policy</h1>
          <p className="mt-4 text-fg-muted">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>
      <div className="surface-light section-pad !pt-14">
        <div className="container-site grid gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="Policy sections" className="hidden lg:block">
            <ul className="sticky top-28 grid gap-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-fg-muted hover:text-fg">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <article className="legal-prose max-w-[68ch]">
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
