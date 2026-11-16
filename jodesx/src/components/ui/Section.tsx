import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Surface = "dark" | "deep" | "light" | "paper";

const surfaceClass: Record<Surface, string> = {
  dark: "surface-dark",
  deep: "surface-dark surface-deep",
  light: "surface-light",
  paper: "surface-light surface-paper",
};

interface SectionProps {
  surface?: Surface;
  id?: string;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

/** A full-bleed section with a declared surface and the site container inside. */
export function Section({ surface = "light", id, labelledBy, className, innerClassName, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(surfaceClass[surface], "section-pad relative", className)}>
      <div className={cn("container-site relative", innerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  id: string;
  kicker?: string;
  title: string;
  lead?: ReactNode;
  className?: string;
  size?: "lg" | "md";
  as?: "h1" | "h2";
}

export function SectionHeader({ id, kicker, title, lead, className, size = "lg", as: Tag = "h2" }: SectionHeaderProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {kicker ? <p className="kicker mb-5">{kicker}</p> : null}
      <Tag id={id} className={size === "lg" ? "type-display-lg" : "type-display-md"}>
        {title}
      </Tag>
      {lead ? <div className="type-lead mt-5 prose-measure">{lead}</div> : null}
    </header>
  );
}
