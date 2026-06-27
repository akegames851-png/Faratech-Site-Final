/**
 * Release 1.6 — Product Analytics (FEATURE-0008 / RFC-0007).
 *
 * PostHog adapter. Implemented over the public capture endpoint via
 * `fetch` so the bundle does not gain a new runtime dependency and the
 * provider can be swapped freely (RFC-0007 §Provider Strategy).
 *
 * Browser-only: returns the `noopProvider` during SSR so module
 * evaluation never touches `window` / `localStorage` on the server
 * (RFC-0006 SSR safety).
 */
import type { AnalyticsProvider } from "../provider";
import type { AnalyticsEvent } from "../events";
import { noopProvider } from "./noop";

const DEFAULT_HOST = "https://us.i.posthog.com";
const DISTINCT_ID_KEY = "faratech.analytics.distinct_id.v1";

function getOrCreateDistinctId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const existing = window.localStorage.getItem(DISTINCT_ID_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(DISTINCT_ID_KEY, fresh);
    return fresh;
  } catch {
    return `anon-${Date.now().toString(36)}`;
  }
}

export interface PostHogProviderConfig {
  apiKey: string;
  host?: string;
}

export function createPostHogProvider(
  config: PostHogProviderConfig,
): AnalyticsProvider {
  // SSR escape hatch — never touch the network or storage on the server.
  if (typeof window === "undefined") return noopProvider;

  const host = (config.host ?? DEFAULT_HOST).replace(/\/+$/, "");

  return {
    name: "posthog",
    capture(event: AnalyticsEvent) {
      try {
        const { name, ...properties } = event;
        const payload = JSON.stringify({
          api_key: config.apiKey,
          event: name,
          distinct_id: getOrCreateDistinctId(),
          properties: {
            ...properties,
            $lib: "faratech-analytics",
            $lib_version: "1.6.0",
          },
          timestamp: new Date().toISOString(),
        });
        // `keepalive` lets the request survive a navigation; failures
        // are swallowed so analytics never affect the UI.
        void fetch(`${host}/i/v0/e/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
          mode: "cors",
          credentials: "omit",
        }).catch(() => {
          /* swallow — RFC-0007 §Failure Handling */
        });
      } catch {
        /* swallow — RFC-0007 §Failure Handling */
      }
    },
  };
}