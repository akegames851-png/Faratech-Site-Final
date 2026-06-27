import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CategoryCopyDto, CategoryDto } from "./category.dto";
import { CategoryService } from "./category.service";

export const listCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<CategoryDto[]> => {
    const service = new CategoryService();
    return service.list();
  },
);

export const listCategoryCopies = createServerFn({ method: "GET" }).handler(
  async (): Promise<CategoryCopyDto[]> => {
    const service = new CategoryService();
    return service.listCopy();
  },
);

const GetCopyInput = z.object({ slug: z.string().min(1) });

export const getCategoryCopy = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => GetCopyInput.parse(d))
  .handler(async ({ data }): Promise<CategoryCopyDto | null> => {
    const service = new CategoryService();
    return service.getCopyBySlug(data.slug);
  });
