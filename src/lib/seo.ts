// SEO helpers — canonical/og:url/hreflang and structured-data builders.
//
// Phase 6: Organization JSON-LD now consumes the DB-backed `CompanyProfileDto`
// (no static `src/lib/data/company.ts` dependency at runtime). The companion
// `faqJsonLd` builder is emitted only when the FAQ list is non-empty.
//
// All helpers omit missing fields — they never fabricate values.

import { LANGS, pickLocalized, type Lang } from "./i18n";
import type { CompanyProfileDto } from "./modules/company/company.dto";
import type { ProductDetailDto } from "./modules/products/product.dto";

// Use relative URLs so crawlers resolve against whichever host serves the page.
// Once a custom domain is configured, set this to an absolute origin.
export const SITE_ORIGIN = "";

export const absUrl = (path: string) => `${SITE_ORIGIN}${path}`;

// ---------------------------------------------------------------------------
// Per-route locale meta — canonical + og:url + hreflang alternates
// ---------------------------------------------------------------------------
export function buildLocaleMeta(currentLang: Lang, pathBuilder: (l: Lang) => string) {
  const selfPath = pathBuilder(currentLang);
  const alternates = LANGS.map((l) => ({
    rel: "alternate" as const,
    hrefLang: l,
    href: absUrl(pathBuilder(l)),
  }));
  return {
    links: [
      { rel: "canonical", href: absUrl(selfPath) },
      ...alternates,
      { rel: "alternate", hrefLang: "x-default", href: absUrl(pathBuilder("fa")) },
    ],
    meta: [
      { property: "og:url", content: absUrl(selfPath) },
      { property: "og:locale", content: currentLang === "en" ? "en_US" : currentLang === "fa" ? "fa_IR" : "ar_SA" },
    ],
  };
}

// Default robots directive used by indexable public pages.
export const robotsIndex = { name: "robots", content: "index,follow,max-image-preview:large" } as const;

// ---------------------------------------------------------------------------
// Localized text helpers — Phase 9: delegate to the canonical `pickLocalized`
// in `i18n.ts` so the fa-canonical fallback lives in exactly one place.
// ---------------------------------------------------------------------------

// Naive E.164 normalization for IR landlines / mobiles. Returns the original
// string when no rule matches so we never invent a number.
export function normalizePhone(raw: string): string {
  const trimmed = raw.replace(/[\s-]/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("00")) return `+${trimmed.slice(2)}`;
  if (trimmed.startsWith("0")) return `+98${trimmed.slice(1)}`;
  return trimmed;
}

// ---------------------------------------------------------------------------
// Organization JSON-LD — DB-backed
// ---------------------------------------------------------------------------
export function organizationJsonLd(
  profile: CompanyProfileDto | null | undefined,
  opts: { logoPath?: string } = {},
): string {
  const logo = absUrl(opts.logoPath ?? "/logo.png");
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FARATECH",
    url: SITE_ORIGIN || "/",
    logo,
  };
  if (!profile) return JSON.stringify(base);

  if (profile.name?.en) base.legalName = profile.name.en;
  if (profile.name?.fa) base.alternateName = profile.name.fa;

  const social = profile.contact.social ?? {};
  const sameAs = Object.values(social).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  if (sameAs.length) base.sameAs = sameAs;

  if (profile.contact.address?.fa) {
    base.address = {
      "@type": "PostalAddress",
      streetAddress: profile.contact.address.en ?? profile.contact.address.fa,
      addressCountry: "IR",
    };
  }

  const phones = profile.contact.phones ?? [];
  if (phones.length) {
    base.contactPoint = phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: normalizePhone(p),
      contactType: "sales",
      areaServed: ["IR", "EU", "ME"],
      availableLanguage: ["en", "fa", "ar"],
    }));
  }

  const emails = profile.contact.emails ?? [];
  if (emails.length) base.email = emails[0];

  if (profile.mission?.fa || profile.mission?.en) {
    base.description = profile.mission.en ?? profile.mission.fa;
  }

  return JSON.stringify(base);
}

// ---------------------------------------------------------------------------
// Breadcrumb JSON-LD
// ---------------------------------------------------------------------------
export const breadcrumbJsonLd = (items: { name: string; path: string }[]) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  });

// ---------------------------------------------------------------------------
// Product JSON-LD — derived from ProductDetailDto. Missing fields are omitted.
// ---------------------------------------------------------------------------
export function productJsonLd(
  detail: ProductDetailDto,
  opts: { lang?: Lang; categoryLabel?: string } = {},
): string {
  const lang: Lang = opts.lang ?? "fa";
  const description =
    pickLocalized(detail.description, lang) ??
    pickLocalized(detail.shortDescription, lang);

  const images = detail.images
    .slice()
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    .map((i) => absUrl(i.src));

  const body: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: detail.name,
    brand: { "@type": "Brand", name: "FARATECH" },
    manufacturer: { "@type": "Organization", name: "FARATECH" },
  };
  if (description) body.description = description;
  if (images.length) body.image = images;
  if (detail.code) body.sku = detail.code;
  if (detail.code) body.mpn = detail.code;
  if (opts.categoryLabel) body.category = opts.categoryLabel;

  const certs = detail.certifications.filter((c) => !!c.name);
  if (certs.length) {
    body.hasCertification = certs.map((c) => ({
      "@type": "Certification",
      name: c.name,
      ...(c.issuer ? { issuedBy: { "@type": "Organization", name: c.issuer } } : {}),
      ...(c.reference ? { identifier: c.reference } : {}),
    }));
  }

  return JSON.stringify(body);
}

// ---------------------------------------------------------------------------
// FAQ JSON-LD — only meaningful when items.length > 0. Returns null otherwise
// so callers can skip rendering the script tag entirely.
// ---------------------------------------------------------------------------
export function faqJsonLd(
  items: ProductDetailDto["faqItems"],
  lang: Lang = "fa",
): string | null {
  if (!items?.length) return null;
  const mainEntity = items
    .map((f) => {
      const q = pickLocalized(f.question, lang);
      const a = pickLocalized(f.answer, lang);
      if (!q || !a) return null;
      return {
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (!mainEntity.length) return null;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  });
}
