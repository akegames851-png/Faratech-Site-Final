/**
 * Product mappers — translate raw DB rows (snake_case, Json columns)
 * into the DTO shape exposed by the service layer.
 *
 * Mappers are pure functions, no I/O.
 */
import type {
  CertificationDto,
  FaqItemDto,
  LocalizedText,
  ProductDetailDto,
  ProductDocumentDto,
  ProductImageDto,
  ProductSeoDto,
  ProductSummaryDto,
  ProductVideoDto,
  SpecificationGroupDto,
  SpecificationItemDto,
} from "./product.dto";
import { resolveMediaUrl } from "@/lib/media-url";

type Row = Record<string, unknown>;

function asLocalized(v: unknown): LocalizedText | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.fa !== "string") return null;
  return {
    fa: o.fa,
    en: typeof o.en === "string" ? o.en : undefined,
    ar: typeof o.ar === "string" ? o.ar : undefined,
  };
}

function asLocalizedArray(v: unknown): LocalizedText[] {
  if (!Array.isArray(v)) return [];
  return v.map(asLocalized).filter((x): x is LocalizedText => x !== null);
}

export function mapImage(row: Row): ProductImageDto {
  return {
    id: String(row.id),
    src: resolveMediaUrl(String(row.src)),
    width: (row.width as number | null) ?? null,
    height: (row.height as number | null) ?? null,
    isPrimary: Boolean(row.is_primary),
    position: Number(row.position ?? 0),
    alt: asLocalized(row.alt),
  };
}

export function mapVideo(row: Row): ProductVideoDto {
  const poster = (row.poster as string | null) ?? null;
  return {
    id: String(row.id),
    src: resolveMediaUrl(String(row.src)),
    poster: poster ? resolveMediaUrl(poster) : null,
    provider: (row.provider as ProductVideoDto["provider"]) ?? "SELF_HOSTED",
    durationSeconds: (row.duration_seconds as number | null) ?? null,
    title: asLocalized(row.title),
    position: Number(row.position ?? 0),
  };
}

export function mapDocument(row: Row): ProductDocumentDto {
  return {
    id: String(row.id),
    kind: row.kind as ProductDocumentDto["kind"],
    src: resolveMediaUrl(String(row.src)),
    language: (row.language as ProductDocumentDto["language"]) ?? null,
    sizeBytes: (row.size_bytes as number | null) ?? null,
    title: asLocalized(row.title),
    position: Number(row.position ?? 0),
  };
}

export function mapSpecItem(row: Row): SpecificationItemDto {
  return {
    id: String(row.id),
    key: String(row.key),
    label: asLocalized(row.label) ?? { fa: "" },
    value: asLocalized(row.value) ?? { fa: "" },
    unit: (row.unit as string | null) ?? null,
    position: Number(row.position ?? 0),
  };
}

export function mapSpecGroup(row: Row): SpecificationGroupDto {
  const items = Array.isArray(row.specification_items)
    ? (row.specification_items as Row[]).map(mapSpecItem)
    : [];
  items.sort((a, b) => a.position - b.position);
  return {
    id: String(row.id),
    key: String(row.key),
    label: asLocalized(row.label) ?? { fa: "" },
    position: Number(row.position ?? 0),
    items,
  };
}

export function mapCertification(row: Row): CertificationDto {
  return {
    id: String(row.id),
    name: String(row.name),
    issuer: (row.issuer as string | null) ?? null,
    reference: (row.reference as string | null) ?? null,
    position: Number(row.position ?? 0),
  };
}

export function mapFaq(row: Row): FaqItemDto {
  return {
    id: String(row.id),
    question: asLocalized(row.question) ?? { fa: "" },
    answer: asLocalized(row.answer) ?? { fa: "" },
    position: Number(row.position ?? 0),
  };
}

export function mapSeo(row: Row | null | undefined): ProductSeoDto | null {
  if (!row) return null;
  return {
    title: asLocalized(row.title),
    description: asLocalized(row.description),
    keywords: Array.isArray(row.keywords) ? (row.keywords as string[]) : [],
    canonical: (row.canonical as string | null) ?? null,
    ogImage: row.og_image ? resolveMediaUrl(String(row.og_image)) : null,
  };
}

export function mapProductSummary(row: Row): ProductSummaryDto {
  const images = Array.isArray(row.product_images)
    ? (row.product_images as Row[]).map(mapImage)
    : [];
  const primary = images.find((i) => i.isPrimary) ?? images[0] ?? null;
  return {
    id: String(row.id),
    slug: String(row.slug),
    code: (row.code as string | null) ?? null,
    name: String(row.name),
    categoryKey: row.category_key as ProductSummaryDto["categoryKey"],
    series: asLocalized(row.series),
    shortDescription: asLocalized(row.short_description),
    status: row.status as ProductSummaryDto["status"],
    primaryImage: primary,
    updatedAt: String(row.updated_at),
  };
}

export function mapProductDetail(row: Row): ProductDetailDto {
  const summary = mapProductSummary(row);
  const images = Array.isArray(row.product_images)
    ? (row.product_images as Row[]).map(mapImage).sort((a, b) => a.position - b.position)
    : [];
  const videos = Array.isArray(row.product_videos)
    ? (row.product_videos as Row[]).map(mapVideo).sort((a, b) => a.position - b.position)
    : [];
  const documents = Array.isArray(row.product_documents)
    ? (row.product_documents as Row[]).map(mapDocument).sort((a, b) => a.position - b.position)
    : [];
  const specifications = Array.isArray(row.specification_groups)
    ? (row.specification_groups as Row[]).map(mapSpecGroup).sort((a, b) => a.position - b.position)
    : [];
  const certifications = Array.isArray(row.certifications)
    ? (row.certifications as Row[]).map(mapCertification).sort((a, b) => a.position - b.position)
    : [];
  const faqItems = Array.isArray(row.faq_items)
    ? (row.faq_items as Row[]).map(mapFaq).sort((a, b) => a.position - b.position)
    : [];

  // related_products is fetched as a join; the related slug lives on the joined row.
  const relatedSlugs = Array.isArray(row.related_from)
    ? (row.related_from as Row[])
        .map((r) => (r.to as Row | undefined)?.slug)
        .filter((s): s is string => typeof s === "string")
    : [];

  // product_seo arrives as either a single row (1:1) or an array depending on the embed shape.
  const seoRaw = Array.isArray(row.product_seo)
    ? ((row.product_seo as Row[])[0] ?? null)
    : (row.product_seo as Row | null | undefined) ?? null;

  return {
    ...summary,
    description: asLocalized(row.description),
    features: asLocalizedArray(row.features),
    images,
    videos,
    documents,
    specifications,
    certifications,
    faqItems,
    seo: mapSeo(seoRaw),
    relatedSlugs,
  };
}