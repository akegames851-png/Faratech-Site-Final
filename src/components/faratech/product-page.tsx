import { Link } from "@tanstack/react-router";
import { Download, Mail } from "lucide-react";
import { type Lang, T, t } from "@/lib/i18n";
import type { Category, Product, ProductDocument } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import { breadcrumbJsonLd } from "@/lib/seo";
import { DirChevron, DirArrow } from "@/components/faratech/dir-icon";

export function ProductPage({ lang, category, product }: { lang: Lang; category: Category; product: Product }) {
  // Phase 1A: render sections only when real, CMS-supplied data exists.
  // No hardcoded / fabricated specifications or features.
  const images = product.media?.images ?? [];
  const primaryImage =
    images.find((i) => i.isPrimary) ?? images[0] ?? null;
  const thumbnails = images.filter((i) => i !== primaryImage);
  const specGroups = product.specifications ?? [];
  const features = product.features ?? [];
  const certifications = product.certifications ?? [];
  const documents = product.documents ?? [];
  const faq = product.faq ?? [];
  const description = product.description ? t(product.description, lang) : null;
  const brochure = documents.find((d) => d.kind === "brochure");

  const relatedProducts = (product.related ?? [])
    .map((ref) => {
      const cat = CATEGORIES.find((c) => c.key === ref.category);
      const p = cat?.products.find((pp) => pp.slug === ref.slug);
      return cat && p ? { category: cat, product: p } : null;
    })
    .filter((x): x is { category: Category; product: Product } => x !== null);

  const breadcrumbs = breadcrumbJsonLd([
    { name: t(T.home, lang), path: `/${lang}` },
    { name: t(T.products, lang), path: `/${lang}/products` },
    { name: category.title[lang], path: `/${lang}/products/${category.key}` },
    { name: product.name, path: `/${lang}/products/${category.key}/${product.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />

      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to={`/${lang}`} className="hover:text-[var(--brand-navy)]">{t(T.home, lang)}</Link>
            <DirChevron lang={lang} size={12} />
            <Link to={`/${lang}/products`} className="hover:text-[var(--brand-navy)]">{t(T.products, lang)}</Link>
            <DirChevron lang={lang} size={12} />
            <Link to={`/${lang}/products/${category.key}`} className="hover:text-[var(--brand-navy)]">{category.title[lang]}</Link>
            <DirChevron lang={lang} size={12} />
            <span className="text-[var(--brand-navy)]">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className={`max-w-7xl mx-auto px-6 grid gap-12 ${primaryImage ? "lg:grid-cols-2" : ""}`}>
          {/* Image gallery — only when media.images is populated */}
          {primaryImage && (
            <div>
              <div className="aspect-square bg-[var(--brand-silver)] border border-border rounded-lg overflow-hidden">
                <img
                  src={primaryImage.src}
                  alt={primaryImage.alt ? t(primaryImage.alt, lang) : product.name}
                  width={primaryImage.width}
                  height={primaryImage.height}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              {thumbnails.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {thumbnails.slice(0, 4).map((img, i) => (
                    <div key={`${img.src}-${i}`} className="aspect-square bg-[var(--brand-silver)] border border-border rounded-md overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.alt ? t(img.alt, lang) : ""}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[var(--brand-red)]" />
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{category.title[lang]}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[var(--brand-navy)] mb-4 leading-tight">{product.name}</h1>
            {product.series && (
              <div className="text-sm text-muted-foreground mb-6">
                <span className="font-semibold text-[var(--brand-navy)]">{t(T.series, lang)}:</span>{" "}{product.series.en}
              </div>
            )}
            {description && (
              <p className="text-base text-muted-foreground leading-relaxed mb-8">{description}</p>
            )}

            <div className="flex flex-wrap gap-3 mb-10">
              <a href={`/${lang}#contact`} className="inline-flex items-center gap-2 bg-[var(--brand-red)] hover:bg-[var(--brand-red-dark)] text-white font-semibold px-6 py-3 rounded-md transition-all">
                <Mail size={15} /> {t(T.inquireProduct, lang)}
              </a>
              {brochure && (
                <a
                  href={brochure.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border hover:border-[var(--brand-navy)] text-[var(--brand-navy)] font-medium px-6 py-3 rounded-md transition-colors"
                >
                  <Download size={15} /> {brochure.title ? t(brochure.title, lang) : t(T.downloadBrochure, lang)}
                </a>
              )}
            </div>

            {/* Features — only when product.features is populated */}
            {features.length > 0 && (
              <div className="mb-10">
                <h2 className="font-heading text-lg font-bold text-[var(--brand-navy)] mb-4">{t(T.features, lang)}</h2>
                <ul className="space-y-2">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-red)] mt-1.5 flex-shrink-0" />
                      {t(f, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specifications — only when populated */}
      {specGroups.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[var(--brand-red)]" />
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.specifications, lang)}</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[var(--brand-navy)] mb-8">{product.name}</h2>
            <div className="space-y-8">
              {specGroups.map((group) => (
                <div key={group.key}>
                  <h3 className="font-heading text-lg font-bold text-[var(--brand-navy)] mb-3">{t(group.label, lang)}</h3>
                  <div className="bg-white border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {group.items.map((s, i) => (
                          <tr key={s.key} className={i % 2 ? "bg-muted/40" : ""}>
                            <td className="font-semibold text-[var(--brand-navy)] px-6 py-4 w-1/3 border-b border-border last:border-0">{t(s.label, lang)}</td>
                            <td className="text-muted-foreground px-6 py-4 border-b border-border last:border-0">
                              {t(s.value, lang)}{s.unit ? ` ${s.unit}` : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications — only when populated */}
      {certifications.length > 0 && (
        <section className="py-12 bg-white border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[var(--brand-red)]" />
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.specCertification, lang)}</span>
            </div>
            <ul className="flex flex-wrap gap-3">
              {certifications.map((c) => (
                <li key={c.name} className="inline-flex items-center gap-2 border border-border rounded-md px-4 py-2 text-sm text-[var(--brand-navy)]">
                  <span className="font-semibold">{c.name}</span>
                  {c.issuer && <span className="text-muted-foreground">· {c.issuer}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Downloads — only when there is at least one non-brochure document
          (the brochure is already exposed as a primary CTA above). */}
      {documents.filter((d: ProductDocument) => d !== brochure).length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-heading text-xl font-bold text-[var(--brand-navy)] mb-4">{t(T.downloadBrochure, lang)}</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {documents.filter((d) => d !== brochure).map((d, i) => (
                <li key={`${d.src}-${i}`}>
                  <a
                    href={d.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white border border-border rounded-md px-4 py-3 hover:border-[var(--brand-navy)] transition-colors"
                  >
                    <Download size={16} className="text-[var(--brand-red)]" />
                    <span className="text-sm text-[var(--brand-navy)]">
                      {d.title ? t(d.title, lang) : d.kind}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ — only when populated */}
      {faq.length > 0 && (
        <section className="py-16 bg-white border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-heading text-2xl font-bold text-[var(--brand-navy)] mb-6">FAQ</h2>
            <dl className="space-y-4">
              {faq.map((f, i) => (
                <div key={i} className="border border-border rounded-md p-4">
                  <dt className="font-semibold text-[var(--brand-navy)] mb-1">{t(f.question, lang)}</dt>
                  <dd className="text-sm text-muted-foreground">{t(f.answer, lang)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Related products — only when populated */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-heading text-2xl font-bold text-[var(--brand-navy)] mb-6">{t(T.products, lang)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(({ category: c, product: p }) => (
                <Link
                  key={`${c.key}/${p.slug}`}
                  to={`/${lang}/products/${c.key}/${p.slug}`}
                  className="group bg-white border border-border rounded-lg p-5 hover:border-[var(--brand-navy)] hover:shadow-md transition-all"
                >
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{c.title[lang]}</div>
                  <h3 className="font-heading font-bold text-[var(--brand-navy)] leading-snug">{p.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <Link to={`/${lang}/products/${category.key}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-red)] transition-colors">
            <DirArrow lang={lang} size={14} className="rotate-180" /> {t(T.backToCategory, lang)}
          </Link>
        </div>
      </section>
    </>
  );
}
