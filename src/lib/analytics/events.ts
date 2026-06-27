/**
 * Release 1.6 — Product Analytics (FEATURE-0008 / RFC-0007).
 *
 * Canonical event catalogue. The shape lives in the analytics module so
 * higher layers depend on a type, not on a concrete provider (ADR-0001
 * §3.3 layered architecture, RFC-0007 §Provider Strategy).
 *
 * Payloads MUST stay free of personally identifiable information
 * (RFC-0007 §Event Model): no email, IP, name, query strings that may
 * carry PII, etc. Free-text search queries are truncated and trimmed to
 * a length that is useful for funnel analysis but not identifying.
 */

/** Stable event name registry — single source of truth for providers. */
export const ANALYTICS_EVENTS = {
  searchPerformed: "search_performed",
  suggestionSelected: "suggestion_selected",
  productViewed: "product_viewed",
  relatedProductClicked: "related_product_clicked",
  compareAdded: "compare_added",
  compareRemoved: "compare_removed",
  compareOpened: "compare_opened",
  compareClosed: "compare_closed",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Maximum stored characters of a search term — keeps PII risk bounded. */
export const SEARCH_TERM_MAX = 64;

export interface SearchPerformedPayload {
  name: typeof ANALYTICS_EVENTS.searchPerformed;
  /** Lowercased, trimmed, length-capped query — never raw user input. */
  query: string;
  resultCount: number;
  lang: string;
}

export interface SuggestionSelectedPayload {
  name: typeof ANALYTICS_EVENTS.suggestionSelected;
  productId: string;
  productSlug: string;
  categoryKey: string;
  position: number;
  /** Sanitised query at the moment of selection. */
  query: string;
  lang: string;
}

export interface ProductViewedPayload {
  name: typeof ANALYTICS_EVENTS.productViewed;
  productId: string;
  productSlug: string;
  categoryKey: string;
  lang: string;
}

export interface RelatedProductClickedPayload {
  name: typeof ANALYTICS_EVENTS.relatedProductClicked;
  productId: string;
  productSlug: string;
  categoryKey: string;
  position: number;
  lang: string;
}

export interface CompareAddedPayload {
  name: typeof ANALYTICS_EVENTS.compareAdded;
  productId: string;
  productSlug: string;
  categoryKey: string;
  selectionSize: number;
}

export interface CompareRemovedPayload {
  name: typeof ANALYTICS_EVENTS.compareRemoved;
  productId: string;
  selectionSize: number;
}

export interface CompareOpenedPayload {
  name: typeof ANALYTICS_EVENTS.compareOpened;
  selectionSize: number;
  lang: string;
}

export interface CompareClosedPayload {
  name: typeof ANALYTICS_EVENTS.compareClosed;
  selectionSize: number;
  lang: string;
}

export type AnalyticsEvent =
  | SearchPerformedPayload
  | SuggestionSelectedPayload
  | ProductViewedPayload
  | RelatedProductClickedPayload
  | CompareAddedPayload
  | CompareRemovedPayload
  | CompareOpenedPayload
  | CompareClosedPayload;

/**
 * Sanitise a free-text search term so it stays safe for analytics: trim,
 * lowercase, collapse internal whitespace, and cap the length.
 */
export function sanitizeSearchTerm(raw: string): string {
  return (raw ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US")
    .slice(0, SEARCH_TERM_MAX);
}