import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/faratech/hero";
import { HeroShortcuts } from "@/components/faratech/hero-shortcuts";
import { Stats } from "@/components/faratech/stats";
import { ProductsSection } from "@/components/faratech/products-section";
import { Engineering } from "@/components/faratech/engineering";
import { Solutions } from "@/components/faratech/solutions";
import { Testimonials } from "@/components/faratech/testimonials";
import { CTA } from "@/components/faratech/cta";
import { EntryCta } from "@/components/faratech/entry-cta";
import type { Lang } from "@/lib/i18n";
import { buildLocaleMeta, organizationJsonLd, robotsIndex } from "@/lib/seo";
import { getCompanyProfile } from "@/lib/modules/company/company.functions";

export const Route = createFileRoute("/$lang/")({
  loader: async () => {
    try {
      const company = await getCompanyProfile();
      return { orgLd: organizationJsonLd(company) };
    } catch {
      return { orgLd: organizationJsonLd(null) };
    }
  },
  head: ({ loaderData, params }) => {
    const lang = (params?.lang as Lang) ?? "fa";
    const locale = buildLocaleMeta(lang, (l) => `/${l}`);
    const scripts = loaderData?.orgLd
      ? [{ type: "application/ld+json", children: loaderData.orgLd }]
      : [];
    return {
      meta: [
        { title: "FARATECH — Engineering Mobility Excellence" },
        { name: "description", content: "Premium wheelchair systems trusted by hospitals and rehabilitation centers worldwide." },
        robotsIndex,
        ...locale.meta,
      ],
      links: [
        { rel: "preload", as: "image", href: "/wheelchair-hero.png", fetchpriority: "high" },
        ...locale.links,
      ],
      scripts,
    };
  },
  component: Home,
});

function Home() {
  const { lang } = Route.useParams();
  const l = lang as Lang;
  return (
    <>
      <Hero lang={l} />
      <EntryCta lang={l} />
      <HeroShortcuts lang={l} />
      <Stats lang={l} />
      <ProductsSection lang={l} />
      <Engineering lang={l} />
      <Solutions lang={l} />
      <Testimonials lang={l} />
      <CTA lang={l} />
    </>
  );
}
