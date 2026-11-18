import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/content/site";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "Contact — Start an Inquiry",
  description:
    "Tell JoDesx about the operational work you want to hand over — call center, customer support, content moderation, back-office or AI data operations — and start a conversation about scope.",
  path: "/contact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

const nextSteps = [
  { title: "We read your inquiry", body: "A person reviews what you've shared and notes the questions that shape scope." },
  { title: "A first conversation", body: "We talk through the work, volumes, tools and what success looks like for you." },
  { title: "A written outline", body: "If there's a fit, you receive a proposed structure: scope, team, workflow and reporting." },
];

export default function ContactPage() {
  return (
    <>
      <div className="surface-dark relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-14">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
        <div className="container-site relative">
          <Breadcrumbs items={crumbs} />
          <h1 className="type-display-xl mt-10 max-w-4xl">Tell us about the operation you want to run.</h1>
          <p className="type-lead mt-6 max-w-2xl">
            Share what you know now. Rough numbers are fine — the first conversation is where the details get worked out.
          </p>
        </div>
      </div>

      <section className="surface-light section-pad !pt-14 sm:!pt-20" aria-label="Inquiry form">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <aside className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <h2 className="type-title">What happens next</h2>
              <ol className="mt-6 grid gap-0 border-l border-line-strong">
                {nextSteps.map((s, i) => (
                  <li key={s.title} className="relative pb-8 pl-7 last:pb-0">
                    <span aria-hidden="true" className="absolute -left-[5px] top-1.5 size-[9px] bg-navy-900" />
                    <h3 className="font-semibold">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-1 text-fg-muted">{s.body}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-12 grid gap-4 border-t border-line pt-8 text-fg-muted">
                <p>
                  <span className="font-semibold text-fg">No obligation.</span> An inquiry is the start of a conversation, not a commitment.
                </p>
                <p>
                  <span className="font-semibold text-fg">Your details stay private.</span> They are used only to respond to you — see our{" "}
                  <a href="/privacy" className="underline underline-offset-4">
                    privacy policy
                  </a>
                  .
                </p>
                {site.contactEmail && (
                  <p>
                    Prefer email? Write to{" "}
                    <a className="font-medium text-fg underline underline-offset-4" href={`mailto:${site.contactEmail}`}>
                      {site.contactEmail}
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
          </aside>

          <div className="order-1 rounded-[var(--radius-xl)] border border-line bg-paper p-6 shadow-[0_30px_60px_-40px_rgb(11_18_32/0.35)] sm:p-10 lg:order-2">
            <Suspense fallback={<div className="min-h-[60rem]" aria-busy="true" />}>
              <ContactForm contactEmail={site.contactEmail} />
            </Suspense>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
