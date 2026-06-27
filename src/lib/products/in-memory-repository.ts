import { CATEGORIES, type ProductCategoryKey } from "../products";
import type { ProductRepository } from "./repository";
import type {
  CreateProductInput,
  Product,
  ProductListQuery,
  ProductListResult,
  UpdateProductInput,
} from "./types";
import { validateProduct } from "./validation";

type Stored = {
  cmsId: string;
  category: ProductCategoryKey;
  product: Product;
};

const genId = () =>
  `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

const nowIso = () => new Date().toISOString();

/**
 * In-memory `ProductRepository`. Phase 1C only.
 *
 * - Seeds from the existing static `CATEGORIES` catalog so the mock CMS
 *   shows the real 38 products on first load.
 * - State lives in a module-level `Map`. Reloads reset everything.
 * - Never calls the network. Never persists. Never mutates the static
 *   `CATEGORIES` array.
 */
export class InMemoryProductRepository implements ProductRepository {
  private store = new Map<string, Stored>();
  private seeded = false;

  private ensureSeeded() {
    if (this.seeded) return;
    for (const cat of CATEGORIES) {
      for (const p of cat.products) {
        const cmsId = p.cmsId ?? genId();
        const seeded: Product = {
          ...p,
          cmsId,
          status: p.status ?? "published",
          createdAt: p.createdAt ?? nowIso(),
          updatedAt: p.updatedAt ?? nowIso(),
        };
        // Phase 2A — surface validation issues from the master overlay
        // during dev seed; never throw, never block.
        const result = validateProduct(seeded);
        if (!result.ok && typeof console !== "undefined") {
          console.warn(
            `[products] Validation issues for ${cat.key}/${seeded.slug}:`,
            result.issues,
          );
        }
        this.store.set(cmsId, { cmsId, category: cat.key, product: seeded });
      }
    }
    this.seeded = true;
  }

  private snapshot(): Stored[] {
    this.ensureSeeded();
    return Array.from(this.store.values());
  }

  async list(query: ProductListQuery = {}): Promise<ProductListResult> {
    const {
      category,
      status = "any",
      search,
      limit = 100,
      offset = 0,
    } = query;
    const needle = search?.trim().toLowerCase();
    const all = this.snapshot()
      .filter((s) => (category ? s.category === category : true))
      .filter((s) =>
        status === "any" ? true : (s.product.status ?? "published") === status,
      )
      .filter((s) =>
        !needle
          ? true
          : s.product.slug.toLowerCase().includes(needle) ||
            s.product.name.toLowerCase().includes(needle) ||
            (s.product.code ?? "").toLowerCase().includes(needle),
      )
      .sort((a, b) =>
        (b.product.updatedAt ?? "").localeCompare(a.product.updatedAt ?? ""),
      );

    const page = all.slice(offset, offset + limit);
    return {
      items: page.map((s) => ({ ...s.product, category: s.category })),
      total: all.length,
      limit,
      offset,
    };
  }

  async getBySlug(category: ProductCategoryKey, slug: string) {
    return (
      this.snapshot().find(
        (s) => s.category === category && s.product.slug === slug,
      )?.product ?? null
    );
  }

  async getById(cmsId: string) {
    this.ensureSeeded();
    return this.store.get(cmsId)?.product ?? null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    this.ensureSeeded();
    const cmsId = genId();
    const product: Product = {
      ...input.product,
      cmsId,
      status: input.product.status ?? "draft",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.store.set(cmsId, { cmsId, category: input.category, product });
    return product;
  }

  async update(cmsId: string, input: UpdateProductInput): Promise<Product> {
    this.ensureSeeded();
    const existing = this.store.get(cmsId);
    if (!existing) throw new Error(`Product not found: ${cmsId}`);
    const next: Product = {
      ...existing.product,
      ...input.product,
      cmsId,
      createdAt: existing.product.createdAt,
      updatedAt: nowIso(),
    };
    this.store.set(cmsId, {
      cmsId,
      category: input.category ?? existing.category,
      product: next,
    });
    return next;
  }

  private async setStatus(cmsId: string, status: Product["status"]) {
    return this.update(cmsId, { product: { status } });
  }

  archive(cmsId: string) {
    return this.setStatus(cmsId, "archived");
  }
  publish(cmsId: string) {
    return this.setStatus(cmsId, "published");
  }
  unpublish(cmsId: string) {
    return this.setStatus(cmsId, "draft");
  }
}