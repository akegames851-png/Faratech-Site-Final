import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { T, t, type Lang } from "@/lib/i18n";
import { buildLocaleMeta, breadcrumbJsonLd } from "@/lib/seo";
import { DirChevron } from "@/components/faratech/dir-icon";

export const Route = createFileRoute("/$lang/spare-parts")({
  head: ({ params }) => {
    const lang = (params?.lang as Lang) ?? "fa";
    const locale = buildLocaleMeta(lang, (l) => `/${l}/spare-parts`);
    return {
      meta: [
        { title: "Spare Parts — FARATECH" },
        { name: "description", content: "Genuine FARATECH replacement parts for safe, long-term operation of your mobility equipment." },
        ...locale.meta,
      ],
      links: locale.links,
    };
  },
  component: SpareParts,
});

function SpareParts() {
  const { lang } = Route.useParams();
  const l = lang as Lang;
  const parts = [
    t(T.partJoystick, l), t(T.partWheel, l), t(T.partBattery, l), t(T.partArmrest, l), t(T.partFootrest, l),
  ];
  const crumbs = breadcrumbJsonLd([
    { name: t(T.home, l), path: `/${l}` },
    { name: t(T.spareParts, l), path: `/${l}/spare-parts` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: crumbs }} />
      <section className="bg-[var(--brand-navy)] text-white relative overflow-hidden">
        <div className="absolute inset-0 engineering-grid opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--brand-red)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/$lang" params={{ lang: l }} className="hover:text-white">{t(T.home, l)}</Link>
            <DirChevron lang={l} size={12} />
            <span className="text-white">{t(T.spareParts, l)}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--brand-red)]" />
            <span className="text-xs tracking-[0.25em] uppercase text-white/60 font-medium">{t(T.spareParts, l)}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{t(T.sparePartsTitle, l)}</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">{t(T.sparePartsSub, l)}</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map((name) => (
              <div key={name} className="bg-white border border-border rounded-lg overflow-hidden hover:border-[var(--brand-navy)] hover:shadow-md transition-all">
                <div className="aspect-[4/3] bg-[var(--brand-silver)] border-b border-border flex items-center justify-center">
                  <Wrench size={32} className="text-muted-foreground/40" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-[var(--brand-navy)] mb-2">{name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(T.partInquire, l)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href={`/${l}#contact`} className="inline-flex items-center gap-2 bg-[var(--brand-red)] hover:bg-[var(--brand-red-dark)] text-white font-semibold px-6 py-3 rounded-md transition-all">
              {t(T.inquireProduct, l)}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
