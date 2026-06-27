import { type Lang, T, t } from "@/lib/i18n";
import { Building2, HeartPulse, Home, Trophy } from "lucide-react";

export function Solutions({ lang }: { lang: Lang }) {
  const items = [
    { Icon: Building2, title: t(T.sol1Title, lang), desc: t(T.sol1Desc, lang) },
    { Icon: HeartPulse, title: t(T.sol2Title, lang), desc: t(T.sol2Desc, lang) },
    { Icon: Home, title: t(T.sol3Title, lang), desc: t(T.sol3Desc, lang) },
    { Icon: Trophy, title: t(T.sol4Title, lang), desc: t(T.sol4Desc, lang) },
  ];
  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--brand-red)]" />
            <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.useCases, lang)}</span>
            <div className="w-8 h-px bg-[var(--brand-red)]" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--brand-navy)]">{t(T.solutionsTitle, lang)}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((i) => (
            <div key={i.title} className="border border-border rounded-lg p-6 hover:border-[var(--brand-navy)] hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center mb-5">
                <i.Icon size={20} className="text-[var(--brand-navy)]" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[var(--brand-navy)] mb-2">{i.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
