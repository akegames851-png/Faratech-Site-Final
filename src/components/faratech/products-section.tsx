import { Link } from "@tanstack/react-router";
import { type Lang, T, t } from "@/lib/i18n";
import { DirArrow } from "@/components/faratech/dir-icon";
import { listVisibleCategories } from "@/lib/products";

export function ProductsSection({ lang }: { lang: Lang }) {
  const categories = listVisibleCategories();
  return (
    <section id="products" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[var(--brand-red)]" />
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.overviewEyebrow, lang)}</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--brand-navy)] mb-4 leading-tight">{t(T.overviewTitle, lang)}</h2>
            <p className="text-muted-foreground leading-relaxed">{t(T.overviewSub, lang)}</p>
          </div>
          <Link to={`/${lang}/products`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-red)] transition-colors">
            {t(T.viewCategory, lang)} <DirArrow lang={lang} size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link key={c.key} to={`/${lang}/products/${c.key}`} className="group bg-white border border-border rounded-lg overflow-hidden hover:border-[var(--brand-navy)] hover:shadow-lg transition-all">
              <div className="aspect-[16/10] bg-[var(--brand-silver)] border-b border-border flex items-center justify-center text-muted-foreground text-[10px] tracking-widest uppercase">
                {t(T.imagePlaceholderShort, lang)}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading text-lg font-bold text-[var(--brand-navy)]">{c.title[lang]}</h3>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{c.products.length} {t(T.models, lang)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.blurb[lang]}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-red)] group-hover:gap-2 transition-all">
                  {t(T.viewCategory, lang)} <DirArrow lang={lang} size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
