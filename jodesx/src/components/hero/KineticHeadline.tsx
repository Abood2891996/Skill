"use client";

import { useEffect, useState } from "react";

/** The words that rotate after "Operations, structured around your". The first is the static, server-rendered one. */
const WORDS = ["business.", "support.", "calls.", "data.", "back office.", "moderation."] as const;
const INTERVAL_MS = 2600;

/**
 * Hero headline whose last word cycles through the areas JoDesx runs.
 * Screen readers and search engines get the plain sentence; the animation is
 * decorative, pauses when the tab is hidden, and is off for reduced motion.
 */
export function KineticHeadline({ id, lead }: { id: string; lead: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => setIndex((i) => (i + 1) % WORDS.length), INTERVAL_MS);
    };
    const onVisibility = () => (document.hidden ? window.clearInterval(timer) : start());
    const delay = window.setTimeout(start, 1200);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(delay);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <h1 id={id} className="type-display-xl max-w-[13ch]">
      <span className="sr-only">{lead} {WORDS[0]}</span>
      <span aria-hidden="true">
        {lead}{" "}
        <span className="kinetic-word">
          {WORDS.map((w, i) => (
            <span key={w} className="kinetic-word__item" data-state={i === index ? "in" : i === (index + WORDS.length - 1) % WORDS.length ? "out" : "idle"}>
              {w}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
