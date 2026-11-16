import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogoSymbol } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <section className="surface-dark relative grid min-h-[80vh] place-items-center overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="container-site relative max-w-2xl text-center">
        <LogoSymbol size={56} className="mx-auto" />
        <h1 className="type-display-lg mt-8">This page isn&rsquo;t part of the workflow.</h1>
        <p className="type-lead mx-auto mt-5 max-w-lg">The address may have changed or never existed. These routes will get you back on track.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Go to the homepage</ButtonLink>
          <ButtonLink href="/services" variant="secondary">
            View services
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
