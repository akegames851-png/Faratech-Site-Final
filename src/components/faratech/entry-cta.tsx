import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { type Lang, t } from "@/lib/i18n";

/**
 * Release 1.12.0 — Entry UX layer (minimal).
 * Two clear CTAs on the homepage: public browse vs. admin login.
 * SSR-safe, no client state, uses existing design-system Button only.
 */
const COPY = {
  continueAsUser: { en: "Continue as User", fa: "ادامه به‌عنوان کاربر", ar: "المتابعة كمستخدم" },
  adminLogin: { en: "Admin Login", fa: "ورود مدیر", ar: "دخول المدير" },
} as const;

export function EntryCta({ lang }: { lang: Lang }) {
  return (
    <section
      aria-label="Entry"
      className="ds-section border-b border-border bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild variant="brand" size="lg">
          <Link to="/$lang/products" params={{ lang }}>
            {t(COPY.continueAsUser, lang)}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/login">{t(COPY.adminLogin, lang)}</Link>
        </Button>
      </div>
    </section>
  );
}
