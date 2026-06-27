import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Play } from "lucide-react";
import { type Lang, T, t } from "@/lib/i18n";
import { DirArrow } from "@/components/faratech/dir-icon";

const HERO_IMAGE = "/wheelchair-hero.png";

const certifications = ["ISO 13485", "CE Mark", "FDA Cleared", "TÜV Rheinland", "EN 12183", "EN 12184", "ISO 9001", "MDR 2017/745"];

export function Hero({ lang }: { lang: Lang }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative bg-[var(--brand-navy)] text-white overflow-hidden min-h-[92vh] flex flex-col">
      <div className="absolute inset-0 engineering-grid opacity-30" />
      <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-white/20" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-white/20" />
      <div className="absolute bottom-20 left-6 w-8 h-8 border-l-2 border-b-2 border-white/20" />
      <div className="absolute bottom-20 right-6 w-8 h-8 border-r-2 border-b-2 border-white/20" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--brand-red)]" />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 pt-16 pb-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className={`space-y-8 ${mounted ? "animate-fade-up" : "opacity-0"}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-[var(--brand-red)]" />
              <span className="text-xs tracking-[0.25em] uppercase text-white/60 font-medium">{t(T.heroEyebrow, lang)}</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.0] tracking-tight text-balance">
              {t(T.heroH1a, lang)}
              <br />
              <span className="text-white">{t(T.heroH1b, lang)}</span>
              <br />
              <span className="text-[var(--brand-red)]">{t(T.heroH1c, lang)}</span>
            </h1>

            <p className="text-lg text-white/65 leading-relaxed max-w-md">{t(T.heroSub, lang)}</p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/${lang}/products`}
                className="group inline-flex items-center gap-2 bg-[var(--brand-red)] hover:bg-[var(--brand-red-dark)] text-white font-semibold px-7 py-4 rounded-md transition-all hover:shadow-lg hover:shadow-red-900/30"
              >
                {t(T.exploreProducts, lang)}
                <DirArrow lang={lang} size={16} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
              <a
                href={`/${lang}#engineering`}
                className="group inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white/80 hover:text-white font-medium px-7 py-4 rounded-md transition-all"
              >
                <Play size={14} className="fill-white/60 group-hover:fill-white" />
                {t(T.ourStory, lang)}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
              {[
                { v: "35+", l: t(T.years, lang) },
                { v: "60+", l: t(T.countries, lang) },
                { v: "1,200+", l: t(T.partners, lang) },
                { v: "98%", l: t(T.satisfaction, lang) },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-x-6 gap-y-4">
                  {i > 0 && <div className="hidden sm:block w-px h-10 bg-white/15" />}
                  <div className="text-center">
                    <div className="font-heading text-3xl font-bold text-white">{s.v}</div>
                    <div className="text-xs text-white/50 mt-1 tracking-wide uppercase">{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative flex items-center justify-center ${mounted ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute inset-0 bg-[var(--brand-red)]/8 rounded-full blur-3xl scale-75" />
            <div className="relative w-full max-w-lg aspect-square">
              <img
                src={HERO_IMAGE}
                alt="FARATECH Capitan power wheelchair"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-contain rounded-2xl"
              />
              <div className="absolute top-8 -left-4 bg-white text-[var(--brand-navy)] px-3 py-2 rounded-lg shadow-lg text-xs font-semibold">
                <div className="text-[var(--brand-red)] font-bold text-sm">7.8 kg</div>
                <div className="text-muted-foreground font-normal">{t(T.badgeFrameWeight, lang)}</div>
              </div>
              <div className="absolute bottom-16 -right-4 bg-white text-[var(--brand-navy)] px-3 py-2 rounded-lg shadow-lg text-xs font-semibold">
                <div className="text-[var(--brand-red)] font-bold text-sm">T700</div>
                <div className="text-muted-foreground font-normal">{t(T.badgeCarbonGrade, lang)}</div>
              </div>
              <div className="absolute top-1/2 -right-6 bg-[var(--brand-red)] text-white px-3 py-2 rounded-lg shadow-lg text-xs font-bold">{t(T.badgeNew2025, lang)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 py-4 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...certifications, ...certifications].map((cert, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-xs text-white/40 font-medium tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-red)]/60 flex-shrink-0" />
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-white/30 tracking-[0.2em] uppercase">{t(T.scroll, lang)}</span>
        <ChevronDown size={16} className="text-white/30 animate-bounce" />
      </div>
    </section>
  );
}
