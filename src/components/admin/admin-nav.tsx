import { Link, useRouterState } from "@tanstack/react-router";
import { Database, FileText, Image as ImageIcon, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Release 1.8 — Admin Dashboard System
 * Single source of truth for admin navigation. Rendered inside the
 * desktop sidebar AND the mobile drawer so both stay in sync.
 *
 * Presentation-only. Reuses Design System tokens (bg-background, muted,
 * foreground) — no hardcoded colors.
 */

type NavItem = {
  label: string;
  to?: string;
  icon: typeof Database;
  badge?: string;
  disabled?: boolean;
};

export const ADMIN_NAV: NavItem[] = [
  { label: "Products", to: "/admin/products", icon: Database },
  { label: "Articles", icon: FileText, badge: "Soon", disabled: true },
  { label: "Media", icon: ImageIcon, badge: "Later", disabled: true },
  { label: "Settings", icon: Settings, disabled: true },
];

export function AdminNav({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5 px-2 pb-4">
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          !!item.to &&
          (pathname === item.to || pathname.startsWith(item.to + "/"));
        const base =
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors";
        if (item.disabled || !item.to) {
          return (
            <div
              key={item.label}
              className={cn(
                base,
                "cursor-not-allowed text-muted-foreground/60",
              )}
              aria-disabled="true"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  {item.badge}
                </span>
              )}
            </div>
          );
        }
        return (
          <Link
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              base,
              active
                ? "bg-foreground/5 font-medium text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
