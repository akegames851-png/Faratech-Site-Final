/**
 * Category repository.
 *
 * Categories are an enum in the schema; this repo aggregates published
 * product counts per category via the products table, and exposes the
 * editorial copy persisted in `public.category_copy` (Phase 5).
 */
import { ProductRepository } from "../products/product.repository";
import { getServerSupabase, type DbClient } from "../shared/supabase-server";

const COPY_SELECT =
  "slug, category_key, title, short_description, full_description, usage, target_audience";

export class CategoryRepository {
  constructor(
    private readonly productRepo: ProductRepository = new ProductRepository(),
    private readonly db: DbClient = getServerSupabase(),
  ) {}

  countsByCategory(): Promise<Record<string, number>> {
    return this.productRepo.countsByCategory();
  }

  async findAllCopy(): Promise<Record<string, unknown>[]> {
    const { data, error } = await this.db
      .from("category_copy")
      .select(COPY_SELECT)
      .order("slug", { ascending: true });
    if (error) throw error;
    return (data as Record<string, unknown>[]) ?? [];
  }

  async findCopyBySlug(slug: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.db
      .from("category_copy")
      .select(COPY_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Record<string, unknown> | null) ?? null;
  }
}
