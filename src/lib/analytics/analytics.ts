/**
 * Release 1.6 — Product Analytics (FEATURE-0008 / RFC-0007).
 *
 * Singleton facade. Higher layers import `track` only; the active
 * provider is resolved lazily and can be swapped via
 * `setAnalyticsProvider` (tests, future migrations). All dispatch is
 * asynchronous and failure-tolerant per RFC-0007 §Performance and
 * §Failure Handling.
 */
import type { AnalyticsProvider } from "./provider";
import type { AnalyticsEvent } from "./events";
import { noopProvider } from "./providers/noop";
import { createPostHogProvider } from "./providers/posthog";

let provider: AnalyticsProvider | null = null;

function resolveDefaultProvider(): AnalyticsProvider {
  // SSR / Node: never instantiate a browser provider.
  if (typeof window === "undefined") return noopProvider;
  const apiKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host = import.meta.env.VITE_POSTHOG_HOST as string | undefined;
  if (!apiKey) return noopProvider;
  return createPostHogProvider({ apiKey, host });
}

/** Test / migration hook — replace the active provider at runtime. */
export function setAnalyticsProvider(next: AnalyticsProvider | null): void {
  provider = next;
}

/** Returns the active provider, instantiating the default on first use. */
export function getAnalyticsProvider(): AnalyticsProvider {
  if (!provider) provider = resolveDefaultProvider();
  return provider;
}

/**
 * Fire-and-forget event dispatch. Always returns `void` synchronously
 * so call sites never need `await`. Dispatch is deferred to a microtask
 * (or `queueMicrotask` shim) so it never blocks rendering, and all
 * provider failures are swallowed.
 */
export function track(event: AnalyticsEvent): void {
  const run = () => {
    try {
      getAnalyticsProvider().capture(event);
    } catch {
      /* swallow — RFC-0007 §Failure Handling */
    }
  };
  try {
    if (typeof queueMicrotask === "function") queueMicrotask(run);
    else Promise.resolve().then(run);
  } catch {
    /* swallow */
  }
}