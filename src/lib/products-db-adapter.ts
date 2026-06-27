/**
 * Phase 4 — DTO → UI view-model adapter.
 *
 * The existing presentational components (ProductPage, CategoryPage,
 * products-index) consume the `Product` / `Category` shapes defined in
 * `src/lib/products.ts`. The Phase 3 backend returns DTOs from
 * `src/lib/modules/*`. This adapter translates DTOs into the legacy view
 * model so the UI keeps rendering unchanged while the database becomes
 * the runtime source of truth.
 *
 * Editorial copy that is NOT in the DB schema (category long-form blurbs
 * etc.) is still pulled from `src/lib/data/category-copy.ts` — the user's
 * Phase 4 scope is data wiring for products / categories / company, not
 * relocating editorial assets.
 */
import type {
  Category,
  LocalizedText as UiLocalizedText,
  Product,
  ProductDocument,
  ProductImage,
  ProductVideo,
  SpecificationGroup,
} from "./products";
import type {
  ProductDetailDto,
  ProductSummaryDto,
  LocalizedText as DtoLocalizedText,
} from "@/lib/modules/products/product.dto";
import type {
  CategoryCopyDto,
  CategoryDto,
} from "@/lib/modules/categories/category.dto";
import { ENUM_TO_SLUG, type DbCategoryKey } from "./category-slug";

// ---------------------------------------------------------------------------
// LocalizedText: DTO uses { fa, en?, ar? } with `fa` required; the UI type
// uses { en, fa?, ar? } with `en` required. Bridge with a safe fallback.
// ---------------------------------------------------------------------------
const toUiLocalized = (
  v: DtoLocalizedText | null | undefined,
): UiLocalizedText | undefined => {
  if (!v) return undefined;
  return { en: v.en ?? v.fa, fa: v.fa, ar: v.ar };
};

const toUiImage = (i: ProductSummaryDto["primaryImage"] & {}): ProductImage => ({
  src: i.src,
  alt: toUiLocalized(i.alt),
  width: i.width ?? undefined,
  height: i.height ?? undefined,
  isPrimary: i.isPrimary,
});

const toUiVideo = (v: ProductDetailDto["videos"][number]): ProductVideo => ({
  src: v.src,
  poster: v.poster ?? undefined,
  title: toUiLocalized(v.title),
  provider:
    v.provider === "YOUTUBE"
      ? "youtube"
      : v.provider === "VIMEO"
        ? "vimeo"
        : "self-hosted",
  durationSeconds: v.durationSeconds ?? undefined,
});

const toUiDoc = (
  d: ProductDetailDto["documents"][number],
): ProductDocument => ({
  kind: d.kind.toLowerCase() as ProductDocument["kind"],
  src: d.src,
  title: toUiLocalized(d.title),
  language: d.language ? (d.language.toLowerCase() as "en" | "fa" | "ar") : undefined,
  sizeBytes: d.sizeBytes ?? undefined,
});

const toUiSpecGroup = (
  g: ProductDetailDto["specifications"][number],
): SpecificationGroup => ({
  key: g.key,
  label: toUiLocalized(g.label) ?? { en: g.key },
  items: g.items.map((it) => ({
    key: it.key,
    label: toUiLocalized(it.label) ?? { en: it.key },
    value: toUiLocalized(it.value) ?? { en: "" },
    unit: it.unit ?? undefined,
  })),
});

/** Map a summary DTO to the lightweight Product shape used in lists. */
export function summaryToProduct(s: ProductSummaryDto): Product {
  const p: Product = {
    slug: s.slug,
    name: s.name,
    code: s.code ?? undefined,
    series: toUiLocalized(s.series),
    shortDescription: toUiLocalized(s.shortDescription),
    status:
      s.status === "PUBLISHED"
        ? "published"
        : s.status === "DRAFT"
          ? "draft"
          : "archived",
  };
  if (s.primaryImage) {
    p.media = { images: [toUiImage(s.primaryImage)] };
  }
  return p;
}

/** Map a full detail DTO to the rich Product shape used by ProductPage. */
export function detailToProduct(d: ProductDetailDto): Product {
  return {
    slug: d.slug,
    name: d.name,
    code: d.code ?? undefined,
    series: toUiLocalized(d.series),
    description: toUiLocalized(d.description),
    shortDescription: toUiLocalized(d.shortDescription),
    features: d.features
      .map(toUiLocalized)
      .filter((x): x is UiLocalizedText => x !== undefined),
    specifications: d.specifications.map(toUiSpecGroup),
    certifications: d.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer ?? undefined,
      reference: c.reference ?? undefined,
    })),
    media: {
      images: d.images.map((i) => toUiImage(i)),
      videos: d.videos.map(toUiVideo),
    },
    documents: d.documents.map(toUiDoc),
    faq: d.faqItems.map((f) => ({
      question: toUiLocalized(f.question) ?? { en: "" },
      answer: toUiLocalized(f.answer) ?? { en: "" },
    })),
    seo: d.seo
      ? {
          title: toUiLocalized(d.seo.title),
          description: toUiLocalized(d.seo.description),
          keywords: d.seo.keywords,
          canonical: d.seo.canonical ?? undefined,
          ogImage: d.seo.ogImage ?? undefined,
        }
      : undefined,
    status: d.status === "PUBLISHED" ? "published" : "draft",
  };
}

// ---------------------------------------------------------------------------
// Category adapter
// ---------------------------------------------------------------------------

const localizedTitleFromDto = (
  dto: CategoryDto,
): Record<"en" | "fa" | "ar", string> => ({
  en: dto.label.en ?? dto.label.fa,
  fa: dto.label.fa,
  ar: dto.label.ar ?? dto.label.fa,
});

const localizedFromCopy = (
  v: { fa: string; en?: string; ar?: string } | undefined,
  fallback: string,
): Record<"en" | "fa" | "ar", string> => {
  if (!v) return { en: fallback, fa: fallback, ar: fallback };
  return { en: v.en ?? v.fa, fa: v.fa, ar: v.ar ?? v.fa };
};

/**
 * Build a UI `Category` from a CategoryDto plus an (optional) list of
 * product summaries belonging to that category, and (optional) editorial
 * copy persisted in `public.category_copy` (Phase 5).
 *
 * When `copy` is supplied, its title / short description take precedence
 * over the enum-derived label so per-slug overrides (e.g.
 * `shower-wheelchairs` vs. `patient-lifts`, both mapped to MOBILITY_AIDS)
 * render correctly.
 */
export function dtoToCategory(
  dto: CategoryDto,
  products: ProductSummaryDto[] = [],
  copy?: CategoryCopyDto | null,
): Category {
  const fallbackTitle = localizedTitleFromDto(dto);
  const title = copy
    ? localizedFromCopy(copy.title, fallbackTitle.fa)
    : fallbackTitle;
  const blurb = localizedFromCopy(copy?.shortDescription, title.fa);
  const slug = copy?.slug ?? ENUM_TO_SLUG[dto.key as DbCategoryKey];
  return {
    key: slug as Category["key"],
    title,
    blurb,
    products: products.map(summaryToProduct),
  };
}
