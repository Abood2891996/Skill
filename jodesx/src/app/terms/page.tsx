import Link from "next/link";
import { LegalDocument, LegalEntityName, type LegalSection } from "@/components/legal/LegalDocument";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms of Use",
  description: "The terms that apply when you use the JoDesx website, send an inquiry or apply for a job.",
  path: "/terms",
});

const LAST_UPDATED = "17 November 2026";

const summary = (
  <>
    <h2>The short version</h2>
    <ul>
      <li>Use the website lawfully and don&rsquo;t try to harm it or misuse its forms.</li>
      <li>The website describes our services; an actual engagement is always agreed in a separate written contract.</li>
      <li>Sending an inquiry or a job application does not create a contract or an offer of employment.</li>
      <li>Our name, logo and content belong to us; please ask before reusing them.</li>
      <li>These terms are governed by the laws of Jordan.</li>
    </ul>
  </>
);

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms apply to your use of <strong>www.jodesx.com</strong> (the &ldquo;website&rdquo;). The website is operated by the following
          company, {site.legal.form}, trading as JoDesx (&ldquo;JoDesx&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;):
          <LegalEntityName />
        </p>
        <p>By using the website, you agree to these terms. If you do not agree, please do not use the website.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "Using the website",
    body: (
      <>
        <p>You may use the website to learn about JoDesx, send us a business inquiry and apply for jobs. You agree not to:</p>
        <ul>
          <li>use the website in a way that breaks any law or the rights of others;</li>
          <li>send false, misleading or automated submissions, or submissions on someone else&rsquo;s behalf without their permission;</li>
          <li>upload files that contain malicious code or content you have no right to share;</li>
          <li>attempt to gain unauthorised access to the website, its systems or the information of other people;</li>
          <li>interfere with the website&rsquo;s operation, including by overloading it or by automated scraping that degrades it.</li>
        </ul>
        <p>We may limit or block access where we reasonably believe these terms are being broken.</p>
      </>
    ),
  },
  {
    id: "services",
    title: "Information about our services",
    body: (
      <>
        <p>
          The website gives general information about our services and how we work. It is not an offer that can be accepted, and it is not a
          guarantee of any particular result. Workflows and examples shown on the website — including the Operations Blueprint — are simplified
          illustrations.
        </p>
        <p>
          Any service we provide is subject to a separate written agreement that sets out its scope, responsibilities, fees and terms. If that
          agreement conflicts with the website, the agreement applies.
        </p>
      </>
    ),
  },
  {
    id: "submissions",
    title: "Inquiries and job applications",
    body: (
      <>
        <p>
          Please make sure the information you send us is accurate and that you are entitled to share it. Sending an inquiry does not create a
          contract or an obligation for either side. Sending a job application does not create an offer of employment; job postings may change or
          close at any time.
        </p>
        <p>
          How we handle the personal information in your submission is explained in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        The JoDesx name and logo, the website&rsquo;s design, text, graphics and code belong to us or are used with permission. You may view and
        share links to the website, but you may not copy, modify or reuse its content or branding for commercial purposes without our written
        permission.
      </p>
    ),
  },
  {
    id: "links",
    title: "Links to other websites",
    body: (
      <p>
        If the website links to other websites, those links are provided for convenience. We do not control those websites and are not responsible
        for their content or practices.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Disclaimer and limitation of liability",
    body: (
      <>
        <p>
          We work to keep the website accurate and available, but it is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We do not
          guarantee that it will always be uninterrupted, error-free or up to date.
        </p>
        <p>
          To the extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of the website, or for loss
          caused by relying on its general information. Nothing in these terms limits any liability that cannot be limited under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The date at the top shows when they were last revised. Continuing to use the website after a
        change means you accept the updated terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of {site.legal.country}. Any dispute relating to them will be handled by the competent courts of{" "}
        {site.legal.country}, unless the law of your country gives you a mandatory right to bring a claim elsewhere.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these terms? Use our <Link href="/contact">inquiry form</Link>. For privacy matters, email{" "}
        <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return <LegalDocument title="Terms of Use" path="/terms" lastUpdated={LAST_UPDATED} summary={summary} sections={sections} />;
}
