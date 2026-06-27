/**
 * Release 1.3 — Related Products (FEATURE-0004 / RFC-0003).
 *
 * Presentation-only section rendered at the bottom of the product page.
 * Consumes `ProductSummaryDto[]` produced by `ProductService.getRelated`
 * via the `getRelatedProducts` server function — no business logic, no
 * data fetching, no SEO side-effects (per RFC-0003 §SEO).
 *
 * Returns `null` when there is nothing to render so the section is
 * fully hidden (FEATURE-0004 functional requirements: "graceful
 * handling when no related products exist").
 *
 * Accessibility:
 *   - semantic <section> with an aria-labelledby heading;
 *   - a clear loading status announced via aria-live;
 *   - keyboard-reachable links with focus-visible styles;
 *   - RTL/LTR safe: layout uses logical Tailwind utilities only.
 */
import { Link } from "@tanstack/react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { enumToSlug } from "@/lib/category-slug";
import { T, t, type Lang } from "@/lib/i18n";
import type { ProductSummaryDto } from "@/lib/modules/products/product.dto";
import { DirArrow } from "@/components/faratech/dir-icon";
import { CompareButton } from "@/components/faratech/compare-button";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export interface RelatedProductsProps {
  lang: Lang;
  items: ProductSummaryDto[];
  /** When true, renders a skeleton grid instead of the resolved items. */
  loading?: boolean;
}

export function RelatedProducts({ lang, items, loading }: RelatedProductsProps) {
  if (loading) {
    return (
      <section
        aria-labelledby="related-products-heading"
        className="py-16 bg-muted/30 border-t border-border"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2
            id="related-products-heading"
            className="font-heading text-2xl font-bold text-[var(--brand-navy)] mb-6"
          >
            {t(T.relatedProducts, lang)}
          </h2>
          <p role="status" aria-live="polite" className="sr-only">
            {t(T.relatedProductsLoading, lang)}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section
      aria-labelledby="related-products-heading"
      className="py-16 bg-muted/30 border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2
          id="related-products-heading"
          className="font-heading text-2xl font-bold text-[var(--brand-navy)] mb-6"
        >
          {t(T.relatedProducts, lang)}
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
          {items.map((p, idx) => {
            const slug = enumToSlug(p.categoryKey);
            const alt =
              p.primaryImage?.alt?.[lang] ??
              p.primaryImage?.alt?.fa ??
              p.name;
            return (
              <li key={p.id}>
                <Link
                  to={`/${lang}/products/${slug}/${p.slug}`}
                  onClick={() =>
                    track({
                      name: ANALYTICS_EVENTS.relatedProductClicked,
                      productId: p.id,
                      productSlug: p.slug,
                      categoryKey: p.categoryKey,
                      position: idx,
                      lang,
                    })
                  }
                  className="group bg-white border border-border rounded-lg overflow-hidden hover:border-[var(--brand-navy)] hover:shadow-md transition-all flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
                >
                  <div className="aspect-[4/3] bg-[var(--brand-silver)] border-b border-border flex items-center justify-center text-muted-foreground text-[10px] tracking-widest uppercase">
                    {p.primaryImage ? (
                      <img
                        src={p.primaryImage.src}
                        alt={alt}
                        width={p.primaryImage.width ?? undefined}
                        height={p.primaryImage.height ?? undefined}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      t(T.imagePlaceholderShort, lang)
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    {p.code && (
                      <span
                        className="text-[10px] tracking-widest uppercase text-muted-foreground font-medium mb-2"
                        dir="ltr"
                      >
                        {p.code}
                      </span>
                    )}
                    <h3 className="font-heading font-bold text-[var(--brand-navy)] leading-snug mb-3 flex-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-red)] group-hover:gap-2 transition-all">
                        {t(T.view, lang)} <DirArrow lang={lang} size={12} />
                      </span>
                      {/* Release 1.5 — Product Comparison */}
                      <CompareButton lang={lang} product={p} />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
