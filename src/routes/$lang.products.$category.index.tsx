import { createFileRoute, notFound } from "@tanstack/react-router";
import { CategoryPage } from "@/components/faratech/category-page";
import type { Lang } from "@/lib/i18n";
import { buildLocaleMeta, robotsIndex } from "@/lib/seo";
import {
  getCategoryCopy,
  listCategories,
} from "@/lib/modules/categories/category.functions";
import { listProducts } from "@/lib/modules/products/product.functions";
import { dtoToCategory } from "@/lib/products-db-adapter";
import { slugToEnum } from "@/lib/category-slug";

export const Route = createFileRoute("/$lang/products/$category/")({
  loader: async ({ params }) => {
    const enumKey = slugToEnum(params.category);
    if (!enumKey) throw notFound();
    const [allCategories, productsResult, copy] = await Promise.all([
      listCategories(),
      listProducts({ data: { categoryKey: enumKey, limit: 100, offset: 0 } }),
      getCategoryCopy({ data: { slug: params.category } }),
    ]);
    const dto = allCategories.find((c) => c.key === enumKey);
    if (!dto) throw notFound();
    return dtoToCategory(dto, productsResult.items, copy);
  },
  head: ({ loaderData, params }) => {
    const lang = (params?.lang as Lang) ?? "fa";
    const cat = params?.category ?? "";
    const locale = buildLocaleMeta(lang, (l) => `/${l}/products/${cat}`);
    const title = loaderData?.title[lang] ?? loaderData?.title.en ?? "Category";
    const description = loaderData?.blurb[lang] ?? loaderData?.blurb.en ?? "";
    return {
      meta: [
        { title: `${title} — FARATECH` },
        { name: "description", content: description },
        robotsIndex,
        { property: "og:title", content: `${title} — FARATECH` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${title} — FARATECH` },
        { name: "twitter:description", content: description },
        ...locale.meta,
      ],
      links: locale.links,
    };
  },
  errorComponent: ({ error }) => (
    <div className="max-w-2xl mx-auto p-8 text-sm text-red-600">
      Failed to load category: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8">Category not found.</div>,
  component: CategoryView,
});

function CategoryView() {
  const { lang } = Route.useParams();
  const category = Route.useLoaderData();
  return <CategoryPage lang={lang as Lang} category={category} />;
}
