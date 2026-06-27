import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminStatus } from "@/lib/auth/auth.functions";

/**
 * Release 1.9 — Admin route guard (FEATURE-0011 / RFC-0010).
 *
 * `beforeLoad` calls the server-validated `getAdminStatus` server fn.
 * Unauthenticated visitors are redirected to `/login` BEFORE the admin
 * layout or any child loader/component runs — so the admin UI is never
 * rendered (server or client) for anonymous users.
 *
 * The guard ALSO carries the original URL as `?redirect=` so the login
 * page can return the visitor to where they intended to go.
 */
export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const status = await getAdminStatus();
    if (!status.isAdmin) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    return { adminUsername: status.username };
  },
  head: () => ({
    meta: [
      { title: "FARATECH CMS — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
