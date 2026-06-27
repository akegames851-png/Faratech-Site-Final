/**
 * Product service — business logic layer.
 *
 * Coordinates the repository and mappers. Throws notFound errors when
 * appropriate; the function/controller layer maps those to responses.
 */
import { ProductRepository } from "./product.repository";
import {
  mapProductDetail,
  mapProductSummary,
} from "./product.mapper";
import type {
  ListProductsQuery,
  ListProductsResultDto,
  ProductDetailDto,
  RelatedProductsQuery,
  RelatedProductsResultDto,
  SearchProductsQuery,
  SearchProductsResultDto,
  SearchSuggestionsQuery,
  SearchSuggestionsResultDto,
} from "./product.dto";

export class ProductNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Product not found: ${identifier}`);
    this.name = "ProductNotFoundError";
  }
}

export class ProductService {
  constructor(private readonly repo: ProductRepository = new ProductRepository()) {}

  async getBySlug(slug: string): Promise<ProductDetailDto> {
    const row = await this.repo.findBySlug(slug);
    if (!row) throw new ProductNotFoundError(slug);
    return mapProductDetail(row);
  }

  async list(query: ListProductsQuery): Promise<ListProductsResultDto> {
    const { rows, total } = await this.repo.list(query);
    return { items: rows.map(mapProductSummary), total };
  }

  /**
   * Release 1.1 — Search & Discovery (FEATURE-0002 / RFC-0001).
   *
   * Delegates to the repository so the search storage technology stays
   * swappable. An empty query short-circuits with zero results — the UI
   * uses that to render the idle "type to search" empty state.
   */
  async search(query: SearchProductsQuery): Promise<SearchProductsResultDto> {
    const q = (query.q ?? "").trim();
    if (!q) return { query: "", items: [], total: 0 };
    const { rows, total } = await this.repo.search({ ...query, q });
    return { query: q, items: rows.map(mapProductSummary), total };
  }

  /**
   * Release 1.3 — Related Products (FEATURE-0004 / RFC-0003).
   *
   * Thin delegation to the repository. The selection rule lives ONLY
   * in `ProductRepository.findRelated`; this method exists so server
   * functions, routes and the UI never call the repository directly.
   */
  async getRelated(
    query: RelatedProductsQuery,
  ): Promise<RelatedProductsResultDto> {
    const { rows } = await this.repo.findRelated(query);
    return { items: rows.map(mapProductSummary) };
  }

  /**
   * Release 1.4 — Search Suggestions (FEATURE-0005 / RFC-0004).
   *
   * Thin delegation to the repository. Empty queries short-circuit so
   * the UI can dismiss the suggestion popover without a round-trip.
   */
  async suggest(
    query: SearchSuggestionsQuery,
  ): Promise<SearchSuggestionsResultDto> {
    const q = (query.q ?? "").trim();
    if (!q) return { query: "", items: [] };
    const { rows } = await this.repo.searchSuggestions({ ...query, q });
    return { query: q, items: rows.map(mapProductSummary) };
  }
}