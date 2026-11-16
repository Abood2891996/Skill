"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Wraps a CSS-animated element and pauses its animations while it is
 * off-screen (via `data-playing`). Also marks `data-seen` the first time it
 * enters the viewport, which components use to trigger one-time draw-ins.
 */
export function InViewPlayer({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setPlaying(visible);
        if (visible) setSeen(true);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn(className)} data-playing={playing} data-seen={seen}>
      {children}
    </div>
  );
}
