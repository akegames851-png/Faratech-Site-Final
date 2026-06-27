import type {
  Product,
  ProductCategoryKey,
  ProductStatus,
} from "../products";

export type { Product, ProductCategoryKey, ProductStatus };

/**
 * Phase 1C — Product CMS Foundation DTOs.
 *
 * These types describe the contract that the future NestJS / Prisma
 * `ProductsService` MUST implement. They live next to the schema so they
 * never drift from `src/lib/products.ts` and `docs/005_PRODUCT_MODEL.md`.
 */

export type ValidationIssue = {
  path: string[];
  code: string;
  message: string;
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; issues: ValidationIssue[] };

export type ProductListQuery = {
  category?: ProductCategoryKey;
  status?: ProductStatus | "any";
  search?: string;
  limit?: number;
  offset?: number;
};

export type ProductListItem = Product & {
  category: ProductCategoryKey;
};

export type ProductListResult = {
  items: ProductListItem[];
  total: number;
  limit: number;
  offset: number;
};

/**
 * Input shape for creating a product. `category` is required because the
 * static catalog is organized by category and the future Prisma schema
 * uses `categoryKey` as a foreign key.
 */
export type CreateProductInput = {
  category: ProductCategoryKey;
  product: Omit<Product, "cmsId" | "createdAt" | "updatedAt">;
};

export type UpdateProductInput = {
  category?: ProductCategoryKey;
  product: Partial<Omit<Product, "cmsId" | "createdAt" | "updatedAt">>;
};