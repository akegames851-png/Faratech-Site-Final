/**
 * Release 1.9 — Admin auth middleware for server functions.
 *
 * Attach with `.middleware([requireAdminMiddleware])` on any CMS server
 * function. Without an admin session the call throws Response(401) before
 * the handler runs — so unauthenticated callers can never reach CMS logic.
 */
import { createMiddleware } from "@tanstack/react-start";

import { requireAdmin } from "./admin-session";

export const requireAdminMiddleware = createMiddleware({ type: "function" })
  .server(async ({ next }) => {
    const { username } = await requireAdmin();
    return next({ context: { adminUser: username } });
  });
