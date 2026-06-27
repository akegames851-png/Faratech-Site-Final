import type {
  CreateProductInput,
  Product,
  ProductCategoryKey,
  ProductListQuery,
  ProductListResult,
  UpdateProductInput,
} from "./types";

/**
 * Repository contract for Product entities.
 *
 * Phase 1C ships ONE implementation — the in-memory adapter
 * (`InMemoryProductRepository`) used by the mock admin UI. The same
 * interface is intended to be implemented verbatim by a future NestJS
 * `ProductsService` backed by Prisma + PostgreSQL.
 *
 * Method semantics:
 * - `list` / `getBySlug` / `getById` are reads. The admin uses
 *   `status: "any"`; public callers should restrict to `published`.
 * - `create` / `update` / `archive` / `publish` / `unpublish` are writes.
 *   In 1C they mutate in-memory state only and DO NOT persist.
 */
export interface ProductRepository {
  list(query?: ProductListQuery): Promise<ProductListResult>;
  getBySlug(
    category: ProductCategoryKey,
    slug: string,
  ): Promise<Product | null>;
  getById(cmsId: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(cmsId: string, input: UpdateProductInput): Promise<Product>;
  archive(cmsId: string): Promise<Product>;
  publish(cmsId: string): Promise<Product>;
  unpublish(cmsId: string): Promise<Product>;
}