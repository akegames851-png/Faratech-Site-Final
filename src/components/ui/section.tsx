import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Release 1.2 — Design System
 * Consistent vertical section rhythm using the shared `.ds-section` token.
 * Presentation-only; safe for SSR and RTL/LTR.
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={cn("ds-section", className)} {...props} />
  ),
);
Section.displayName = "Section";
