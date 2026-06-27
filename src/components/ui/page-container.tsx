import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Release 1.2 — Design System
 * Consistent page-level wrapper. Uses shared `.ds-page` token for fluid
 * inline padding and centered max-width so routes do not hardcode spacing.
 * Presentation-only: contains no business logic.
 */
export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "main" | "section" | "article";
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ as: Tag = "div", className, ...props }, ref) => (
    <Tag ref={ref as never} className={cn("ds-page", className)} {...props} />
  ),
);
PageContainer.displayName = "PageContainer";
