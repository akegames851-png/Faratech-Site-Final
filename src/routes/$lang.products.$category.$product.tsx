import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProductPage } from "@/components/faratech/product-page";
import { RelatedProducts } from "@/components/faratech/related-products";
import type { Lang } from "@/lib/i18n";
import {
  buildLocaleMeta,
  faqJsonLd,
  productJsonLd,
  robotsIndex,
} from "@/lib/seo";
import {
  getProductBySlug,
  getRelatedProducts,
  listProducts,
} from "@/lib/modules/products/product.functions";
import {
  getCategoryCopy,
  listCategories,
} from "@/lib/modules/categories/category.functions";
import { detailToProduct, dtoToCategory } from "@/lib/products-db-adapter";
import { slugToEnum } from "@/lib/category-slug";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export const Route = createFileRoute("/$lang/products/$category/$product")({
  loader: async ({ params }) => {
    const enumKey = slugToEnum(params.category);
    if (!enumKey) throw notFound();

    const detail = await getProductBySlug({ data: { slug: params.product } });
    if (detail.categoryKey !== enumKey) throw notFound();

    const [allCategories, productsResult, copy, related] = await Promise.all([
      listCategories(),
      listProducts({ data: { categoryKey: enumKey, limit: 100, offset: 0 } }),
      getCategoryCopy({ data: { slug: params.category } }),
      // Release 1.3 — Related Products (FEATURE-0004 / RFC-0003).
      getRelatedProducts({
        data: { productId: detail.id, categoryKey: enumKey, limit: 6 },
      }),
    ]);
    const catDto = allCategories.find((c) => c.key === enumKey);
    if (!catDto) throw notFound();

    const lang = (params.lang as Lang) ?? "fa";
    const categoryLabel =
      copy?.title?.[lang] ?? copy?.title?.fa ?? catDto.label[lang] ?? catDto.label.fa;
    const productLd = productJsonLd(detail, { lang, categoryLabel });
    const faqLd = faqJsonLd(detail.faqItems, lang);
    const seoDescription =
      detail.seo?.description?.[lang] ??
      detail.seo?.description?.fa ??
      detail.shortDescription?.[lang] ??
      detail.shortDescription?.fa ??
      null;
    const primaryImage =
      detail.images.find((i) => i.isPrimary) ?? detail.images[0] ?? null;
    const ogImage = detail.seo?.ogImage ?? primaryImage?.src ?? null;

    return {
      category: dtoToCategory(catDto, productsResult.items, copy),
      product: detailToProduct(detail),
      relatedItems: related.items,
      seo: { productLd, faqLd, description: seoDescription, ogImage },
    };
  },
  head: ({ loaderData, params }) => {
    const lang = (params?.lang as Lang) ?? "fa";
    const cat = params?.category ?? "";
    const prod = params?.product ?? "";
    const locale = buildLocaleMeta(lang, (l) => `/${l}/products/${cat}/${prod}`);
    const name = loaderData?.product.name ?? "Product";
    const description =
      loaderData?.seo.description ?? `${name} — engineered by FARATECH.`;
    const scripts: Array<{ type: string; children: string }> = [];
    if (loaderData?.seo.productLd) {
      scripts.push({ type: "application/ld+json", children: loaderData.seo.productLd });
    }
    if (loaderData?.seo.faqLd) {
      scripts.push({ type: "application/ld+json", children: loaderData.seo.faqLd });
    }
    return {
      meta: [
        { title: `${name} — FARATECH` },
        { name: "description", content: description },
        robotsIndex,
        { property: "og:title", content: `${name} — FARATECH` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${name} — FARATECH` },
        { name: "twitter:description", content: description },
        ...(loaderData?.seo.ogImage
          ? [
              { property: "og:image", content: loaderData.seo.ogImage },
              { name: "twitter:image", content: loaderData.seo.ogImage },
            ]
          : []),
        ...locale.meta,
      ],
      links: locale.links,
      scripts,
    };
  },
  errorComponent: ({ error }) => (
    <div className="max-w-2xl mx-auto p-8 text-sm text-red-600">
      Failed to load product: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8">Product not found.</div>,
  component: ProductView,
});

function ProductView() {
  const { lang } = Route.useParams();
  const { category, product, relatedItems } = Route.useLoaderData();
  const l = lang as Lang;
  // Release 1.6 — Analytics: emit `product_viewed` once per mount /
  // navigation. Lives in the route component so SSR is never touched.
  useEffect(() => {
    track({
      name: ANALYTICS_EVENTS.productViewed,
      productId: product.slug,
      productSlug: product.slug,
      categoryKey: category.key,
      lang: l,
    });
  }, [product.slug, category.key, l]);
  return (
    <>
      <ProductPage lang={l} category={category} product={product} />
      <RelatedProducts lang={l} items={relatedItems} />
    </>
  );
}
