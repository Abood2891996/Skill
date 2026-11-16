import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Inline navigational link with the signal underline. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("link-signal", className)}>
      {children}
      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}
