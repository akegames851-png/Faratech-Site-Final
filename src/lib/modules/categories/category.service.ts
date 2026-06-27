import type { CategoryCopyDto, CategoryDto } from "./category.dto";
import { CategoryRepository } from "./category.repository";
import {
  ALL_CATEGORY_KEYS,
  mapCategory,
  mapCategoryCopy,
} from "./category.mapper";

export class CategoryService {
  constructor(
    private readonly repo: CategoryRepository = new CategoryRepository(),
  ) {}

  async list(): Promise<CategoryDto[]> {
    const counts = await this.repo.countsByCategory();
    return ALL_CATEGORY_KEYS.map((k) => mapCategory(k, counts[k] ?? 0));
  }

  /** All editorial copy rows, keyed by their public URL slug. */
  async listCopy(): Promise<CategoryCopyDto[]> {
    const rows = await this.repo.findAllCopy();
    return rows.map(mapCategoryCopy);
  }

  async getCopyBySlug(slug: string): Promise<CategoryCopyDto | null> {
    const row = await this.repo.findCopyBySlug(slug);
    return row ? mapCategoryCopy(row) : null;
  }
}
