import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Release 1.2 — Design System
 * Presentation-only error state. Announces via `role="alert"`, supports RTL,
 * and pairs with optional retry action supplied by the caller.
 */
export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 py-10 px-6 rounded-lg border border-destructive/30 bg-destructive/5",
        className,
      )}
      {...props}
    >
      <h2 className="text-lg font-semibold text-destructive">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  ),
);
ErrorState.displayName = "ErrorState";
