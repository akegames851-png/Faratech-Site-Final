/**
 * Lead abuse mitigation — in-memory rate limiter.
 *
 * This is an intentionally simple, per-instance limiter for Phase 10.
 * It bounds the number of accepted submissions per key within a sliding
 * window, providing first-line protection against accidental floods and
 * trivial scripted abuse. It is NOT a distributed limiter — each Worker
 * isolate keeps its own counters. A durable limiter (KV / Redis) is
 * deferred until traffic justifies it.
 *
 * Public surface is `consume(key, opts)`:
 *   - returns `{ ok: true }` when within budget (and records the hit).
 *   - returns `{ ok: false, retryAfterMs }` when the budget is exhausted.
 */

interface Bucket {
  hits: number[];
}

const store = new Map<string, Bucket>();

export interface RateLimitOpts {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Maximum hits per window. */
  max: number;
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs?: number;
}

export function consume(key: string, opts: RateLimitOpts): RateLimitResult {
  const now = Date.now();
  const cutoff = now - opts.windowMs;
  const bucket = store.get(key) ?? { hits: [] };
  // Drop stale hits.
  bucket.hits = bucket.hits.filter((t) => t > cutoff);
  if (bucket.hits.length >= opts.max) {
    const oldest = bucket.hits[0];
    store.set(key, bucket);
    return { ok: false, retryAfterMs: Math.max(0, oldest + opts.windowMs - now) };
  }
  bucket.hits.push(now);
  store.set(key, bucket);
  return { ok: true };
}

/** Test-only — clears all counters. */
export function __resetRateLimit(): void {
  store.clear();
}

/** Default budget for lead submissions: 5 per email per 10 minutes. */
export const LEAD_EMAIL_LIMIT: RateLimitOpts = { windowMs: 10 * 60_000, max: 5 };
/** Soft global per-instance ceiling: 60 leads per minute. */
export const LEAD_GLOBAL_LIMIT: RateLimitOpts = { windowMs: 60_000, max: 60 };
