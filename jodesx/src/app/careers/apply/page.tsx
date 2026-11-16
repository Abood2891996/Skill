import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { GENERAL_APPLICATION } from "@/lib/validation/application";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Open Application — Careers",
  description: "Don't see the right role at JoDesx? Send an open application and we'll consider you for future positions.",
  path: "/careers/apply",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
  { name: "Open application", path: "/careers/apply" },
];

export default function OpenApplicationPage() {
  return (
    <>
      <div className="surface-dark relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-14">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
        <div className="container-site relative">
          <Breadcrumbs items={crumbs} />
          <h1 className="type-display-xl mt-10 max-w-4xl">Tell us who you are. We&rsquo;ll keep you in mind.</h1>
          <p className="type-lead mt-6 max-w-2xl">
            No matching role right now? Send an open application. When a role opens that fits your experience and languages, we&rsquo;ll be in touch.
          </p>
        </div>
      </div>
      <section className="surface-light section-pad !pt-14 sm:!pt-20" aria-label="Open application form">
        <div className="container-site">
          <div className="mx-auto max-w-3xl rounded-[var(--radius-xl)] border border-line bg-paper p-6 shadow-[0_30px_60px_-40px_rgb(11_18_32/0.35)] sm:p-10">
            <ApplicationForm job={GENERAL_APPLICATION} roleTitle="Open application" contactEmail={site.contactEmail} />
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
