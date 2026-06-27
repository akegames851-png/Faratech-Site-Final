/**
 * Release 1.4 — Search Suggestions (FEATURE-0005 / RFC-0004).
 *
 * Presentation + interaction component for predictive search. Fetches
 * suggestions through the `searchSuggestions` server function — never
 * touches the repository or service directly (ADR-0001 §3.3 layered
 * architecture; RFC-0004 §Architectural Principles).
 *
 * Behaviour (RFC-0004 §Behaviour):
 *   - debounced (default 180ms) while typing;
 *   - disappears when the query is empty;
 *   - keyboard navigable (ArrowUp/Down, Home/End, Enter, Escape);
 *   - mouse selectable;
 *   - reuses ProductSummaryDto, no duplicate search logic.
 *
 * Accessibility (RFC-0004 §Accessibility):
 *   - role=listbox with aria-activedescendant;
 *   - the parent input wires aria-controls / aria-expanded /
 *     aria-autocomplete via the props returned by `useSearchSuggestions`;
 *   - selected option announced via aria-selected;
 *   - polite live region announces result counts.
 *
 * Localization (RFC-0004 §Localization):
 *   - all labels via the `T` dictionary (fa / en / ar);
 *   - RTL/LTR safe — no left/right hard-coded offsets here, callers own
 *     positioning.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { searchSuggestions } from "@/lib/modules/products/product.functions";
import type { ProductSummaryDto } from "@/lib/modules/products/product.dto";
import { enumToSlug } from "@/lib/category-slug";
import { T, t, type Lang } from "@/lib/i18n";
import { ANALYTICS_EVENTS, sanitizeSearchTerm, track } from "@/lib/analytics";

/** Default debounce window (ms) before issuing a suggestion request. */
export const SEARCH_SUGGESTIONS_DEBOUNCE_MS = 180;
/** Default maximum suggestions shown — matches RFC-0004 §Behaviour. */
export const SEARCH_SUGGESTIONS_MAX = 8;

export interface UseSearchSuggestionsOptions {
  query: string;
  debounceMs?: number;
  max?: number;
  /** When false the hook stays idle (e.g. while the popover is closed). */
  enabled?: boolean;
}

export interface SearchSuggestionsState {
  /** Resolved suggestions for the most recent settled query. */
  items: ProductSummaryDto[];
  /** The query string the current `items` correspond to. */
  resolvedQuery: string;
  loading: boolean;
}

/**
 * Debounced suggestion fetcher. Encapsulates the
 * setTimeout/AbortController dance so the route stays presentational.
 */
export function useSearchSuggestions({
  query,
  debounceMs = SEARCH_SUGGESTIONS_DEBOUNCE_MS,
  max = SEARCH_SUGGESTIONS_MAX,
  enabled = true,
}: UseSearchSuggestionsOptions): SearchSuggestionsState {
  const [state, setState] = useState<SearchSuggestionsState>({
    items: [],
    resolvedQuery: "",
    loading: false,
  });
  // Monotonic token guards against out-of-order responses.
  const tokenRef = useRef(0);

  useEffect(() => {
    const trimmed = (query ?? "").trim();
    if (!enabled || trimmed.length === 0) {
      tokenRef.current += 1;
      setState({ items: [], resolvedQuery: "", loading: false });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    const myToken = ++tokenRef.current;
    const timer = window.setTimeout(() => {
      void searchSuggestions({ data: { q: trimmed, limit: max } })
        .then((res) => {
          if (tokenRef.current !== myToken) return;
          setState({
            items: res.items,
            resolvedQuery: res.query,
            loading: false,
          });
        })
        .catch(() => {
          if (tokenRef.current !== myToken) return;
          // Soft failure — surface as empty list, route still works
          // via the submit button.
          setState({ items: [], resolvedQuery: trimmed, loading: false });
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, enabled, debounceMs, max]);

  return state;
}

export interface SearchSuggestionsProps {
  lang: Lang;
  /** Live input value; the component owns its debounce internally. */
  query: string;
  /** Controls visibility — typically tied to input focus. */
  open: boolean;
  /** Stable id used by the parent input's aria-controls. */
  listboxId: string;
  /** Highlighted option index from the parent's keyboard handler. */
  activeIndex: number;
  /** Notifies the parent so it can clamp activeIndex on data change. */
  onItemsChange?: (items: ProductSummaryDto[]) => void;
  /** Optional click handler — defaults to navigating to the product page. */
  onSelect?: (item: ProductSummaryDto) => void;
}

export function SearchSuggestions({
  lang,
  query,
  open,
  listboxId,
  activeIndex,
  onItemsChange,
  onSelect,
}: SearchSuggestionsProps) {
  const navigate = useNavigate();
  const { items, loading, resolvedQuery } = useSearchSuggestions({
    query,
    enabled: open,
  });

  useEffect(() => {
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  const handleSelect = useCallback(
    (item: ProductSummaryDto) => {
      const position = items.findIndex((i) => i.id === item.id);
      track({
        name: ANALYTICS_EVENTS.suggestionSelected,
        productId: item.id,
        productSlug: item.slug,
        categoryKey: item.categoryKey,
        position: position >= 0 ? position : 0,
        query: sanitizeSearchTerm(query),
        lang,
      });
      if (onSelect) {
        onSelect(item);
        return;
      }
      const slug = enumToSlug(item.categoryKey);
      void navigate({
        to: "/$lang/products/$category/$product",
        params: { lang, category: slug, product: item.slug },
      });
    },
    [navigate, lang, onSelect, items, query],
  );

  if (!open) return null;
  const trimmed = (query ?? "").trim();
  if (trimmed.length === 0) return null;
  // Hide stale "no results" while a fresh response is in flight.
  if (loading && items.length === 0) return null;

  const labelId = `${listboxId}-label`;
  const hasItems = items.length > 0;

  return (
    <div
      className="absolute top-full mt-2 inset-x-0 z-20 bg-white text-foreground border border-border rounded-md shadow-lg overflow-hidden"
      // RTL/LTR safe: `inset-x-0` and logical paddings only.
    >
      <span id={labelId} className="sr-only">
        {t(T.searchSuggestionsLabel, lang)}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {hasItems
          ? `${items.length} ${t(T.searchResultsCount, lang)}`
          : resolvedQuery
            ? t(T.searchSuggestionsEmpty, lang)
            : ""}
      </span>
      {hasItems ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="list-none m-0 p-1 max-h-96 overflow-y-auto"
        >
          {items.map((item, idx) => {
            const optionId = `${listboxId}-opt-${idx}`;
            const isActive = idx === activeIndex;
            return (
              <li
                key={item.id}
                id={optionId}
                role="option"
                aria-selected={isActive}
                // onMouseDown beats the input's onBlur so the click
                // actually reaches the handler before the popover is
                // dismissed.
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm cursor-pointer ${
                  isActive ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                <div className="w-10 h-10 shrink-0 bg-[var(--brand-silver)] rounded flex items-center justify-center overflow-hidden">
                  {item.primaryImage ? (
                    <img
                      src={item.primaryImage.src}
                      alt={
                        item.primaryImage.alt?.[lang] ??
                        item.primaryImage.alt?.fa ??
                        item.name
                      }
                      width={40}
                      height={40}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate text-[var(--brand-navy)]">
                    {item.name}
                  </div>
                  {item.code ? (
                    <div
                      className="text-[10px] tracking-widest uppercase text-muted-foreground"
                      dir="ltr"
                    >
                      {item.code}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-3 py-3 text-sm text-muted-foreground">
          {t(T.searchSuggestionsEmpty, lang)}
        </div>
      )}
    </div>
  );
}

/**
 * Convenience hook for parents that want a stable listbox id.
 */
export function useSuggestionsListboxId(): string {
  const reactId = useId();
  return useMemo(() => `search-suggestions-${reactId.replace(/[:]/g, "")}`, [reactId]);
}
