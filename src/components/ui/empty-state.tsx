import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Release 1.2 — Design System
 * Presentation-only empty state. RTL-safe (uses logical text alignment),
 * accessible (semantic heading), and reusable across routes.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 py-12 px-6 rounded-lg border border-dashed border-border bg-card",
        className,
      )}
      {...props}
    >
      {icon ? <div className="text-muted-foreground" aria-hidden="true">{icon}</div> : null}
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";
