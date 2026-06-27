/**
 * Release 1.10 — Audit middleware (FEATURE-0012 / RFC-0011).
 *
 * Wraps a server function so that, AFTER the handler completes, an entry
 * is appended to the audit log. Logging is non-blocking — failures inside
 * the audit writer are swallowed (see `audit-log.ts`).
 *
 * Architectural position:
 *   Request → Auth Middleware → Role Check → Server Function → Audit Logger
 *
 * Usage:
 *   .middleware([
 *     requireAdminMiddleware,
 *     requirePermission("cms.product.update"),
 *     withAudit({
 *       action: "cms.product.update",
 *       resource: "product",
 *       resolveResourceId: (data) => data.cmsId,
 *     }),
 *   ])
 */
import { createMiddleware } from "@tanstack/react-start";

import { getAdminSession } from "@/lib/auth/admin-session";
import { isRole, resolveRole } from "@/lib/auth/roles";

import { record, type AuditAction, type AuditResource } from "./audit-log";

type ResolveId = (data: unknown, result: unknown) => string | null | undefined;

export function withAudit(opts: {
  action: AuditAction;
  resource: AuditResource;
  resolveResourceId?: ResolveId;
}) {
  return createMiddleware({ type: "function" }).server(async ({ next, data }) => {
    let outcome: "success" | "failure" = "success";
    let result: unknown;
    let thrown: unknown;
    try {
      result = await next();
    } catch (err) {
      outcome = "failure";
      thrown = err;
    }

    // Fire-and-forget audit write. Never block, never throw upstream.
    try {
      const session = await getAdminSession();
      const username = session.data.username ?? null;
      const role = username
        ? isRole(session.data.role)
          ? session.data.role
          : resolveRole(username)
        : null;

      let resourceId: string | null = null;
      if (opts.resolveResourceId) {
        try {
          const v = opts.resolveResourceId(data, result);
          resourceId = typeof v === "string" && v.length > 0 ? v : null;
        } catch {
          resourceId = null;
        }
      }

      record({
        actor: username,
        role,
        action: opts.action,
        resource: opts.resource,
        resourceId,
        outcome,
      });
    } catch {
      // Audit must never break the request.
    }

    if (outcome === "failure") throw thrown;
    return result as ReturnType<typeof next> extends Promise<infer R> ? R : never;
  });
}
