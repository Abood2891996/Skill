"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ServiceGlyph } from "@/components/services/ServiceGlyph";
import { primaryNav } from "@/content/navigation";
import { services } from "@/content/services";
import { cn } from "@/lib/utils/cn";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

/**
 * Full-height mobile navigation. Traps focus while open, closes on Escape,
 * locks page scroll, and returns focus to the toggle on close.
 */
export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const toggle = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]');
    const root = ref.current;
    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Cycle focus between the menu and its toggle button.
      const items = toggle ? [toggle, ...focusables()] : focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={ref}
      hidden={!open}
      className="mobile-menu surface-dark fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto border-t border-line bg-navy-900 lg:hidden"
    >
      <nav aria-label="Mobile" className="container-site flex min-h-full flex-col py-8">
        <p className="kicker mb-4">Services</p>
        <ul className="grid gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={s.href}
                aria-current={pathname === s.href ? "page" : undefined}
                className={cn(
                  "flex items-center gap-4 rounded-[var(--radius-md)] border border-line p-4",
                  pathname === s.href && "border-accent-text",
                )}
              >
                <ServiceGlyph slug={s.slug} size={32} className="flex-none" />
                <span className="font-semibold">{s.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/services" className="link-signal mt-2 text-sm">
              Compare all services
            </Link>
          </li>
        </ul>

        <ul className="mt-10 grid border-t border-line">
          {primaryNav.map((item) => (
            <li key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="type-title flex py-5 aria-[current=page]:text-accent-text"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <Link href="/contact" className="btn btn-primary w-full">
            Start an inquiry
          </Link>
        </div>
      </nav>
    </div>
  );
}
