/**
 * Release 1.10 — Permission middleware (FEATURE-0012 / RFC-0011).
 *
 * Factory that returns a server-function middleware enforcing a single
 * permission for the current admin session. Must be chained AFTER
 * `requireAdminMiddleware` so the session (and therefore role) is loaded.
 *
 *   .middleware([requireAdminMiddleware, requirePermission("cms.product.update")])
 *
 * On denial the middleware throws `Response(403)` BEFORE the handler runs,
 * so unauthorized roles can never reach the protected logic.
 */
import { createMiddleware } from "@tanstack/react-start";

import { getAdminSession } from "./admin-session";
import {
  hasPermission,
  isRole,
  resolveRole,
  type Permission,
  type Role,
} from "./roles";

export function requirePermission(permission: Permission) {
  return createMiddleware({ type: "function" }).server(async ({ next }) => {
    const session = await getAdminSession();
    if (!session.data.isAdmin || !session.data.username) {
      throw new Response("Unauthorized", { status: 401 });
    }
    // Prefer the role persisted on the session; fall back to env lookup
    // for legacy sessions minted before 1.10.
    const sessionRole: Role = isRole(session.data.role)
      ? session.data.role
      : resolveRole(session.data.username);

    if (!hasPermission(sessionRole, permission)) {
      throw new Response("Forbidden", { status: 403 });
    }

    return next({
      context: {
        adminRole: sessionRole,
        adminPermission: permission,
      },
    });
  });
}
