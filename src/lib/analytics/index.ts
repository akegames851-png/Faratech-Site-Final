/**
 * Release 1.6 — Product Analytics (FEATURE-0008 / RFC-0007).
 *
 * Public entry point. Higher layers import from `@/lib/analytics` only.
 */
export {
  track,
  getAnalyticsProvider,
  setAnalyticsProvider,
} from "./analytics";
export {
  ANALYTICS_EVENTS,
  sanitizeSearchTerm,
  SEARCH_TERM_MAX,
} from "./events";
export type {
  AnalyticsEvent,
  AnalyticsEventName,
  SearchPerformedPayload,
  SuggestionSelectedPayload,
  ProductViewedPayload,
  RelatedProductClickedPayload,
  CompareAddedPayload,
  CompareRemovedPayload,
  CompareOpenedPayload,
  CompareClosedPayload,
} from "./events";
export type { AnalyticsProvider } from "./provider";