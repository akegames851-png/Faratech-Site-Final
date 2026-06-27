/**
 * Release 1.10 — Audit log read endpoint (FEATURE-0012 / RFC-0011).
 *
 * Admin-only RPC for inspecting recent audit entries. Read-only — the
 * underlying buffer is append-only and exposes no mutation surface.
 *
 * Guard chain: admin auth → `cms.product.read` permission (every defined
 * role holds it, so any signed-in admin/editor/viewer may inspect logs).
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminMiddleware } from "@/lib/auth/admin-middleware";
import { requirePermission } from "@/lib/auth/permission-middleware";

import { list, type AuditEntry } from "./audit-log";

const QuerySchema = z
  .object({ limit: z.number().int().min(1).max(500).optional() })
  .optional();

export const listAuditEntries = createServerFn({ method: "GET" })
  .middleware([requireAdminMiddleware, requirePermission("cms.product.read")])
  .inputValidator((d: unknown) => QuerySchema.parse(d ?? {}) ?? {})
  .handler(async ({ data }): Promise<readonly AuditEntry[]> => {
    return list(data?.limit ?? 100);
  });
