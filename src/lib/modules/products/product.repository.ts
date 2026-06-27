/**
 * Product repository.
 *
 * Owns ALL data access for products. Service layer must never touch the
 * Supabase client directly — it goes through this repository.
 *
 * Reads only (Phase 3 scope). RLS guarantees only PUBLISHED rows are
 * returned to the public client.
 */
import { getServerSupabase, type DbClient } from "../shared/supabase-server";
import type {
  ListProductsQuery,
  RelatedProductsQuery,
  SearchProductsQuery,
  SearchSuggestionsQuery,
} from "./product.dto";

const DETAIL_SELECT = `
  *,
  product_images(*),
  product_videos(*),
  product_documents(*),
  specification_groups(*, specification_items(*)),
  certifications(*),
  faq_items(*),
  product_seo(*),
  related_from:related_products!related_products_from_id_fkey(
    position,
    to:products!related_products_to_id_fkey(slug)
  )
`;

const SUMMARY_SELECT = `
  id, slug, code, name, category_key, series, short_description, status, updated_at,
  product_images(id, src, width, height, is_primary, position, alt)
`;

export class ProductRepository {
  constructor(private readonly db: DbClient = getServerSupabase()) {}

  async findBySlug(slug: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.db
      .from("products")
      .select(DETAIL_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Record<string, unknown> | null) ?? null;
  }

  async findById(id: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.db
      .from("products")
      .select(DETAIL_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Record<string, unknown> | null) ?? null;
  }

  async list(query: ListProductsQuery): Promise<{
    rows: Record<string, unknown>[];
    total: number;
  }> {
    const limit = Math.min(Math.max(query.limit ?? 24, 1), 100);
    const offset = Math.max(query.offset ?? 0, 0);

    let q = this.db
      .from("products")
      .select(SUMMARY_SELECT, { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (query.categoryKey) q = q.eq("category_key", query.categoryKey);

    const { data, error, count } = await q;
    if (error) throw error;
    return {
      rows: (data as Record<string, unknown>[]) ?? [],
      total: count ?? 0,
    };
  }

  /** Counts of PUBLISHED products grouped by category_key. */
  async countsByCategory(): Promise<Record<string, number>> {
    const { data, error } = await this.db
      .from("products")
      .select("category_key");
    if (error) throw error;
    const out: Record<string, number> = {};
    for (const row of (data ?? []) as { category_key: string }[]) {
      out[row.category_key] = (out[row.category_key] ?? 0) + 1;
    }
    return out;
  }

  /**
   * Release 1.1 — Search & Discovery (FEATURE-0002 / RFC-0001).
   *
   * Free-text search backed by PostgreSQL Full-Text Search on the
   * `search_tsv` generated column (see migration
   * `20260626_search_products_fts`). The 'simple' dictionary keeps the
   * implementation locale-agnostic so fa / en / ar queries all hit the
   * same index without language-specific stemming.
   *
   * For very short queries (1-2 chars) the tsvector tokeniser is too
   * coarse, so we fall back to a trigram-backed `ilike` on `name`. Both
   * branches go through the repository, so higher layers stay unchanged
   * if the storage strategy is swapped later.
   */
  async search(query: SearchProductsQuery): Promise<{
    rows: Record<string, unknown>[];
    total: number;
  }> {
    const raw = (query.q ?? "").trim();
    if (!raw) return { rows: [], total: 0 };

    const limit = Math.min(Math.max(query.limit ?? 24, 1), 100);
    const offset = Math.max(query.offset ?? 0, 0);

    // Tokenise on whitespace + common separators. Strip tsquery-reserved
    // characters so attacker-controlled input cannot break the query.
    const tokens = raw
      .split(/[\s,;()<>!&|:*'"\\]+/u)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const useFts = tokens.length > 0 && tokens.some((t) => t.length >= 3);

    let q = this.db
      .from("products")
      .select(SUMMARY_SELECT, { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (query.categoryKey) q = q.eq("category_key", query.categoryKey);

    if (useFts) {
      // Prefix-match each token and AND them together so multi-word
      // queries narrow the result set rather than widening it.
      const tsQuery = tokens.map((t) => `${t}:*`).join(" & ");
      q = q.textSearch("search_tsv", tsQuery, { config: "simple" });
    } else {
      // Short query → trigram-backed substring match on the canonical name.
      const safe = raw.replace(/[%_\\]/g, (m) => `\\${m}`);
      q = q.ilike("name", `%${safe}%`);
    }

    const { data, error, count } = await q;
    if (error) throw error;
    return {
      rows: (data as Record<string, unknown>[]) ?? [],
      total: count ?? 0,
    };
  }

  /**
   * Release 1.3 — Related Products (FEATURE-0004 / RFC-0003).
   *
   * Returns same-category PUBLISHED products, excluding the current
   * product, ordered deterministically (most-recently-updated first).
   * Per RFC-0003 the selection logic lives ONLY in the repository so
   * higher layers stay swappable when the strategy evolves.
   */
  async findRelated(query: RelatedProductsQuery): Promise<{
    rows: Record<string, unknown>[];
  }> {
    const limit = Math.min(Math.max(query.limit ?? 6, 1), 24);
    const { data, error } = await this.db
      .from("products")
      .select(SUMMARY_SELECT)
      .eq("category_key", query.categoryKey)
      .neq("id", query.productId)
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { rows: (data as Record<string, unknown>[]) ?? [] };
  }

  /**
   * Release 1.4 — Search Suggestions (FEATURE-0005 / RFC-0004).
   *
   * Deterministic predictive matches for the in-progress query. Reuses
   * the same FTS column / trigram fallback as `search()` so suggestion
   * relevance stays consistent with the full results page. Returns only
   * a small page (UI default 8) without a total count to keep the path
   * lightweight — per RFC-0004 §Performance.
   */
  async searchSuggestions(query: SearchSuggestionsQuery): Promise<{
    rows: Record<string, unknown>[];
  }> {
    const raw = (query.q ?? "").trim();
    if (!raw) return { rows: [] };

    const limit = Math.min(Math.max(query.limit ?? 8, 1), 20);

    const tokens = raw
      .split(/[\s,;()<>!&|:*'"\\]+/u)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const useFts = tokens.length > 0 && tokens.some((t) => t.length >= 3);

    let q = this.db
      .from("products")
      .select(SUMMARY_SELECT)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (useFts) {
      const tsQuery = tokens.map((t) => `${t}:*`).join(" & ");
      q = q.textSearch("search_tsv", tsQuery, { config: "simple" });
    } else {
      const safe = raw.replace(/[%_\\]/g, (m) => `\\${m}`);
      q = q.ilike("name", `%${safe}%`);
    }

    const { data, error } = await q;
    if (error) throw error;
    return { rows: (data as Record<string, unknown>[]) ?? [] };
  }
}