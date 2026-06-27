import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Release 1.2 — Design System
 * Presentation-only accessible loading spinner. Uses shared motion tokens
 * (`--duration-slow`) and respects `prefers-reduced-motion` via `.ds-spin`.
 */
export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Visible / SR-only label announcing the loading state. */
  label?: string;
  /** Pixel size of the spinner (defaults to 20). */
  size?: number;
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, label = "Loading…", size = 20, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}
      {...props}
    >
      <svg
        className="ds-spin text-current"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  ),
);
LoadingSpinner.displayName = "LoadingSpinner";
