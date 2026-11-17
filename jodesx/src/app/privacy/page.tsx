import Link from "next/link";
import { LegalDocument, LegalEntityName, type LegalSection } from "@/components/legal/LegalDocument";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How JoDesx collects, uses, shares and protects personal information submitted through its website, including client inquiries and job applications.",
  path: "/privacy",
});

const LAST_UPDATED = "17 November 2026";
const email = site.privacyEmail;
const Email = () => <a href={`mailto:${email}`}>{email}</a>;

const summary = (
  <>
    <h2>The short version</h2>
    <ul>
      <li>We collect only what you send us through our two forms: a business inquiry or a job application.</li>
      <li>We use it to reply to you and, for applications, to assess you for a role. We never sell it or use it for advertising.</li>
      <li>This website uses no cookies, no analytics and no tracking tools.</li>
      <li>Job applications and CVs are kept for up to six months, then deleted.</li>
      <li>
        You can ask to see, correct or delete your information at any time: <Email />.
      </li>
    </ul>
  </>
);

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <p>
          JoDesx (&ldquo;JoDesx&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is the trading name of the following company, {site.legal.form}:
          <LegalEntityName />
          JoDesx provides business operations and outsourcing services.
        </p>
        <p>
          We are responsible for (the &ldquo;controller&rdquo; of) the personal information described in this policy. For any privacy question or
          request, contact us at <Email />.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <>
        <p>
          This policy covers personal information collected through <strong>www.jodesx.com</strong>: from visitors, from people who send us a
          business inquiry, and from people who apply for a job.
        </p>
        <p>
          It does not cover information we process on behalf of our clients while providing services to them. That processing is governed by the
          written agreement with each client.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "Information we collect",
    body: (
      <>
        <p>
          <strong>Business inquiries.</strong> Your name, work email address, company name, the service you are interested in, the description of
          your requirements, optional details about team size and timing, your preferred contact method and, if you choose phone, your phone
          number.
        </p>
        <p>
          <strong>Job applications.</strong> Your name, email address, phone number, city and country, the languages you speak, when you could
          start, an optional profile or portfolio link, your message, and your CV. Please do not include sensitive information in your CV (for
          example health, religion or identity numbers); we do not need it.
        </p>
        <p>
          <strong>Technical information.</strong> When you visit the website, our hosting provider processes basic technical data — such as your
          IP address, browser type and the pages requested — to deliver the site securely. Our forms use your IP address briefly to limit
          repeated automated submissions.
        </p>
        <p>
          We do not collect information from you through any other means on this website, and we do not buy personal information from third
          parties.
        </p>
      </>
    ),
  },
  {
    id: "candidates",
    title: "Job applicants",
    body: (
      <>
        <p>
          We use applicant information only to assess your application, to contact you about it and, for open applications, to consider you for
          suitable future roles. Applications are read by the people at JoDesx responsible for hiring and are not shared with clients without your
          permission.
        </p>
        <p>
          We keep applicant information, including your CV, for <strong>up to six months</strong> from the date we receive it, and then delete it.
          If you join JoDesx, the information you provided becomes part of your employment records. You can ask us to delete your application at
          any time before then.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "Why we use it, and our legal basis",
    body: (
      <>
        <p>Data protection laws require us to explain why we use your information and on what legal basis:</p>
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Legal basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Replying to your inquiry and arranging a conversation you asked for</td>
              <td>Your consent, and steps taken at your request before a possible contract</td>
            </tr>
            <tr>
              <td>Preparing a proposal or agreement with your company</td>
              <td>Steps taken at your request before entering into a contract</td>
            </tr>
            <tr>
              <td>Assessing job applications and contacting candidates</td>
              <td>Your consent, and steps taken at your request before a possible employment contract</td>
            </tr>
            <tr>
              <td>Keeping the website and forms secure and preventing spam and misuse</td>
              <td>Our legitimate interest in operating a safe website</td>
            </tr>
            <tr>
              <td>Meeting legal, tax or accounting obligations</td>
              <td>Legal obligation</td>
            </tr>
          </tbody>
        </table>
        <p>
          Where we rely on your consent, you can withdraw it at any time by emailing <Email />. Withdrawing consent does not affect processing that
          took place before.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    body: (
      <p>
        This website does not use cookies, analytics, advertising pixels or other tracking technologies, and it loads no third-party scripts or
        fonts. If this ever changes, we will update this policy first and, where the law requires it, ask for your consent.
      </p>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We do not sell personal information or share it for advertising. We use a small number of service providers to run this website:</p>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>What they do for us</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel Inc.</td>
              <td>Hosts the website and processes the technical data needed to serve it</td>
            </tr>
            <tr>
              <td>Resend</td>
              <td>Delivers inquiries and applications submitted through the website to our inbox</td>
            </tr>
            <tr>
              <td>Zoho Corporation</td>
              <td>Provides our email service, where inquiries and applications are received and stored</td>
            </tr>
          </tbody>
        </table>
        <p>
          These providers process information only on our instructions and are bound by their own data protection commitments. We may also
          disclose information if the law requires it, or to protect our rights or the safety of others.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        Our service providers may process your information in countries other than the one where you live, including the United States. Where the
        law requires it, we rely on appropriate safeguards for these transfers, such as the standard contractual clauses offered by our providers.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>
          <strong>Inquiries</strong> are kept for as long as needed to respond and follow up. If we begin working together, related information is
          kept for the duration of the relationship and afterwards only as long as required for legal or accounting purposes. Otherwise, we delete
          it when it is no longer needed.
        </p>
        <p>
          <strong>Job applications</strong> are kept for up to six months, as described in the &ldquo;Job applicants&rdquo; section.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        The website is served only over encrypted connections, form submissions are validated on our server, uploaded files are checked, and
        access to inquiries and applications is limited to the people who need it. No method
        of transmission or storage is completely secure, but we work to protect your information appropriately.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Depending on the law that applies to you — including Jordan&rsquo;s personal data protection law and, for people in the European Union or the United Kingdom, the GDPR — you may have the right to:</p>
        <ul>
          <li>know whether we hold information about you and receive a copy of it;</li>
          <li>correct information that is inaccurate or incomplete;</li>
          <li>ask us to delete your information;</li>
          <li>object to, or ask us to restrict, how we use it;</li>
          <li>receive your information in a portable format;</li>
          <li>withdraw your consent at any time;</li>
          <li>complain to the data protection authority in your country.</li>
        </ul>
        <p>
          To use any of these rights, email <Email />. We may need to confirm your identity before acting on a request. We aim to respond within
          one month.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is intended for businesses and for adults looking for work. We do not knowingly collect information from children. If you
        believe a child has sent us personal information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy when the website or our practices change. The date at the top shows when it was last revised. Significant changes
        will be highlighted on this page.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>
          For privacy questions or requests: <Email />.
        </p>
        <p>
          For anything else, use our <Link href="/contact">inquiry form</Link>.
        </p>
        <p>
          Controller (trading as JoDesx), registered in {site.legal.country}:
          <LegalEntityName />
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" path="/privacy" lastUpdated={LAST_UPDATED} summary={summary} sections={sections} />;
}
