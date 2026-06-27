/**
 * Release 1.5 — Product Comparison (FEATURE-0006 / RFC-0005).
 *
 * "Add to Compare" toggle attached to product cards. Pure UI — delegates
 * state to `useCompare` (client store). Never touches the repository or
 * service layers (ADR-0001 §3.3).
 */
import { Check, GitCompareArrows } from "lucide-react";

import { Button } from "@/components/ui/button";
import { T, t, type Lang } from "@/lib/i18n";
import {
  COMPARE_MAX,
  useCompare,
} from "@/lib/compare/compare-store";
import type { ProductSummaryDto } from "@/lib/modules/products/product.dto";

export interface CompareButtonProps {
  lang: Lang;
  product: ProductSummaryDto;
  /** Visual density: `sm` for inside cards, `default` for product pages. */
  size?: "sm" | "default";
  className?: string;
}

export function CompareButton({
  lang,
  product,
  size = "sm",
  className,
}: CompareButtonProps) {
  const { has, isFull, toggle } = useCompare();
  const selected = has(product.id);
  const disabled = !selected && isFull;
  const label = selected
    ? t(T.compareRemove, lang)
    : disabled
      ? t(T.compareFull, lang).replace("{max}", String(COMPARE_MAX))
      : t(T.compareAdd, lang);

  return (
    <Button
      type="button"
      variant={selected ? "brand" : "outline"}
      size={size}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={className}
      onClick={(e) => {
        // Cards often wrap the button in a <Link> — stop the navigation.
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
    >
      {selected ? (
        <Check aria-hidden="true" />
      ) : (
        <GitCompareArrows aria-hidden="true" />
      )}
      <span>{label}</span>
    </Button>
  );
}