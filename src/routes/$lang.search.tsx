/**
 * Release 1.1 — Search & Discovery (FEATURE-0002 / RFC-0001).
 *
 * Public search page. Reads `?q=` from the URL, calls the
 * `searchProducts` server function (Routes → Server Functions →
 * Service → Repository → DB) and renders a localized, RTL-aware
 * result grid with loading, idle and empty states.
 *
 * SEO: the route is intentionally `noindex` (Step 6) — search result
 * pages should not pollute the index with thin per-query pages.
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";

import { searchProducts } from "@/lib/modules/products/product.functions";
import type {
  ProductSummaryDto,
  SearchProductsResultDto,
} from "@/lib/modules/products/product.dto";
import { enumToSlug } from "@/lib/category-slug";
import { T, t, type Lang } from "@/lib/i18n";
import { buildLocaleMeta } from "@/lib/seo";
import { DirArrow } from "@/components/faratech/dir-icon";
import { CompareButton } from "@/components/faratech/compare-button";
import {
  SearchSuggestions,
  useSuggestionsListboxId,
} from "@/components/faratech/search-suggestions";
import { ANALYTICS_EVENTS, sanitizeSearchTerm, track } from "@/lib/analytics";

const SearchSchema = z.object({
  q: z.string().max(200).optional().default(""),
});

export const Route = createFileRoute("/$lang/search")({
  validateSearch: (s: Record<string, unknown>) => SearchSchema.parse(s ?? {}),
  loaderDeps: ({ search }) => ({ q: search.q ?? "" }),
  loader: async ({ deps }): Promise<SearchProductsResultDto> => {
    const q = (deps.q ?? "").trim();
    if (!q) return { query: "", items: [], total: 0 };
    return searchProducts({ data: { q, limit: 48, offset: 0 } });
  },
  head: ({ params, loaderData }) => {
    const lang = (params?.lang as Lang) ?? "fa";
    const q = loaderData?.query ?? "";
    const titleBase = lang === "fa" ? "جستجو" : lang === "ar" ? "بحث" : "Search";
    const title = q ? `${titleBase}: ${q} — FARATECH` : `${titleBase} — FARATECH`;
    const locale = buildLocaleMeta(lang, (l) => `/${l}/search`);
    return {
      meta: [
        { title },
        // Step 6: search result pages MUST NOT be indexed.
        { name: "robots", content: "noindex,nofollow" },
        ...locale.meta,
      ],
      links: locale.links,
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { lang } = Route.useParams();
  const l = lang as Lang;
  const search = Route.useSearch();
  const data = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });
  const [input, setInput] = useState(search.q ?? "");
  const isLoading =
    Route.useMatch({ select: (m) => m.status === "pending" });
  // Release 1.4 — Search Suggestions (FEATURE-0005 / RFC-0004).
  // The route owns the input + popover container, the SearchSuggestions
  // component owns the listbox content + debounced fetching so no
  // duplicate search logic leaks into the route.
  const listboxId = useSuggestionsListboxId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestionItems, setSuggestionItems] = useState<ProductSummaryDto[]>([]);

  const trimmedInput = input.trim();
  const isOpen = open && trimmedInput.length > 0;

  // Keep the input in sync when the URL changes via back/forward.
  useEffect(() => {
    setInput(search.q ?? "");
  }, [search.q]);

  // Release 1.6 — Analytics: emit `search_performed` whenever the
  // resolved query changes (covers form submit, back/forward, direct
  // URL hits). Dispatch is async + failure-tolerant.
  useEffect(() => {
    const sanitized = sanitizeSearchTerm(data.query ?? "");
    if (!sanitized) return;
    track({
      name: ANALYTICS_EVENTS.searchPerformed,
      query: sanitized,
      resultCount: data.total ?? 0,
      lang: l,
    });
  }, [data.query, data.total, l]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    setOpen(false);
    void navigate({ search: { q } });
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestionItems.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestionItems.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) =>
          i <= 0 ? suggestionItems.length - 1 : i - 1,
        );
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(suggestionItems.length - 1);
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < suggestionItems.length) {
          e.preventDefault();
          const picked = suggestionItems[activeIndex];
          const slug = enumToSlug(picked.categoryKey);
          setOpen(false);
          void navigate({
            to: "/$lang/products/$category/$product",
            params: { lang: l, category: slug, product: picked.slug },
          });
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  const q = data.query ?? "";
  const hasQuery = q.length > 0;
  const hasResults = data.items.length > 0;

  return (
    <main className="bg-muted/30 min-h-[60vh]">
      {/* Header / search bar */}
      <section className="bg-[var(--brand-navy)] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            {t(T.search, l)}
          </h1>
          <form
            role="search"
            aria-label={t(T.search, l)}
            onSubmit={onSubmit}
            className="flex items-stretch gap-2 max-w-2xl"
          >
            <label htmlFor="search-q" className="sr-only">
              {t(T.searchPlaceholder, l)}
            </label>
            <div className="relative flex-1">
              <SearchIcon
                size={16}
                aria-hidden="true"
                className={`absolute top-1/2 -translate-y-1/2 text-white/60 ${
                  l === "en" ? "left-3" : "right-3"
                }`}
              />
              <input
                id="search-q"
                type="search"
                name="q"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onKeyDown={onInputKeyDown}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-activedescendant={
                  isOpen && activeIndex >= 0
                    ? `${listboxId}-opt-${activeIndex}`
                    : undefined
                }
                placeholder={t(T.searchPlaceholder, l)}
                autoComplete="off"
                autoFocus
                className={`w-full bg-white/10 border border-white/20 rounded-md py-3 ${
                  l === "en" ? "pl-9 pr-4" : "pr-9 pl-4"
                } text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]`}
              />
              <SearchSuggestions
                lang={l}
                query={input}
                open={isOpen}
                listboxId={listboxId}
                activeIndex={activeIndex}
                onItemsChange={(items) => {
                  setSuggestionItems(items);
                  setActiveIndex((i) =>
                    items.length === 0 ? -1 : Math.min(i, items.length - 1),
                  );
                }}
              />
            </div>
            <button
              type="submit"
              className="bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-white font-semibold px-6 rounded-md transition-colors"
            >
              {t(T.searchSubmit, l)}
            </button>
          </form>
          {hasQuery && (
            <p
              className="mt-4 text-sm text-white/70"
              aria-live="polite"
              aria-atomic="true"
            >
              {t(T.searchResultsFor, l)} <span className="text-white font-semibold">“{q}”</span>
              {" · "}
              <span>
                {data.total} {t(T.searchResultsCount, l)}
              </span>
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {t(T.searching, l)}
          </p>
        ) : !hasQuery ? (
          <p className="text-sm text-muted-foreground">
            {t(T.searchEmptyState, l)}
          </p>
        ) : !hasResults ? (
          <div className="text-center py-16">
            <p className="text-base text-muted-foreground">
              {t(T.searchNoResults, l)}
            </p>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
            {data.items.map((p: ProductSummaryDto) => {
              const slug = enumToSlug(p.categoryKey);
              return (
                <li key={p.id}>
                  <Link
                    to={`/${l}/products/${slug}/${p.slug}`}
                    className="group bg-white border border-border rounded-lg overflow-hidden hover:border-[var(--brand-navy)] hover:shadow-md transition-all flex flex-col h-full"
                  >
                    <div className="aspect-[4/3] bg-[var(--brand-silver)] border-b border-border flex items-center justify-center text-muted-foreground text-[10px] tracking-widest uppercase">
                      {p.primaryImage ? (
                        <img
                          src={p.primaryImage.src}
                          alt={
                            p.primaryImage.alt?.[l] ??
                            p.primaryImage.alt?.fa ??
                            p.name
                          }
                          width={p.primaryImage.width ?? undefined}
                          height={p.primaryImage.height ?? undefined}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        t(T.imagePlaceholderShort, l)
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {p.code && (
                        <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-medium mb-2" dir="ltr">
                          {p.code}
                        </span>
                      )}
                      <h3 className="font-heading font-bold text-[var(--brand-navy)] leading-snug mb-3 flex-1">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-red)] group-hover:gap-2 transition-all">
                          {t(T.view, l)} <DirArrow lang={l} size={12} />
                        </span>
                        {/* Release 1.5 — Product Comparison */}
                        <CompareButton lang={l} product={p} />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
