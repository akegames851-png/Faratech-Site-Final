import type { ProductCategoryKey, LocalizedText } from "../products/product.dto";

export interface CategoryDto {
  key: ProductCategoryKey;
  label: LocalizedText;
  productCount: number;
}

/**
 * Phase 5 — editorial copy persisted in `public.category_copy`.
 *
 * Keyed by the public URL slug (kebab-case) so legacy slugs that share a
 * database enum (e.g. `shower-wheelchairs`, `patient-lifts`,
 * `mobility-scooters` all → `MOBILITY_AIDS`) keep distinct long-form copy.
 */
export interface CategoryCopyDto {
  slug: string;
  categoryKey: ProductCategoryKey;
  title: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription?: LocalizedText;
  usage?: LocalizedText;
  targetAudience?: LocalizedText;
}
