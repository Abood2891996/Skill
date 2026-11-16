/**
 * Best-effort, in-memory sliding-window rate limiter.
 *
 * Suitable for a single long-running Node process. On serverless or multi-
 * instance hosting each instance keeps its own window, so treat this as a
 * first line of defence and add a shared store (e.g. Redis / Upstash) or a
 * platform WAF rule for stronger guarantees — see docs/DEPLOYMENT.md.
 */
export interface RateLimiter {
  /** Records an attempt for `key`; returns false when the key is over the limit. */
  check(key: string, now?: number): boolean;
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, number[]>();
  const MAX_KEYS = 5000;

  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      // Prevent unbounded growth: drop the oldest key when the map gets large.
      if (hits.size > MAX_KEYS) {
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) hits.delete(oldest);
      }
      return true;
    },
  };
}
