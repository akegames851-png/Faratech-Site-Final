/**
 * Release 1.5 — Product Comparison (FEATURE-0006 / RFC-0005).
 *
 * Persistent bottom-anchored "compare tray" that surfaces the user's
 * current selection across navigation. Hidden when nothing is selected.
 *
 * Pure UI — reads from the client compare store and opens the
 * comparison dialog. Logical Tailwind utilities (start/end) keep it
 * RTL-correct.
 */
import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompareDialog } from "@/components/faratech/compare-dialog";
import {
  COMPARE_MAX,
  COMPARE_MIN,
  useCompare,
} from "@/lib/compare/compare-store";
import { T, t, toLocalDigits, type Lang } from "@/lib/i18n";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export interface CompareBarProps {
  lang: Lang;
}

export function CompareBar({ lang }: CompareBarProps) {
  const { items, count, canCompare, remove, clear } = useCompare();
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    track({
      name: next ? ANALYTICS_EVENTS.compareOpened : ANALYTICS_EVENTS.compareClosed,
      selectionSize: count,
      lang,
    });
  }

  if (count === 0) return null;

  const countLabel = t(T.compareCount, lang).replace(
    "{n}",
    toLocalDigits(`${count}/${COMPARE_MAX}`, lang),
  );

  return (
    <>
      <aside
        role="region"
        aria-label={t(T.compareBarTitle, lang)}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.15)]"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-40">
            <div className="text-xs font-semibold text-[var(--brand-navy)]">
              {t(T.compareBarTitle, lang)} · {countLabel}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {canCompare ? "" : t(T.compareBarHint, lang)}
            </div>
          </div>
          <ul className="flex items-center gap-2 list-none p-0 m-0 overflow-x-auto">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-1 ps-2 pe-1 py-1 rounded-md bg-muted text-xs"
              >
                <span className="max-w-32 truncate font-medium text-[var(--brand-navy)]">
                  {p.name}
                </span>
                <button
                  type="button"
                  aria-label={`${t(T.compareRemove, lang)}: ${p.name}`}
                  onClick={() => remove(p.id)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="brand"
              size="sm"
              disabled={!canCompare}
              aria-disabled={!canCompare}
              title={
                canCompare
                  ? t(T.compareOpen, lang)
                  : t(T.compareNotEnough, lang).replace(
                      "2",
                      toLocalDigits(COMPARE_MIN, lang),
                    )
              }
              onClick={() => handleOpenChange(true)}
            >
              {t(T.compareOpen, lang)}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clear}
            >
              {t(T.compareClear, lang)}
            </Button>
          </div>
        </div>
      </aside>
      <CompareDialog lang={lang} open={open} onOpenChange={handleOpenChange} />
    </>
  );
}