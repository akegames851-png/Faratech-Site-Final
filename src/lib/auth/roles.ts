/**
 * Release 1.10 — RBAC role + permission model (FEATURE-0012 / RFC-0011).
 *
 * Pure data + lookups. No I/O, no framework imports — safe to import from
 * any layer (server functions, middleware, or pure tests).
 *
 * Roles:
 *   - admin  → full access
 *   - editor → create / update / read CMS resources
 *   - viewer → read-only CMS access
 *
 * Permissions are function-level identifiers (e.g. `cms.product.create`).
 * RBAC is enforced server-side; see `permission-middleware.ts`.
 */

export const ROLES = ["admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "cms.product.read",
  "cms.product.create",
  "cms.product.update",
  "cms.product.delete",
  "cms.product.publish",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

/**
 * Static role → permissions matrix. O(1) lookup via Set membership.
 */
const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  admin: new Set<Permission>([
    "cms.product.read",
    "cms.product.create",
    "cms.product.update",
    "cms.product.delete",
    "cms.product.publish",
  ]),
  editor: new Set<Permission>([
    "cms.product.read",
    "cms.product.create",
    "cms.product.update",
  ]),
  viewer: new Set<Permission>(["cms.product.read"]),
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

export function permissionsFor(role: Role): readonly Permission[] {
  return Array.from(ROLE_PERMISSIONS[role]);
}

/**
 * Resolve a role for a given admin username. Reads `ADMIN_ROLES` env (JSON
 * map of username → role) at call time; falls back to `admin` for the
 * configured root admin so the existing single-admin deployment keeps
 * working unchanged.
 *
 * Example:
 *   ADMIN_ROLES = '{"alice":"editor","bob":"viewer"}'
 */
export function resolveRole(username: string): Role {
  const raw = process.env.ADMIN_ROLES?.trim();
  if (raw) {
    try {
      const map = JSON.parse(raw) as Record<string, unknown>;
      const v = map[username];
      if (isRole(v)) return v;
    } catch {
      // Malformed config — fall through to default.
    }
  }
  return "admin";
}
