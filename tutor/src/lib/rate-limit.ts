/**
 * حدود الاستخدام للزوار.
 * Usage limits for guests: a daily message cap and a short-burst cap.
 *
 * Phase 1 keeps counts in the server's memory. That is enough for testing,
 * but counts reset when the server restarts and are not shared between
 * servers. Phase 3 moves them to the database (per student account).
 */

type Bucket = { day: string; count: number; minute: number; minuteCount: number };

const buckets = new Map<string, Bucket>();

function today(now: Date): string {
  // Kuwait time (UTC+3, no daylight saving), so the limit resets at local midnight.
  return new Date(now.getTime() + 3 * 3600_000).toISOString().slice(0, 10);
}

export type LimitResult =
  | { ok: true; remaining: number }
  | { ok: false; reason: "rate_limited" | "too_fast" };

/**
 * Records one message for every key (e.g. visitor cookie and IP address) and
 * refuses if any key is over its limit. Nothing is counted when refused.
 */
export function takeMessage(keys: string[], dailyLimit: number, perMinute: number, now = new Date()): LimitResult {
  const day = today(now);
  const minute = Math.floor(now.getTime() / 60_000);
  const current = keys.map((k) => {
    let b = buckets.get(k);
    if (!b || b.day !== day) b = { day, count: 0, minute, minuteCount: 0 };
    if (b.minute !== minute) b = { ...b, minute, minuteCount: 0 };
    return [k, b] as const;
  });

  if (current.some(([, b]) => b.count >= dailyLimit)) return { ok: false, reason: "rate_limited" };
  if (current.some(([, b]) => b.minuteCount >= perMinute)) return { ok: false, reason: "too_fast" };

  let remaining = dailyLimit;
  for (const [k, b] of current) {
    const next = { ...b, count: b.count + 1, minuteCount: b.minuteCount + 1 };
    buckets.set(k, next);
    remaining = Math.min(remaining, dailyLimit - next.count);
  }

  // Keep memory bounded: drop yesterday's entries occasionally.
  if (buckets.size > 50_000) {
    for (const [k, b] of buckets) if (b.day !== day) buckets.delete(k);
  }
  return { ok: true, remaining };
}

/** For tests only. */
export function resetLimits() {
  buckets.clear();
}
