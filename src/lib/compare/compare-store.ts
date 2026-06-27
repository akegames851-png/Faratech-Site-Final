/**
 * Release 1.5 — Product Comparison (FEATURE-0006 / RFC-0005).
 *
 * Client-side comparison store. Holds 2–4 `ProductSummaryDto` items
 * selected by the user across navigation. Persists to `localStorage`
 * (when available) so a refresh does not lose the selection.
 *
 * Architectural notes (ADR-0001 §3.3, RFC-0005 §Architectural Principles):
 *   - lives in the UI layer; the repository / service / server function
 *     layers are NOT touched;
 *   - reuses `ProductSummaryDto` end-to-end — no duplicate product type;
 *   - SSR-safe: a no-op server snapshot lets `useSyncExternalStore`
 *     render the initial HTML without `window` access.
 */
import { useSyncExternalStore } from "react";

import type { ProductSummaryDto } from "@/lib/modules/products/product.dto";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

/** Minimum products required to launch the comparison view. */
export const COMPARE_MIN = 2;
/** Maximum products allowed in a single comparison. */
export const COMPARE_MAX = 4;
/** localStorage key — namespaced so future stores do not collide. */
const STORAGE_KEY = "faratech.compare.v1";

type Listener = () => void;

let items: ProductSummaryDto[] = [];
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota / private-mode — comparison still works in-memory.
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    // Lightweight validation — only keep entries with a string id + slug
    // so a tampered localStorage entry cannot crash the UI.
    items = (parsed as ProductSummaryDto[])
      .filter(
        (p): p is ProductSummaryDto =>
          !!p &&
          typeof (p as ProductSummaryDto).id === "string" &&
          typeof (p as ProductSummaryDto).slug === "string",
      )
      .slice(0, COMPARE_MAX);
  } catch {
    items = [];
  }
}

function subscribe(listener: Listener): () => void {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ProductSummaryDto[] {
  hydrate();
  return items;
}

// Stable empty snapshot for SSR — `useSyncExternalStore` requires
// referential equality across calls.
const EMPTY: ProductSummaryDto[] = [];
function getServerSnapshot(): ProductSummaryDto[] {
  return EMPTY;
}

export interface CompareApi {
  items: ProductSummaryDto[];
  count: number;
  isFull: boolean;
  canCompare: boolean;
  has: (id: string) => boolean;
  add: (item: ProductSummaryDto) => void;
  remove: (id: string) => void;
  toggle: (item: ProductSummaryDto) => void;
  clear: () => void;
}

/** Imperative store accessor — usable from event handlers / tests. */
export const compareStore = {
  get: getSnapshot,
  add(item: ProductSummaryDto) {
    hydrate();
    if (items.some((i) => i.id === item.id)) return;
    if (items.length >= COMPARE_MAX) return;
    items = [...items, item];
    persist();
    emit();
    track({
      name: ANALYTICS_EVENTS.compareAdded,
      productId: item.id,
      productSlug: item.slug,
      categoryKey: item.categoryKey,
      selectionSize: items.length,
    });
  },
  remove(id: string) {
    hydrate();
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) return;
    items = next;
    persist();
    emit();
    track({
      name: ANALYTICS_EVENTS.compareRemoved,
      productId: id,
      selectionSize: items.length,
    });
  },
  clear() {
    hydrate();
    if (items.length === 0) return;
    items = [];
    persist();
    emit();
  },
  has(id: string) {
    hydrate();
    return items.some((i) => i.id === id);
  },
};

/**
 * React hook returning the current compare state + actions. SSR-safe via
 * `useSyncExternalStore` (server snapshot is an empty array).
 */
export function useCompare(): CompareApi {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    items: current,
    count: current.length,
    isFull: current.length >= COMPARE_MAX,
    canCompare: current.length >= COMPARE_MIN,
    has: (id: string) => current.some((i) => i.id === id),
    add: compareStore.add,
    remove: compareStore.remove,
    toggle: (item: ProductSummaryDto) => {
      if (compareStore.has(item.id)) compareStore.remove(item.id);
      else compareStore.add(item);
    },
    clear: compareStore.clear,
  };
}