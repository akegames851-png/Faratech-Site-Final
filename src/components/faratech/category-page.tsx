import { Link } from "@tanstack/react-router";
import { type Lang, T, t } from "@/lib/i18n";
import type { Category } from "@/lib/products";
import { breadcrumbJsonLd } from "@/lib/seo";
import { DirChevron, DirArrow } from "@/components/faratech/dir-icon";

export function CategoryPage({ lang, category }: { lang: Lang; category: Category }) {
  // group products by series if any
  const groups = new Map<string, typeof category.products>();
  for (const p of category.products) {
    const key = p.series?.en ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  const crumbs = breadcrumbJsonLd([
    { name: t(T.home, lang), path: `/${lang}` },
    { name: t(T.products, lang), path: `/${lang}/products` },
    { name: category.title[lang], path: `/${lang}/products/${category.key}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: crumbs }} />
      {/* Breadcrumb + Hero */}
      <section className="bg-[var(--brand-navy)] text-white relative overflow-hidden">
        <div className="absolute inset-0 engineering-grid opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--brand-red)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to={`/${lang}`} className="hover:text-white">{t(T.home, lang)}</Link>
            <DirChevron lang={lang} size={12} />
            <Link to={`/${lang}/products`} className="hover:text-white">{t(T.products, lang)}</Link>
            <DirChevron lang={lang} size={12} />
            <span className="text-white">{category.title[lang]}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--brand-red)]" />
            <span className="text-xs tracking-[0.25em] uppercase text-white/60 font-medium">{t(T.category, lang)}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{category.title[lang]}</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">{category.blurb[lang]}</p>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {Array.from(groups.entries()).map(([seriesKey, products]) => (
            <div key={seriesKey || "default"}>
              {seriesKey && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-px bg-[var(--brand-red)]" />
                    <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.series, lang)}</span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--brand-navy)]">{seriesKey}</h2>
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/${lang}/products/${category.key}/${p.slug}`}
                    className="group bg-white border border-border rounded-lg overflow-hidden hover:border-[var(--brand-navy)] hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-[var(--brand-silver)] border-b border-border flex items-center justify-center text-muted-foreground text-[10px] tracking-widest uppercase">
                      {t(T.imagePlaceholderShort, lang)}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-heading font-bold text-[var(--brand-navy)] leading-snug mb-3 flex-1">{p.name}</h3>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-red)] group-hover:gap-2 transition-all">
                        {t(T.view, lang)} <DirArrow lang={lang} size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
