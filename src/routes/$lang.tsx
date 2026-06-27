import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navigation } from "@/components/faratech/navigation";
import { Footer } from "@/components/faratech/footer";
import { CompareBar } from "@/components/faratech/compare-bar";
import { SkipToContent, MAIN_CONTENT_ID } from "@/components/faratech/skip-to-content";
import { isLang, dirOf, htmlLangDirScript, type Lang } from "@/lib/i18n";
import { getCompanyProfile } from "@/lib/modules/company/company.functions";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => { if (!isLang(params.lang)) throw notFound(); },
  // Phase 4: company profile is fetched through the existing server fn so
  // the database is the runtime source of truth. Returns null until the
  // company_profile row is seeded (Phase 5); UI falls back gracefully.
  loader: async () => {
    try {
      const company = await getCompanyProfile();
      return { company };
    } catch (err) {
      console.error("[company] failed to load profile", err);
      return { company: null };
    }
  },
  // Phase 9: set html.lang/dir before hydration so RTL layouts have no FOUC
  // and crawlers see the correct `lang` attribute in the initial document.
  head: ({ params }) => {
    const lang = (params?.lang as Lang) ?? "fa";
    return {
      scripts: [{ children: htmlLangDirScript(lang) }],
    };
  },
  errorComponent: ({ error }) => (
    <div className="max-w-2xl mx-auto p-8 text-sm text-red-600">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8">Not found.</div>,
  component: LangLayout,
});

function LangLayout() {
  const { lang } = Route.useParams();
  const l = lang as Lang;
  // Client-side fallback for soft navigations between locales — the head
  // script above already covers the initial document load.
  useEffect(() => {
    const html = document.documentElement;
    html.lang = l;
    html.dir = dirOf(l);
    return () => { html.dir = "ltr"; };
  }, [l]);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Release 1.11 — Accessibility Foundations: first tab stop. */}
      <SkipToContent lang={l} />
      <Navigation lang={l} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1"><Outlet /></main>
      <Footer lang={l} />
      {/* Release 1.5 — Product Comparison (client-only floating tray). */}
      <CompareBar lang={l} />
    </div>
  );
}
