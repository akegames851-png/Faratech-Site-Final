/**
 * Phase 4 — Category slug mapping.
 *
 * The UI URLs use kebab-case category slugs (e.g. `/fa/products/power-wheelchairs`),
 * while the database enum uses UPPER_SNAKE_CASE keys
 * (`POWER_WHEELCHAIRS`, …). Routes accept ANY kebab slug and translate it
 * here before calling the backend service layer. Legacy slugs that pre-date
 * the new enum are aliased to the closest available enum so existing URLs
 * keep resolving once Phase 5 (data migration) is complete.
 */
import type { ProductCategoryKey as UiCategoryKey } from "./products";

export type DbCategoryKey =
  | "POWER_WHEELCHAIRS"
  | "MANUAL_WHEELCHAIRS"
  | "MOBILITY_AIDS"
  | "ACCESSORIES"
  | "SPARE_PARTS";

/** Canonical kebab slug per DB enum (used when rendering links). */
export const ENUM_TO_SLUG: Record<DbCategoryKey, string> = {
  POWER_WHEELCHAIRS: "power-wheelchairs",
  MANUAL_WHEELCHAIRS: "manual-wheelchairs",
  MOBILITY_AIDS: "mobility-aids",
  ACCESSORIES: "accessories",
  SPARE_PARTS: "spare-parts",
};

/**
 * Slug → enum lookup. Includes the 5 canonical slugs above plus legacy
 * aliases from Phase 1/2 so existing URLs continue to resolve.
 */
export const SLUG_TO_ENUM: Record<string, DbCategoryKey> = {
  "power-wheelchairs": "POWER_WHEELCHAIRS",
  "manual-wheelchairs": "MANUAL_WHEELCHAIRS",
  "mobility-aids": "MOBILITY_AIDS",
  accessories: "ACCESSORIES",
  "spare-parts": "SPARE_PARTS",
  // Legacy slugs preserved per Phase 4 requirement.
  "shower-wheelchairs": "MOBILITY_AIDS",
  "patient-lifts": "MOBILITY_AIDS",
  "mobility-scooters": "MOBILITY_AIDS",
};

export const slugToEnum = (slug: string): DbCategoryKey | undefined =>
  SLUG_TO_ENUM[slug];

export const enumToSlug = (key: DbCategoryKey): string => ENUM_TO_SLUG[key];

/**
 * UI Category type uses kebab keys (`power-wheelchairs`). For category pages
 * we want to keep the URL slug as the displayed key so existing components
 * keep working unchanged.
 */
export const enumToUiKey = (key: DbCategoryKey): UiCategoryKey => {
  // The UI `ProductCategoryKey` union accepts the 5 legacy slugs; the new
  // enums map to a slug string that is structurally compatible.
  return enumToSlug(key) as UiCategoryKey;
};
