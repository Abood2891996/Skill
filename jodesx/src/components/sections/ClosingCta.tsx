import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogoSymbol } from "@/components/brand/Logo";

interface ClosingCtaProps {
  title: string;
  body: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/** The final conversion block: one confident statement and a clear next step. */
export function ClosingCta({
  title,
  body,
  primary = { label: "Start an inquiry", href: "/contact" },
  secondary,
}: ClosingCtaProps) {
  return (
    <section aria-labelledby="closing-title" className="surface-dark relative overflow-hidden">
      <div aria-hidden="true" className="closing-lanes pointer-events-none absolute inset-0" />
      <div className="container-site relative section-pad">
        <div className="grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <LogoSymbol size={40} className="mb-8" />
            <h2 id="closing-title" className="type-display-lg max-w-3xl">
              {title}
            </h2>
            <p className="type-lead mt-6 max-w-xl">{body}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
