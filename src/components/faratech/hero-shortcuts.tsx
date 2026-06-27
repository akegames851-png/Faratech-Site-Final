import { Link } from "@tanstack/react-router";
import { type Lang, T, t } from "@/lib/i18n";
import { DirArrow } from "@/components/faratech/dir-icon";

export function HeroShortcuts({ lang }: { lang: Lang }) {
  const cards = [
    { label: t(T.shortcutPM, lang), to: `/${lang}/products/power-wheelchairs` },
    { label: t(T.shortcutLifts, lang), to: `/${lang}/products/patient-lifts` },
    { label: t(T.shortcutScooters, lang), to: `/${lang}/products/mobility-scooters` },
    { label: t(T.shortcutParts, lang), to: `/${lang}/spare-parts` },
  ];

  return (
    <section className="bg-white border-b border-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-[var(--brand-red)]" />
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.overviewEyebrow, lang)}</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--brand-navy)]">{t(T.shortcutsTitle, lang)}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="group block border border-border bg-white rounded-md overflow-hidden hover:border-[var(--brand-navy)] hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] bg-[var(--brand-silver)] border-b border-border flex items-center justify-center text-muted-foreground text-[10px] tracking-widest uppercase">
                {t(T.imagePlaceholderShort, lang)}
              </div>
              <div className="p-5 flex items-center justify-between gap-2">
                <h3 className="font-heading text-sm md:text-base font-bold text-[var(--brand-navy)] leading-tight">{c.label}</h3>
                <DirArrow lang={lang} size={16} className="text-[var(--brand-red)] flex-shrink-0 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
