import { useEffect, useRef, useState } from "react";
import { type Lang, T, t } from "@/lib/i18n";

function useCounter(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    setCount(0);
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress >= 1) { setCount(target); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

type Stat = { value: number; suffix: string; label: string; desc: string; format?: string };

function StatCard({ stat, triggered, index }: { stat: Stat; triggered: boolean; index: number }) {
  const count = useCounter(stat.value, 2000 + index * 100, triggered);
  const displayValue = stat.format ? stat.format : stat.value >= 1000000 ? `${(count / 1000000).toFixed(1)}M` : count.toLocaleString();
  return (
    <div className="text-center group">
      <div className="font-heading text-5xl md:text-6xl font-bold text-[var(--brand-navy)] mb-2 transition-colors group-hover:text-[var(--brand-red)]">
        {displayValue}{stat.suffix}
      </div>
      <div className="font-semibold text-foreground text-sm mb-1">{stat.label}</div>
      <div className="text-xs text-muted-foreground">{stat.desc}</div>
    </div>
  );
}

export function Stats({ lang }: { lang: Lang }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats: Stat[] = [
    { value: 35, suffix: "+", label: t(T.stat1Label, lang), desc: t(T.stat1Desc, lang) },
    { value: 2400000, suffix: "+", label: t(T.stat2Label, lang), desc: t(T.stat2Desc, lang), format: "2.4M" },
    { value: 60, suffix: "+", label: t(T.stat3Label, lang), desc: t(T.stat3Desc, lang) },
    { value: 1200, suffix: "+", label: t(T.stat4Label, lang), desc: t(T.stat4Desc, lang) },
    { value: 98, suffix: "%", label: t(T.stat5Label, lang), desc: t(T.stat5Desc, lang) },
    { value: 340, suffix: "+", label: t(T.stat6Label, lang), desc: t(T.stat6Desc, lang) },
  ];

  return (
    <section ref={ref} className="py-24 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--brand-red)]" />
            <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.byTheNumbers, lang)}</span>
            <div className="w-8 h-px bg-[var(--brand-red)]" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--brand-navy)] max-w-2xl mx-auto">
            {t(T.statsHeadline, lang)}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {stats.map((s, i) => <StatCard key={i} stat={s} triggered={triggered} index={i} />)}
        </div>
      </div>
    </section>
  );
}
