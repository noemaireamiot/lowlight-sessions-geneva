import "server-only";

/**
 * Brute-force throttle for the admin login.
 *
 * Deliberately in-memory: the site runs as a single Node process on Infomaniak,
 * so a Map is enough and costs no round-trip. Consequences to keep in mind —
 * the counters reset when the process restarts, and they are not shared if the
 * app is ever scaled to several instances. Move this to the database if either
 * becomes untrue.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_TRACKED_KEYS = 5_000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function sweep(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type ThrottleState = { blocked: boolean; retryAfterSeconds: number };

export function checkThrottle(key: string): ThrottleState {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) return { blocked: false, retryAfterSeconds: 0 };
  if (bucket.count < MAX_ATTEMPTS) return { blocked: false, retryAfterSeconds: 0 };

  return {
    blocked: true,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export function recordFailure(key: string): void {
  const now = Date.now();

  // Bound memory: an attacker rotating keys must not grow the map without limit.
  if (buckets.size >= MAX_TRACKED_KEYS) sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.count += 1;
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}
