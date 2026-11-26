"use client";

import { useEffect, useRef, useState } from "react";

interface Gate {
  top: number;
}

/**
 * "The signal runs through the page": a thin line in the left margin that fills
 * as the visitor scrolls, with a gate at the start of each section and a moving
 * violet unit at its head. It ends at the closing call to action.
 * Decorative only (aria-hidden), pointer-events none, transform-only updates.
 */
export function ScrollSignal({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [gates, setGates] = useState<Gate[]>([]);
  const [span, setSpan] = useState({ top: 0, height: 0, left: 8 });
  const fillRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gateRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const geometry = useRef({ top: 0, height: 0, gates: [] as number[] });

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const measure = () => {
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section"));
      if (sections.length < 2) return;
      const tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY - rootTop);
      const first = sections[1] ? tops[1]! : tops[0]!; // start below the hero
      const last = tops[tops.length - 1]! + 96;
      const containerMax = 1240;
      const left = Math.max(6, Math.round((window.innerWidth - containerMax) / 2 - 28));
      geometry.current = { top: first, height: last - first, gates: tops.slice(1).map((t) => t - first) };
      setSpan({ top: first, height: last - first, left });
      setGates(tops.slice(1).map((t) => ({ top: t - first })));
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height, gates: g } = geometry.current;
      if (!height) return;
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const probe = window.scrollY + window.innerHeight * 0.55 - rootTop - top;
      const progress = Math.min(1, Math.max(0, probe / height));
      fillRef.current?.style.setProperty("transform", `scaleY(${progress})`);
      headRef.current?.style.setProperty("transform", `translate(-50%, ${progress * height}px) rotate(45deg)`);
      g.forEach((offset, i) => gateRefs.current[i]?.toggleAttribute("data-passed", offset <= progress * height + 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.fonts?.ready.then(() => {
      measure();
      update();
    });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [containerRef]);

  if (!span.height) return null;

  return (
    <div aria-hidden="true" className="scroll-signal" style={{ top: span.top, height: span.height, left: span.left }}>
      <div className="scroll-signal__track" />
      <div ref={fillRef} className="scroll-signal__fill" />
      {gates.map((g, i) => (
        <span
          key={i}
          ref={(el) => {
            gateRefs.current[i] = el;
          }}
          className="scroll-signal__gate"
          style={{ top: g.top }}
        />
      ))}
      <div ref={headRef} className="scroll-signal__head" />
    </div>
  );
}

/** Wraps page sections so the signal can measure them. */
export function SignalThread({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="relative">
      {children}
      <ScrollSignal containerRef={ref} />
    </div>
  );
}
