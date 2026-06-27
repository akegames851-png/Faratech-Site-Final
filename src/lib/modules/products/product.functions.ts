/**
 * Product "controller" — exposes the service via TanStack server functions.
 *
 * This is the public-facing RPC surface. Validates input with Zod, calls
 * the service, returns DTOs. No business logic lives here.
 */
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { z } from "zod";

import { ProductService, ProductNotFoundError } from "./product.service";
import type {
  ListProductsResultDto,
  ProductDetailDto,
  RelatedProductsResultDto,
  SearchProductsResultDto,
  SearchSuggestionsResultDto,
} from "./product.dto";

const CategorySchema = z.enum([
  "POWER_WHEELCHAIRS",
  "MANUAL_WHEELCHAIRS",
  "MOBILITY_AIDS",
  "ACCESSORIES",
  "SPARE_PARTS",
]);

const ListSchema = z.object({
  categoryKey: CategorySchema.optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

const SlugSchema = z.object({
  slug: z.string().min(1).max(200),
});

const SearchSchema = z.object({
  // Empty string is allowed so the route can render its idle state
  // without throwing — the service short-circuits to zero results.
  q: z.string().max(200).default(""),
  categoryKey: CategorySchema.optional(),
  limit: z.number().int().min(1).max(50).optional(),
  offset: z.number().int().min(0).optional(),
});

const RelatedSchema = z.object({
  productId: z.string().uuid(),
  categoryKey: CategorySchema,
  limit: z.number().int().min(1).max(24).optional(),
});

const SuggestionsSchema = z.object({
  // Empty string is allowed so the UI can call without a guard while
  // typing; the service short-circuits to zero items.
  q: z.string().max(200).default(""),
  limit: z.number().int().min(1).max(20).optional(),
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => ListSchema.parse(d ?? {}))
  .handler(async ({ data }): Promise<ListProductsResultDto> => {
    const service = new ProductService();
    return service.list(data);
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => SlugSchema.parse(d))
  .handler(async ({ data }): Promise<ProductDetailDto> => {
    const service = new ProductService();
    try {
      return await service.getBySlug(data.slug);
    } catch (err) {
      if (err instanceof ProductNotFoundError) throw notFound();
      throw err;
    }
  });

/**
 * Release 1.1 — Search & Discovery (FEATURE-0002 / RFC-0001).
 *
 * Public search endpoint. Validates input with Zod and delegates to
 * `ProductService.search` — no business logic lives here.
 */
export const searchProducts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => SearchSchema.parse(d ?? {}))
  .handler(async ({ data }): Promise<SearchProductsResultDto> => {
    const service = new ProductService();
    return service.search(data);
  });
/**
 * Release 1.3 — Related Products (FEATURE-0004 / RFC-0003).
 *
 * Public endpoint returning same-category related products. Validates
 * input with Zod and delegates to `ProductService.getRelated` — no
 * business logic lives here.
 */
export const getRelatedProducts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => RelatedSchema.parse(d))
  .handler(async ({ data }): Promise<RelatedProductsResultDto> => {
    const service = new ProductService();
    return service.getRelated(data);
  });

/**
 * Release 1.4 — Search Suggestions (FEATURE-0005 / RFC-0004).
 *
 * Predictive suggestions while the user is typing. Validation lives
 * here; ranking lives in the repository — no business logic in this
 * controller layer.
 */
export const searchSuggestions = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => SuggestionsSchema.parse(d ?? {}))
  .handler(async ({ data }): Promise<SearchSuggestionsResultDto> => {
    const service = new ProductService();
    return service.suggest(data);
  });
