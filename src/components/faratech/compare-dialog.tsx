/**
 * Release 1.5 — Product Comparison (FEATURE-0006 / RFC-0005).
 *
 * Side-by-side comparison modal. Pure client aggregation — composes the
 * existing `ProductSummaryDto`s held in the compare store; no network,
 * no repository, no service call.
 *
 * Accessibility (RFC-0005 §Accessibility):
 *   - dialog via Radix (focus trap + Esc + aria-modal);
 *   - semantic <table> with <th scope> headers;
 *   - differing rows annotated with a screen-reader badge;
 *   - keyboard-removable items (button per column).
 *
 * Layout: horizontal scroll on narrow viewports keeps the table accessible
 * on mobile per RFC-0005 §UI Strategy ("responsive collapse mode").
 */
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompare } from "@/lib/compare/compare-store";
import { enumToSlug } from "@/lib/category-slug";
import { formatDate, T, t, type Lang } from "@/lib/i18n";
import type { ProductSummaryDto } from "@/lib/modules/products/product.dto";

export interface CompareDialogProps {
  lang: Lang;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Row = {
  key: string;
  label: string;
  value: (p: ProductSummaryDto) => string;
};

function buildRows(lang: Lang): Row[] {
  const localized = (
    v: { fa: string; en?: string; ar?: string } | null | undefined,
  ): string => (v ? (v[lang] ?? v.fa ?? "") : "");
  return [
    { key: "name", label: t(T.compareAttrName, lang), value: (p) => p.name },
    { key: "code", label: t(T.compareAttrCode, lang), value: (p) => p.code ?? "—" },
    {
      key: "category",
      label: t(T.compareAttrCategory, lang),
      value: (p) => p.categoryKey,
    },
    {
      key: "series",
      label: t(T.compareAttrSeries, lang),
      value: (p) => localized(p.series) || "—",
    },
    {
      key: "shortDescription",
      label: t(T.compareAttrShort, lang),
      value: (p) => localized(p.shortDescription) || "—",
    },
    { key: "status", label: t(T.compareAttrStatus, lang), value: (p) => p.status },
    {
      key: "updatedAt",
      label: t(T.compareAttrUpdated, lang),
      value: (p) => (p.updatedAt ? formatDate(p.updatedAt, lang) : "—"),
    },
  ];
}

/**
 * A row is "different" when at least two columns disagree on the displayed
 * value. Differences are highlighted visually + announced via aria-label.
 */
function isDifferent(values: string[]): boolean {
  if (values.length < 2) return false;
  const first = values[0];
  return values.some((v) => v !== first);
}

export function CompareDialog({ lang, open, onOpenChange }: CompareDialogProps) {
  const { items, remove, canCompare } = useCompare();
  const rows = buildRows(lang);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[min(96vw,72rem)] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t(T.compareDialogTitle, lang)}</DialogTitle>
          <DialogDescription>
            {t(T.compareDialogDescription, lang)}
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t(T.compareEmpty, lang)}
          </p>
        ) : !canCompare ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t(T.compareNotEnough, lang)}
          </p>
        ) : (
          <div className="overflow-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className="min-w-32 align-bottom">
                    {t(T.compareAttribute, lang)}
                  </TableHead>
                  {items.map((p) => {
                    const slug = enumToSlug(p.categoryKey);
                    return (
                      <TableHead
                        scope="col"
                        key={p.id}
                        className="min-w-48 align-top"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="aspect-[4/3] bg-[var(--brand-silver)] rounded border border-border flex items-center justify-center overflow-hidden">
                            {p.primaryImage ? (
                              <img
                                src={p.primaryImage.src}
                                alt={
                                  p.primaryImage.alt?.[lang] ??
                                  p.primaryImage.alt?.fa ??
                                  p.name
                                }
                                loading="lazy"
                                className="w-full h-full object-contain"
                              />
                            ) : null}
                          </div>
                          <div className="font-semibold text-[var(--brand-navy)] leading-snug">
                            {p.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`/${lang}/products/${slug}/${p.slug}`}
                              className="text-xs font-semibold text-[var(--brand-red)] underline-offset-2 hover:underline"
                            >
                              {t(T.compareViewProduct, lang)}
                            </a>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              aria-label={`${t(T.compareRemove, lang)}: ${p.name}`}
                              onClick={() => remove(p.id)}
                            >
                              <X aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const values = items.map((p) => row.value(p));
                  const differs = isDifferent(values);
                  return (
                    <TableRow
                      key={row.key}
                      className={differs ? "bg-[var(--brand-red)]/5" : undefined}
                    >
                      <TableHead
                        scope="row"
                        className="font-medium text-muted-foreground align-top"
                      >
                        <span>{row.label}</span>
                        <span className="sr-only">
                          {" "}
                          — {differs ? t(T.compareDifference, lang) : t(T.compareSame, lang)}
                        </span>
                      </TableHead>
                      {values.map((v, i) => (
                        <TableCell
                          key={items[i].id}
                          className={
                            differs
                              ? "font-medium text-[var(--brand-navy)] align-top"
                              : "align-top"
                          }
                          dir={row.key === "code" ? "ltr" : undefined}
                        >
                          {v}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}