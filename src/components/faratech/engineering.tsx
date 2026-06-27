import { type Lang, T, t } from "@/lib/i18n";
import { Cog, ShieldCheck, Cpu, Layers } from "lucide-react";

export function Engineering({ lang }: { lang: Lang }) {
  const pillars = [
    { Icon: Cog, title: t(T.pillar1Title, lang), desc: t(T.pillar1Desc, lang) },
    { Icon: Layers, title: t(T.pillar2Title, lang), desc: t(T.pillar2Desc, lang) },
    { Icon: Cpu, title: t(T.pillar3Title, lang), desc: t(T.pillar3Desc, lang) },
    { Icon: ShieldCheck, title: t(T.pillar4Title, lang), desc: t(T.pillar4Desc, lang) },
  ];
  return (
    <section id="engineering" className="py-24 bg-[var(--brand-navy)] text-white relative overflow-hidden">
      <div className="absolute inset-0 engineering-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--brand-red)]" />
            <span className="text-xs tracking-[0.25em] uppercase text-white/50 font-medium">{t(T.whyTitle, lang)}</span>
            <div className="w-8 h-px bg-[var(--brand-red)]" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">{t(T.engHeadline, lang)}</h2>
          <p className="text-white/60 leading-relaxed">{t(T.engSub, lang)}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div key={p.title} className="border border-white/10 bg-white/[0.03] rounded-lg p-6 hover:border-[var(--brand-red)]/40 transition-colors">
              <div className="w-10 h-10 bg-[var(--brand-red)]/15 rounded-md flex items-center justify-center mb-5">
                <p.Icon size={18} className="text-[var(--brand-red)]" />
              </div>
              <h3 className="font-heading font-bold text-base mb-2">{p.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
