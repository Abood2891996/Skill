import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary";

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", size = "md", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn("btn", variant === "primary" ? "btn-primary" : "btn-secondary", size === "sm" && "btn-sm", className)} {...props}>
      {children}
    </Link>
  );
}
