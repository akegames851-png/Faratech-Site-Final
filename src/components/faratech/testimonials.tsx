import { type Lang, T, t } from "@/lib/i18n";
import { Quote, Info } from "lucide-react";

export function Testimonials({ lang }: { lang: Lang }) {
  const quotes = [
    { name: t(T.testiName1, lang), role: t(T.testi1Role, lang), text: t(T.testi1Text, lang) },
    { name: t(T.testiName2, lang), role: t(T.testi2Role, lang), text: t(T.testi2Text, lang) },
    { name: t(T.testiName3, lang), role: t(T.testi3Role, lang), text: t(T.testi3Text, lang) },
  ];
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--brand-red)]" />
            <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.voicesField, lang)}</span>
            <div className="w-8 h-px bg-[var(--brand-red)]" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--brand-navy)]">{t(T.testimonialsTitle, lang)}</h2>
          <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-md px-3 py-2 max-w-2xl">
            <Info size={14} className="text-amber-600 flex-shrink-0" />
            <span>{t(T.testimonialsDisclaimer, lang)}</span>
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div key={i} className="relative bg-white border border-border rounded-lg p-7">
              <span className="absolute top-3 ltr:right-3 rtl:left-3 text-[10px] font-semibold tracking-widest uppercase text-amber-700 bg-amber-100 border border-amber-200 rounded px-2 py-0.5">
                {t(T.placeholderBadge, lang)}
              </span>
              <Quote size={22} className="text-[var(--brand-red)] mb-4" />
              <p className="text-sm text-foreground leading-relaxed mb-6">&ldquo;{q.text}&rdquo;</p>
              <div className="pt-4 border-t border-border">
                <div className="font-semibold text-sm text-[var(--brand-navy)]">{q.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{q.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
