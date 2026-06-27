import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Release 1.8 — Admin Page Container
 * Standard wrapper for every admin page body. Provides consistent inline
 * padding, max-width, and an optional page header (title / description /
 * actions). All admin routes use this — no per-page layout duplication.
 *
 * Presentation-only. Mirrors the public `PageContainer` token pattern.
 */
export interface AdminPageProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  width?: "full" | "narrow";
  className?: string;
  children: ReactNode;
}

export function AdminPage({
  title,
  description,
  actions,
  width = "full",
  className,
  children,
}: AdminPageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full space-y-4 p-4 md:p-6",
        width === "narrow" ? "max-w-3xl" : "max-w-screen-2xl",
        className,
      )}
    >
      {(title || actions) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            {title && (
              <h1 className="truncate text-xl font-semibold">{title}</h1>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
