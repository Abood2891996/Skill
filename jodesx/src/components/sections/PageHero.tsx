import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils/cn";

interface PageHeroProps {
  title: string;
  lead: string;
  crumbs?: Crumb[];
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Dark introductory band for inner pages, with breadcrumb and optional visual. */
export function PageHero({ title, lead, crumbs, aside, children, className }: PageHeroProps) {
  return (
    <section className={cn("surface-dark relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-24", className)}>
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div className="container-site relative">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={cn("mt-10 grid gap-12", Boolean(aside) && "lg:grid-cols-[1.25fr_1fr] lg:items-end")}>
          <div>
            <h1 className="type-display-xl max-w-4xl">{title}</h1>
            <p className="type-lead mt-7 max-w-2xl">{lead}</p>
            {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
          </div>
          {aside && <div className="relative">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
