import { InMemoryProductRepository } from "./in-memory-repository";
import type { ProductRepository } from "./repository";

export * from "./types";
export type { ProductRepository } from "./repository";
export { InMemoryProductRepository } from "./in-memory-repository";
export * from "./validation";

/**
 * Singleton repository used by the mock admin UI (Phase 1C).
 *
 * Public product pages MUST NOT depend on this — they continue to read
 * from the static `CATEGORIES` catalog in `src/lib/products.ts`. When
 * the real backend lands in Phase 2A, this export will be replaced by a
 * thin HTTP/server-fn adapter that implements the same
 * `ProductRepository` interface.
 */
export const productRepository: ProductRepository =
  new InMemoryProductRepository();