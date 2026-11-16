"use client";

import { useEffect, type ReactNode } from "react";

/** Becomes true after the first client render; survives client-side navigations. */
let hydrated = false;

/**
 * Fades route content in on client-side navigations only. The first page load
 * renders immediately: starting content at opacity 0 would delay — or prevent —
 * the browser recording Largest Contentful Paint.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const animate = hydrated;
  useEffect(() => {
    hydrated = true;
  }, []);
  return <div className={animate ? "route-enter" : undefined}>{children}</div>;
}
