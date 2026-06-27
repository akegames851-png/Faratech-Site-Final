// FEATURE-0014 — Accessibility Foundations.
//
// Renders a single anchor that becomes visible only when keyboard focus
// reaches it (first tab stop on every page). Clicking / activating it
// jumps the focus and scroll position to the page's `<main>` landmark.
//
// This component is intentionally self-contained:
//   * pure presentation (no repository / service / server-fn imports);
//   * SSR-safe (no `window`, `document`, `localStorage` at module scope);
//   * uses an inline locale dictionary so the canonical `t()` bundle and
//     no other module needs to change.
//
// Architectural note: the runtime boundary validator continues to pass
// because this file imports only from `@/lib/i18n` (presentation-safe).
import { type Lang, t } from "@/lib/i18n";

const LABEL: Record<Lang, string> = {
  en: "Skip to main content",
  fa: "پرش به محتوای اصلی",
  ar: "تخطَّ إلى المحتوى الرئيسي",
};

export const MAIN_CONTENT_ID = "main-content";

export function SkipToContent({ lang }: { lang: Lang }) {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      data-testid="skip-to-content"
      className="ds-skip-link ds-focus-ring"
    >
      {t(LABEL, lang)}
    </a>
  );
}
