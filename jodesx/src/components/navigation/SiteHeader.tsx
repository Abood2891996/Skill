"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ServiceGlyph } from "@/components/services/ServiceGlyph";
import { primaryNav } from "@/content/navigation";
import { services } from "@/content/services";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/utils/cn";
import { MobileMenu } from "./MobileMenu";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  /** Time the panel was last opened by mouse hover; a click shortly after must not close it. */
  const hoverOpenedAt = useRef(0);
  const panelId = useId();

  // Close menus on navigation (state adjustment during render, per React guidance).
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setServicesOpen(false);
    setMobileOpen(false);
  }

  // Solid background after leaving the top; hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        // Small deltas (inertia, rounding) leave the current state unchanged.
        if (y <= 480 || y < lastY - 4) setHidden(false);
        else if (y > lastY + 4) setHidden(true);
        lastY = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeServices = useCallback((reason: "escape" | "outside") => {
    setServicesOpen(false);
    if (reason === "escape") servicesButtonRef.current?.focus();
  }, []);
  useDismiss(servicesRef, servicesOpen, closeServices);

  // Pointer-hover opening for mouse users; touch and keyboard use the button.
  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    if (!servicesOpen) hoverOpenedAt.current = Date.now();
    setServicesOpen(true);
  };
  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverTimer.current = window.setTimeout(() => setServicesOpen(false), 180);
  };

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const servicesActive = isActive(pathname, "/services");

  return (
    <>
    <header
      className={cn(
        "site-header surface-dark fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ease-signal",
        scrolled || servicesOpen || mobileOpen ? "is-solid" : "",
        hidden && !servicesOpen && !mobileOpen ? "-translate-y-full" : "translate-y-0",
      )}
      onFocusCapture={() => setHidden(false)}
    >
      <a href="#main" className="sr-only-focusable btn btn-primary btn-sm absolute left-4 top-3 z-10">
        Skip to content
      </a>
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="-m-2 rounded-md p-2" aria-label="JoDesx home">
          <Logo height={26} decorative />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <div ref={servicesRef} className="relative" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
            <button
              ref={servicesButtonRef}
              type="button"
              className={cn("nav-link", servicesActive && "is-active")}
              aria-expanded={servicesOpen}
              aria-controls={panelId}
              onClick={() => {
                // Mouse users who hovered open the panel expect their click to keep it open.
                if (servicesOpen && Date.now() - hoverOpenedAt.current < 800) {
                  hoverOpenedAt.current = 0;
                  return;
                }
                setServicesOpen((o) => !o);
              }}
            >
              Services
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={cn("transition-transform duration-200", servicesOpen && "rotate-180")}
              />
            </button>

            <div
              id={panelId}
              hidden={!servicesOpen}
              className="services-panel absolute -left-4 top-full w-[min(44rem,calc(100vw-2rem))] pt-3"
            >
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-navy-800 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)]">
                <ul className="grid grid-cols-2 gap-px bg-line">
                  {services.map((s) => (
                    <li key={s.slug} className="bg-navy-800 [&:last-child:nth-child(odd)]:col-span-2">
                      <Link
                        href={s.href}
                        aria-current={pathname === s.href ? "page" : undefined}
                        className="group flex h-full gap-4 p-5 transition-colors hover:bg-slate-700/60 focus-visible:bg-slate-700/60"
                      >
                        <ServiceGlyph slug={s.slug} size={36} className="flex-none" />
                        <span>
                          <span className="block font-semibold text-fg">{s.name}</span>
                          <span className="mt-1 block text-sm leading-snug text-fg-muted">{s.summary}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 text-sm">
                  <span className="text-fg-muted">Not sure which service fits your situation?</span>
                  <Link href="/services" className="link-signal text-sm">
                    Compare all services
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-link", isActive(pathname, item.href) && "is-active")}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Start an inquiry
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-[var(--radius-md)] border border-line-strong text-fg lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

    </header>
    {/* Rendered outside <header>: the header's translate would otherwise become the
        containing block for this fixed-position panel. */}
    <MobileMenu open={mobileOpen} onClose={closeMobile} pathname={pathname} />
    </>
  );
}
