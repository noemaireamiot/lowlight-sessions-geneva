import "server-only";

/**
 * Fixed-window rate limiting, in memory.
 *
 * Deliberately not backed by the database: the site runs as a single Node
 * process on Infomaniak, so a Map is enough and costs no round-trip.
 * Consequences to keep in mind — counters reset when the process restarts, and
 * they are not shared if the app is ever scaled to several instances. Move this
 * to the database if either becomes untrue.
 */

const MAX_TRACKED_KEYS = 5_000;

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = { blocked: boolean; retryAfterSeconds: number };

export type RateLimiter = {
  check: (key: string) => RateLimitResult;
  record: (key: string) => void;
  clear: (key: string) => void;
};

export function createRateLimiter({
  max,
  windowMs,
}: {
  max: number;
  windowMs: number;
}): RateLimiter {
  const buckets = new Map<string, Bucket>();

  function sweep(now: number): void {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  return {
    check(key) {
      const now = Date.now();
      const bucket = buckets.get(key);

      if (!bucket || bucket.resetAt <= now) return { blocked: false, retryAfterSeconds: 0 };
      if (bucket.count < max) return { blocked: false, retryAfterSeconds: 0 };

      return {
        blocked: true,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    },

    record(key) {
      const now = Date.now();

      // Bound memory: an attacker rotating keys must not grow the map without limit.
      if (buckets.size >= MAX_TRACKED_KEYS) sweep(now);

      const bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return;
      }
      bucket.count += 1;
    },

    clear(key) {
      buckets.delete(key);
    },
  };
}

/** Admin login: 5 tries per 10 minutes, keyed by IP and by username. */
export const loginLimiter = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });

/** Public forms: generous enough for real humans, tight enough to blunt spam floods. */
export const publicFormLimiter = createRateLimiter({ max: 8, windowMs: 10 * 60 * 1000 });
