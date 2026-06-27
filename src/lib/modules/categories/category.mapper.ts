import type { CategoryCopyDto, CategoryDto } from "./category.dto";
import type {
  LocalizedText,
  ProductCategoryKey,
} from "../products/product.dto";

/**
 * Built-in labels for each category. Categories themselves are an enum in
 * the source-of-truth schema, so labels live in the application layer.
 */
const LABELS: Record<ProductCategoryKey, LocalizedText> = {
  POWER_WHEELCHAIRS: { fa: "ویلچر برقی", en: "Power Wheelchairs" },
  MANUAL_WHEELCHAIRS: { fa: "ویلچر دستی", en: "Manual Wheelchairs" },
  MOBILITY_AIDS: { fa: "کمک‌حرکتی", en: "Mobility Aids" },
  ACCESSORIES: { fa: "لوازم جانبی", en: "Accessories" },
  SPARE_PARTS: { fa: "قطعات یدکی", en: "Spare Parts" },
};

export const ALL_CATEGORY_KEYS: ProductCategoryKey[] = [
  "POWER_WHEELCHAIRS",
  "MANUAL_WHEELCHAIRS",
  "MOBILITY_AIDS",
  "ACCESSORIES",
  "SPARE_PARTS",
];

export function mapCategory(
  key: ProductCategoryKey,
  count: number,
): CategoryDto {
  return { key, label: LABELS[key], productCount: count };
}

// ---------------------------------------------------------------------------
// Phase 5 — Editorial copy row mapper.
// ---------------------------------------------------------------------------

const toLocalized = (
  v: unknown,
): LocalizedText | undefined => {
  if (!v || typeof v !== "object") return undefined;
  const obj = v as Record<string, unknown>;
  const fa = typeof obj.fa === "string" ? obj.fa : undefined;
  if (!fa) return undefined;
  return {
    fa,
    en: typeof obj.en === "string" ? obj.en : undefined,
    ar: typeof obj.ar === "string" ? obj.ar : undefined,
  };
};

export function mapCategoryCopy(row: Record<string, unknown>): CategoryCopyDto {
  const title = toLocalized(row.title) ?? { fa: String(row.slug ?? "") };
  const shortDescription = toLocalized(row.short_description) ?? title;
  return {
    slug: String(row.slug),
    categoryKey: row.category_key as ProductCategoryKey,
    title,
    shortDescription,
    fullDescription: toLocalized(row.full_description),
    usage: toLocalized(row.usage),
    targetAudience: toLocalized(row.target_audience),
  };
}
