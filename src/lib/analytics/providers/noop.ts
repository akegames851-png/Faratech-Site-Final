/**
 * Release 1.6 — Product Analytics (FEATURE-0008 / RFC-0007).
 *
 * Default no-op provider. Used during SSR, in tests, and whenever no
 * PostHog key is configured. Guarantees zero side-effects so analytics
 * can never break rendering or business behaviour.
 */
import type { AnalyticsProvider } from "../provider";

export const noopProvider: AnalyticsProvider = {
  name: "noop",
  capture() {
    /* intentional no-op */
  },
};