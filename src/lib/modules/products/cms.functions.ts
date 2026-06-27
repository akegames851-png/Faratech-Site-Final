/**
 * Release 1.9 — Protected CMS server functions (FEATURE-0011 / RFC-0010).
 * Release 1.10 — RBAC permission gating + audit logging
 *                (FEATURE-0012 / RFC-0011).
 *
 * Architectural position:
 *   Request → Auth Middleware → Role Check → Server Function → Audit Logger
 *
 * Every export is guarded by THREE middlewares in order:
 *   1. `requireAdminMiddleware`       — must be authenticated as admin.
 *   2. `requirePermission(<perm>)`    — role must hold the function-level
 *                                       permission (server-side RBAC; UI
 *                                       restrictions are non-authoritative).
 *   3. `withAudit({...})`             — append-only, non-blocking log entry
 *                                       recorded after the handler runs.
 *
 * No business logic lives in this file; the repository owns mutation rules.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminMiddleware } from "@/lib/auth/admin-middleware";
import { requirePermission } from "@/lib/auth/permission-middleware";
import { withAudit } from "@/lib/audit/audit-middleware";
import { productRepository } from "@/lib/products/index";
import type { Product, ProductCategoryKey, ProductStatus } from "@/lib/products/types";

const CategoryKey = z.enum([
  "power-wheelchairs",
  "manual-wheelchairs",
  "shower-wheelchairs",
  "patient-lifts",
  "mobility-scooters",
]);

const StatusEnum = z.enum(["draft", "published", "archived"]);

const ListSchema = z.object({
  category: CategoryKey.optional(),
  status: z.union([StatusEnum, z.literal("any")]).optional(),
  search: z.string().max(200).optional(),
  limit: z.number().int().min(1).max(200).optional(),
  offset: z.number().int().min(0).optional(),
});

const IdSchema = z.object({ cmsId: z.string().min(1) });

const ProductPayloadSchema = z
  .object({
    slug: z.string().min(1).max(200),
    name: z.string().min(1).max(200),
    status: StatusEnum.optional(),
  })
  .passthrough();

const CreateSchema = z.object({
  category: CategoryKey,
  product: ProductPayloadSchema,
});

const UpdateSchema = z.object({
  cmsId: z.string().min(1),
  category: CategoryKey.optional(),
  product: ProductPayloadSchema.partial(),
});

export const cmsListProducts = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware, requirePermission("cms.product.read")])
  .inputValidator((d: unknown) => ListSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    return productRepository.list({
      category: data.category as ProductCategoryKey | undefined,
      status: data.status as ProductStatus | "any" | undefined,
      search: data.search,
      limit: data.limit,
      offset: data.offset,
    });
  });

export const cmsGetProduct = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware, requirePermission("cms.product.read")])
  .inputValidator((d: unknown) => IdSchema.parse(d))
  .handler(async ({ data }): Promise<Product | null> => {
    return productRepository.getById(data.cmsId);
  });

export const cmsCreateProduct = createServerFn({ method: "POST" })
  .middleware([
    requireAdminMiddleware,
    requirePermission("cms.product.create"),
    withAudit({
      action: "cms.product.create",
      resource: "product",
      resolveResourceId: (_data, result) =>
        (result as { id?: string } | null | undefined)?.id ?? null,
    }),
  ])
  .inputValidator((d: unknown) => CreateSchema.parse(d))
  .handler(async ({ data }): Promise<Product> => {
    return productRepository.create({
      category: data.category,
      product: data.product as unknown as Product,
    });
  });

export const cmsUpdateProduct = createServerFn({ method: "POST" })
  .middleware([
    requireAdminMiddleware,
    requirePermission("cms.product.update"),
    withAudit({
      action: "cms.product.update",
      resource: "product",
      resolveResourceId: (data) => (data as { cmsId?: string } | null)?.cmsId ?? null,
    }),
  ])
  .inputValidator((d: unknown) => UpdateSchema.parse(d))
  .handler(async ({ data }): Promise<Product> => {
    return productRepository.update(data.cmsId, {
      category: data.category,
      product: data.product as unknown as Partial<Product>,
    });
  });

export const cmsPublishProduct = createServerFn({ method: "POST" })
  .middleware([
    requireAdminMiddleware,
    requirePermission("cms.product.publish"),
    withAudit({
      action: "cms.product.publish",
      resource: "product",
      resolveResourceId: (data) => (data as { cmsId?: string } | null)?.cmsId ?? null,
    }),
  ])
  .inputValidator((d: unknown) => IdSchema.parse(d))
  .handler(async ({ data }) => productRepository.publish(data.cmsId));

export const cmsUnpublishProduct = createServerFn({ method: "POST" })
  .middleware([
    requireAdminMiddleware,
    requirePermission("cms.product.publish"),
    withAudit({
      action: "cms.product.unpublish",
      resource: "product",
      resolveResourceId: (data) => (data as { cmsId?: string } | null)?.cmsId ?? null,
    }),
  ])
  .inputValidator((d: unknown) => IdSchema.parse(d))
  .handler(async ({ data }) => productRepository.unpublish(data.cmsId));

export const cmsArchiveProduct = createServerFn({ method: "POST" })
  .middleware([
    requireAdminMiddleware,
    requirePermission("cms.product.delete"),
    withAudit({
      action: "cms.product.archive",
      resource: "product",
      resolveResourceId: (data) => (data as { cmsId?: string } | null)?.cmsId ?? null,
    }),
  ])
  .inputValidator((d: unknown) => IdSchema.parse(d))
  .handler(async ({ data }) => productRepository.archive(data.cmsId));
