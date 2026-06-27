import type { ReactNode } from "react";

import { AdminHeader } from "./admin-header";
import { AdminNav } from "./admin-nav";

/**
 * Release 1.8 — Admin Dashboard Shell
 *
 * Unified layout for all `/admin/*` routes. Composition:
 *
 *   AdminShell
 *     ├── Mock-CMS banner
 *     ├── Desktop sidebar (AdminNav)            — md+
 *     └── Main
 *           ├── AdminHeader (+ mobile drawer)
 *           └── <Outlet /> wrapped in AdminPage by each route
 *
 * Responsive:
 *   - Desktop (≥ md): persistent 14rem sidebar
 *   - Tablet/Mobile (< md): sidebar hidden, accessed via the header's
 *     drawer (Sheet) trigger.
 *
 * Rules:
 *   - Presentation-only. No business logic, no data fetching.
 *   - Reuses Design System primitives (Sheet, Button, tokens).
 *   - Isolated under /admin — never imported from public routes.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-900">
        <strong>Mock CMS</strong> · Phase 1C — in-memory only. No data is
        persisted, no API is called. Reloads reset all changes.
      </div>
      <div className="flex">
        <aside
          className="hidden w-56 shrink-0 border-r bg-background md:block"
          aria-label="Admin navigation"
        >
          <div className="px-4 py-4">
            <div className="text-sm font-semibold tracking-tight">
              FARATECH CMS
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Admin
            </div>
          </div>
          <AdminNav />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
