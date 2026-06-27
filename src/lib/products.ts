import type { Lang } from "./i18n";

export type ProductCategoryKey =
  | "power-wheelchairs"
  | "manual-wheelchairs"
  | "shower-wheelchairs"
  | "patient-lifts"
  | "mobility-scooters";

/**
 * Localized text — `en` is required as the fallback; `fa` / `ar` are optional
 * until translations are supplied (typically by the future CMS).
 */
export type LocalizedText = { en: string; fa?: string; ar?: string };

/**
 * Reference to a media asset. `src` is intentionally a free-form string so it
 * can hold either a current public path (e.g. `/images/foo.jpg`) or a future
 * CMS / S3 key (e.g. `s3://faratech-media/products/...`). The frontend treats
 * it as a URL; the CMS layer will normalize keys to signed URLs at read time.
 */
export type ProductImage = {
  src: string;
  alt?: LocalizedText;
  width?: number;
  height?: number;
  isPrimary?: boolean;
};

export type ProductVideo = {
  src: string;
  poster?: string;
  title?: LocalizedText;
  provider?: "youtube" | "vimeo" | "self-hosted";
  durationSeconds?: number;
};

export type ProductDocumentKind =
  | "brochure"
  | "manual"
  | "datasheet"
  | "certificate"
  | "warranty"
  | "other";

export type ProductDocument = {
  kind: ProductDocumentKind;
  src: string;
  title?: LocalizedText;
  language?: Lang;
  sizeBytes?: number;
};

export type SpecificationItem = {
  key: string;
  label: LocalizedText;
  value: LocalizedText;
  unit?: string;
};

export type SpecificationGroup = {
  key: string;
  label: LocalizedText;
  items: SpecificationItem[];
};

export type Certification = {
  name: string;
  issuer?: string;
  reference?: string;
};

export type FAQItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type RelatedProductRef = {
  category: ProductCategoryKey;
  slug: string;
};

export type ProductSEO = {
  title?: LocalizedText;
  description?: LocalizedText;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
};

export type ProductStatus = "draft" | "published" | "archived";

/**
 * Product data contract (Phase 1A — Product Model Foundation).
 *
 * Required fields (`slug`, `name`) are unchanged so all 38 existing records
 * remain valid. Every other field is optional and is intended to be populated
 * by the future CMS / Prisma layer. The frontend MUST render any optional
 * section only when the corresponding field is populated — never with
 * placeholder, demo, or fake content.
 *
 * See `docs/005_PRODUCT_MODEL.md` for field definitions, CMS migration notes
 * and the Prisma mapping guidance.
 */
export type Product = {
  // Identity & routing — DO NOT change shape; `slug` is the route identifier.
  slug: string;
  name: string; // model name — NOT translated
  code?: string; // SKU / business code — not a route identifier
  series?: LocalizedText;
  tagline?: LocalizedText;

  // Localized long-form copy (CMS-supplied).
  description?: LocalizedText;
  shortDescription?: LocalizedText;
  features?: LocalizedText[];

  // Structured technical specifications.
  specifications?: SpecificationGroup[];
  certifications?: Certification[];

  // Media references — never bundled assets, always remote refs / CMS keys.
  media?: {
    images?: ProductImage[];
    videos?: ProductVideo[];
  };

  // Downloadable documents (brochures, manuals, datasheets, certificates).
  documents?: ProductDocument[];

  // Editorial extras.
  faq?: FAQItem[];
  related?: RelatedProductRef[];

  // Per-product SEO overrides (fall back to category / global defaults).
  seo?: ProductSEO;

  // Lifecycle.
  status?: ProductStatus;

  // CMS migration metadata — populated when records originate from the CMS.
  cmsId?: string;
  createdAt?: string; // ISO 8601
  updatedAt?: string; // ISO 8601
};

export type Category = {
  key: ProductCategoryKey;
  title: Record<Lang, string>;
  blurb: Record<Lang, string>;
  products: Product[];
};

const cat = (
  key: ProductCategoryKey,
  title: Record<Lang, string>,
  blurb: Record<Lang, string>,
  products: Product[],
): Category => ({ key, title, blurb, products });

const power: Product[] = [
  // Upholstered series
  { slug: "fateh-lx2", name: "Fateh LX2 Power Wheelchair", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "levo-standing", name: "LEVO Electric Standing Wheelchair", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "fateh-capitan", name: "Fateh Capitan Power Wheelchair", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "fateh-extra-new", name: "Fateh Extra New Power Wheelchair", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "fateh-jx2-lift", name: "Fateh JX2 Power Wheelchair – Lift Model", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "fateh-eco", name: "Fateh Eco Power Wheelchair", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "fateh-110", name: "Fateh 110 Power Wheelchair", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "upholstered-power", name: "Upholstered Power Wheelchair", series: { en: "Upholstered Power Wheelchairs" } },
  { slug: "spider-seat-elevation", name: "Spider Power Wheelchair with Power Seat Elevation", series: { en: "Upholstered Power Wheelchairs" } },
  // Foldable series
  { slug: "beta25", name: "Beta25 Foldable Power Wheelchair", series: { en: "Foldable Power Wheelchairs" } },
  { slug: "beta25-lithium-al", name: "Beta25 Lithium Foldable Power Wheelchair (AL)", series: { en: "Foldable Power Wheelchairs" } },
  { slug: "kid-model", name: "Kid Model Power Wheelchair", series: { en: "Foldable Power Wheelchairs" } },
  { slug: "gamma45", name: "Gamma45 Foldable Power Wheelchair", series: { en: "Foldable Power Wheelchairs" } },
  { slug: "gamma45-lithium", name: "Gamma45 Lithium Foldable Power Wheelchair", series: { en: "Foldable Power Wheelchairs" } },
  { slug: "super-gamma", name: "Super Gamma Foldable Power Wheelchair", series: { en: "Foldable Power Wheelchairs" } },
  { slug: "model-213-carbon", name: "Model 213 Carbon Fiber Lightweight Power Wheelchair", series: { en: "Foldable Power Wheelchairs" } },
  { slug: "starwheel", name: "Starwheel Foldable Power Wheelchair", series: { en: "Foldable Power Wheelchairs" } },
];

const manual: Product[] = [
  { slug: "innuovo-aluminum-sport", name: "Innuovo Aluminum Foldable Sport Manual Wheelchair" },
  { slug: "innuovo-carbon-fiber", name: "Innuovo Carbon Fiber Manual Wheelchair" },
  { slug: "alpha550", name: "Alpha550 Standard Manual Wheelchair" },
  { slug: "alpha750", name: "Alpha750 Standard Manual Wheelchair (AL, XL)" },
  { slug: "alpha850-al", name: "Alpha850 Standard Manual Wheelchair (AL)" },
  { slug: "alpha851-al", name: "Alpha851 Standard Manual Wheelchair (AL)" },
  { slug: "alpha950", name: "Alpha950 Standard Manual Wheelchair" },
  { slug: "alpha951", name: "Alpha951 Standard Manual Wheelchair" },
  { slug: "xigma-sport", name: "Xigma Sport Manual Wheelchair (Optional)" },
  { slug: "stair-climbing", name: "Stair-Climbing Wheelchair" },
];

const shower: Product[] = [
  { slug: "ava650", name: "Ava650 Shower Commode Wheelchair" },
  { slug: "ava750", name: "Ava750 Shower Commode Wheelchair" },
  { slug: "ava850", name: "Ava850 Shower Commode Wheelchair" },
];

const lifts: Product[] = [
  { slug: "personal-sit-to-stand", name: "Personal Sit-to-Stand Floor Lift" },
  { slug: "l160", name: "L160 Electric Patient Lift" },
  { slug: "l180", name: "L180 Electric Patient Lift" },
  { slug: "l260", name: "L260 Electric Patient Lift" },
  { slug: "l280", name: "L280 Electric Patient Lift" },
  { slug: "linak-jack", name: "Linak Jack Electric Patient Lift" },
];

const scooters: Product[] = [
  { slug: "m150-4wheel", name: "M150 New 4-Wheel Powered Mobility Scooter" },
];

export const CATEGORIES: Category[] = [
  cat(
    "power-wheelchairs",
    { en: "Power Wheelchairs", fa: "ویلچرهای برقی", ar: "كراسي متحركة كهربائية" },
    {
      en: "Intelligent powered mobility — from upholstered clinical models to foldable carbon-fiber lightweights.",
      fa: "تحرک برقی هوشمند — از مدل‌های روکش‌دار بالینی تا مدل‌های تاشو و سبک با فیبر کربن.",
      ar: "تنقّل كهربائي ذكي — من الموديلات السريرية المنجدة إلى الموديلات القابلة للطي بألياف الكربون الخفيفة.",
    },
    power,
  ),
  cat(
    "manual-wheelchairs",
    { en: "Manual Wheelchairs", fa: "ویلچرهای دستی", ar: "كراسي متحركة يدوية" },
    {
      en: "Ultralight, sport, and standard manual wheelchairs engineered for daily clinical and active use.",
      fa: "ویلچرهای دستی فوق‌سبک، ورزشی و استاندارد، مهندسی‌شده برای استفاده روزانه بالینی و فعال.",
      ar: "كراسي متحركة يدوية فائقة الخفة ورياضية وقياسية، مصممة للاستخدام السريري والنشط اليومي.",
    },
    manual,
  ),
  cat(
    "shower-wheelchairs",
    { en: "Shower Wheelchairs", fa: "ویلچرهای حمام", ar: "كراسي متحركة للاستحمام" },
    {
      en: "Corrosion-resistant shower and commode chairs designed for hygiene and clinical safety.",
      fa: "صندلی‌های حمام و توالت مقاوم در برابر خوردگی، طراحی‌شده برای بهداشت و ایمنی بالینی.",
      ar: "كراسي استحمام ومرحاض مقاومة للتآكل، مصممة للنظافة والسلامة السريرية.",
    },
    shower,
  ),
  cat(
    "patient-lifts",
    { en: "Patient Lifts", fa: "بالابرهای بیمار", ar: "رافعات المرضى" },
    {
      en: "Electric and sit-to-stand patient lifts for safe transfer in hospitals, care facilities and homes.",
      fa: "بالابرهای بیمار برقی و نشستن-به-ایستادن برای جابجایی ایمن در بیمارستان، مراکز مراقبت و منزل.",
      ar: "رافعات مرضى كهربائية ومن الجلوس إلى الوقوف لنقل آمن في المستشفيات ومراكز الرعاية والمنازل.",
    },
    lifts,
  ),
  cat(
    "mobility-scooters",
    { en: "Mobility Scooters", fa: "اسکوترهای حرکتی", ar: "سكوترات التنقل" },
    {
      en: "Stable four-wheel powered scooters for outdoor independence and long-range use.",
      fa: "اسکوترهای برقی چهارچرخ پایدار برای استقلال در فضای باز و استفاده در مسافت طولانی.",
      ar: "سكوترات كهربائية بأربع عجلات مستقرة لاستقلالية في الهواء الطلق واستخدام لمسافات طويلة.",
    },
    scooters,
  ),
];

// ---------------------------------------------------------------------------
// Phase 5 — Master-data overlay removed.
//
// Up through Phase 4 this module enriched the identity-only `CATEGORIES`
// skeleton at module-init time by overlaying editorial content, technical
// specifications, certifications, and FAQ entries from the static files in
// `src/lib/data/` (PRODUCTS_MASTER + CATEGORY_COPY).
//
// In Phase 5 those records were imported into Supabase
// (`public.products`, `public.specification_groups`,
// `public.specification_items`, `public.certifications`,
// `public.faq_items`, `public.category_copy`) and the runtime UI now reads
// them through the Repository / Service / Mapper / DTO layers via
// `src/lib/products-db-adapter.ts`. Public routes therefore no longer
// depend on the static TS files at runtime.
//
// The skeleton below intentionally remains identity-only: it still backs
// the navigation chrome (footer, top-nav) and the admin in-memory CMS
// scaffolding. Editorial copy, specs and FAQs MUST be sourced from the
// database via the server functions in `src/lib/modules/*`.
//
// Source-of-truth files retained for the seed generator
// (`scripts/generate-phase5-seed.ts`) and Phase-6 translation work:
//   - src/lib/data/products-master.ts
//   - src/lib/data/category-copy.ts
//   - src/lib/data/company.ts
// ---------------------------------------------------------------------------


export const getCategory = (key: string) =>
  CATEGORIES.find((c) => c.key === key);
export const getProduct = (catKey: string, slug: string) =>
  getCategory(catKey)?.products.find((p) => p.slug === slug);

/**
 * Read-side helpers — Phase 2A public adapter.
 *
 * Public routes MUST use these helpers (not the raw `getProduct`) so that
 * `status` filtering is honoured: drafts and archived records resolve to
 * `null` and never appear in category listings.
 */
const isVisible = (p: Product) => (p.status ?? "published") === "published";

export const listVisibleCategories = (): Category[] =>
  CATEGORIES.map((c) => ({ ...c, products: c.products.filter(isVisible) }));

export const getVisibleCategory = (key: string): Category | undefined => {
  const c = getCategory(key);
  if (!c) return undefined;
  return { ...c, products: c.products.filter(isVisible) };
};

export const getVisibleProduct = (
  catKey: string,
  slug: string,
): Product | undefined => {
  const p = getProduct(catKey, slug);
  return p && isVisible(p) ? p : undefined;
};
