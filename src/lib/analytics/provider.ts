/**
 * Release 1.6 — Product Analytics (FEATURE-0008 / RFC-0007).
 *
 * Provider abstraction. Higher layers (UI components, hooks) depend on
 * this interface only; concrete implementations (PostHog, console, noop)
 * live in `./providers/*`. Swapping providers must not require touching
 * call sites — that is the whole point of the abstraction.
 */
import type { AnalyticsEvent } from "./events";

export interface AnalyticsProvider {
  /** Stable identifier — used by tests and the validator. */
  readonly name: string;
  /**
   * Fire-and-forget capture. Implementations MUST NOT throw — any
   * provider-level failure must be swallowed so the UI is never
   * affected (RFC-0007 §Failure Handling).
   */
  capture(event: AnalyticsEvent): void;
}