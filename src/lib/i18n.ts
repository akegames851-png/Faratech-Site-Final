export type Lang = "en" | "fa" | "ar";
export const LANGS: Lang[] = ["en", "fa", "ar"];
export const DEFAULT_LANG: Lang = "fa";
export const LANG_LABELS: Record<Lang, string> = { en: "English", fa: "فارسی", ar: "العربية" };
export const isLang = (v: string | undefined): v is Lang =>
  v === "en" || v === "fa" || v === "ar";
export const dirOf = (l: Lang) => (l === "en" ? "ltr" : "rtl");

// BCP-47 locale tag used by Intl APIs (NumberFormat, DateTimeFormat).
export const localeTag = (l: Lang): string =>
  l === "en" ? "en-US" : l === "fa" ? "fa-IR" : "ar-SA";

type Dict = Record<Lang, string>;
// Canonical i18n string accessor. Falls back through: requested → fa → en → "".
// Persian is the canonical language; English is a secondary fallback only.
export const t = (d: Partial<Dict>, lang: Lang): string =>
  d[lang] ?? d.fa ?? d.en ?? "";

// ---------------------------------------------------------------------------
// Localized DB field helper — shared by SEO, routes and UI components so the
// fa-canonical fallback rule lives in exactly one place.
// ---------------------------------------------------------------------------
export type LocalizedField = { fa: string; en?: string | null; ar?: string | null };

export const pickLocalized = (
  v: LocalizedField | null | undefined,
  lang: Lang,
): string | undefined => {
  if (!v) return undefined;
  if (lang === "en" && v.en) return v.en;
  if (lang === "ar" && v.ar) return v.ar;
  return v.fa || v.en || undefined;
};

// ---------------------------------------------------------------------------
// Number / date formatting — locale-aware with Persian/Arabic numeral support.
// All helpers are pure and safe to call during SSR.
// ---------------------------------------------------------------------------
export function formatNumber(value: number, lang: Lang, opts?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(localeTag(lang), opts).format(value);
  } catch {
    return String(value);
  }
}

export function formatDate(
  value: Date | string | number,
  lang: Lang,
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(localeTag(lang), opts).format(date);
  } catch {
    return date.toISOString();
  }
}

const DIGIT_MAPS: Record<Lang, string[]> = {
  en: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  fa: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  ar: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
};

// Convert ASCII digits in a string to the locale's preferred digit glyphs.
// Non-digit characters pass through untouched.
export function toLocalDigits(input: string | number, lang: Lang): string {
  const map = DIGIT_MAPS[lang];
  return String(input).replace(/[0-9]/g, (d) => map[Number(d)]);
}

// Inline script body injected by the $lang route's head() so html.lang/dir is
// correct before hydration. Avoids RTL FOUC on the first paint.
export const htmlLangDirScript = (lang: Lang): string =>
  `(function(){var d=document.documentElement;d.lang=${JSON.stringify(lang)};d.dir=${JSON.stringify(dirOf(lang))};})();`;

// Common UI dictionary
export const T = {
  // Top bar
  iso: { en: "ISO 13485 Certified Manufacturer", fa: "تولیدکننده دارای گواهی ISO 13485", ar: "مُصنّع معتمد ISO 13485" },
  ceFda: { en: "CE · FDA · TÜV Approved", fa: "تأییدشده CE · FDA · TÜV", ar: "معتمد CE · FDA · TÜV" },
  intlSales: { en: "International Sales", fa: "فروش بین‌المللی", ar: "المبيعات الدولية" },
  // Nav
  products: { en: "Products", fa: "محصولات", ar: "المنتجات" },
  engineering: { en: "Engineering", fa: "مهندسی", ar: "الهندسة" },
  solutions: { en: "Solutions", fa: "راهکارها", ar: "الحلول" },
  about: { en: "About", fa: "درباره ما", ar: "من نحن" },
  contact: { en: "Contact", fa: "تماس", ar: "اتصل" },
  spareParts: { en: "Spare Parts", fa: "قطعات یدکی", ar: "قطع الغيار" },
  findDistributor: { en: "Find Distributor", fa: "یافتن نمایندگی", ar: "ابحث عن موزع" },
  requestQuote: { en: "Request a Quote", fa: "درخواست قیمت", ar: "اطلب عرض سعر" },
  // Categories
  catPower: { en: "Power Wheelchairs", fa: "ویلچرهای برقی", ar: "كراسي متحركة كهربائية" },
  catManual: { en: "Manual Wheelchairs", fa: "ویلچرهای دستی", ar: "كراسي متحركة يدوية" },
  catShower: { en: "Shower Wheelchairs", fa: "ویلچرهای حمام", ar: "كراسي متحركة للاستحمام" },
  catLifts: { en: "Patient Lifts", fa: "بالابرهای بیمار", ar: "رافعات المرضى" },
  catScooters: { en: "Mobility Scooters", fa: "اسکوترهای حرکتی", ar: "سكوترات التنقل" },
  // Hero
  heroEyebrow: { en: "Precision Engineering Since 1987", fa: "مهندسی دقیق از سال ۱۹۸۷", ar: "هندسة دقيقة منذ 1987" },
  heroH1a: { en: "Redefining", fa: "بازتعریف", ar: "إعادة تعريف" },
  heroH1b: { en: "Human", fa: "تحرک", ar: "تنقّل" },
  heroH1c: { en: "Mobility.", fa: "انسان.", ar: "الإنسان." },
  heroSub: {
    en: "FARATECH engineers premium wheelchair systems where aerospace precision meets clinical expertise — trusted by 1,200+ healthcare institutions across 60 countries.",
    fa: "فراتک سامانه‌های ویلچر پریمیوم تولید می‌کند، آنجا که دقت مهندسی هوافضا با تخصص بالینی تلاقی می‌کند — مورد اعتماد بیش از ۱٬۲۰۰ مرکز درمانی در ۶۰ کشور.",
    ar: "تصمّم فراتك أنظمة كراسي متحركة فاخرة تجمع دقة هندسة الطيران مع الخبرة السريرية — موثوقة لدى أكثر من 1,200 مؤسسة صحية في 60 دولة.",
  },
  exploreProducts: { en: "Explore Products", fa: "مشاهده محصولات", ar: "استكشف المنتجات" },
  ourStory: { en: "Our Engineering Story", fa: "داستان مهندسی ما", ar: "قصتنا الهندسية" },
  years: { en: "Years", fa: "سال", ar: "سنوات" },
  countries: { en: "Countries", fa: "کشور", ar: "دولة" },
  partners: { en: "Partners", fa: "شریک", ar: "شريك" },
  satisfaction: { en: "Satisfaction", fa: "رضایت", ar: "الرضا" },
  scroll: { en: "Scroll", fa: "اسکرول", ar: "مرّر" },
  // Hero shortcuts
  shortcutsTitle: { en: "Explore Our Product Range", fa: "گستره محصولات ما را ببینید", ar: "استكشف مجموعة منتجاتنا" },
  shortcutPM: { en: "Power & Manual Wheelchairs", fa: "ویلچرهای برقی و دستی", ar: "كراسي كهربائية ويدوية" },
  shortcutLifts: { en: "Patient Lifts", fa: "بالابرهای بیمار", ar: "رافعات المرضى" },
  shortcutScooters: { en: "Mobility Scooters", fa: "اسکوترهای حرکتی", ar: "سكوترات التنقل" },
  shortcutParts: { en: "Spare Parts", fa: "قطعات یدکی", ar: "قطع الغيار" },
  view: { en: "View", fa: "مشاهده", ar: "عرض" },
  // Products overview
  overviewEyebrow: { en: "Product Portfolio", fa: "سبد محصولات", ar: "محفظة المنتجات" },
  overviewTitle: { en: "Engineered Mobility Solutions", fa: "راهکارهای تحرک مهندسی‌شده", ar: "حلول تنقل هندسية" },
  overviewSub: {
    en: "Browse our full range of mobility products — every category engineered for safety, durability, and clinical performance.",
    fa: "گستره کامل محصولات تحرک ما را مرور کنید — هر دسته برای ایمنی، دوام و عملکرد بالینی مهندسی شده است.",
    ar: "تصفّح مجموعتنا الكاملة من منتجات التنقل — كل فئة مصممة للسلامة والمتانة والأداء السريري.",
  },
  models: { en: "models", fa: "مدل", ar: "موديل" },
  viewCategory: { en: "View category", fa: "مشاهده دسته", ar: "عرض الفئة" },
  // Product page
  overview: { en: "Overview", fa: "معرفی", ar: "نظرة عامة" },
  specifications: { en: "Specifications", fa: "مشخصات", ar: "المواصفات" },
  features: { en: "Key Features", fa: "ویژگی‌های کلیدی", ar: "الميزات الرئيسية" },
  inquireProduct: { en: "Inquire About This Product", fa: "استعلام درباره این محصول", ar: "استفسر عن هذا المنتج" },
  downloadBrochure: { en: "Download Brochure", fa: "دانلود بروشور", ar: "تحميل الكتيب" },
  imagePlaceholder: { en: "Product image — to be added", fa: "تصویر محصول — به‌زودی افزوده می‌شود", ar: "صورة المنتج — ستُضاف لاحقًا" },
  modelCode: { en: "Model", fa: "مدل", ar: "الموديل" },
  category: { en: "Category", fa: "دسته", ar: "الفئة" },
  series: { en: "Series", fa: "سری", ar: "السلسلة" },
  backToCategory: { en: "Back to category", fa: "بازگشت به دسته", ar: "العودة إلى الفئة" },
  productDescription: {
    en: "Premium engineering, clinical-grade construction, and field-proven reliability. Designed and assembled to international medical-device standards.",
    fa: "مهندسی پریمیوم، ساخت در سطح بالینی و قابلیت اطمینان اثبات‌شده در میدان. طراحی و مونتاژ مطابق با استانداردهای جهانی تجهیزات پزشکی.",
    ar: "هندسة فاخرة وبناء سريري وموثوقية مُثبتة ميدانيًا. مصمم ومُجمَّع وفقًا للمعايير الدولية للأجهزة الطبية.",
  },
  featStrength: { en: "Reinforced frame for daily clinical use", fa: "فریم تقویت‌شده برای استفاده روزانه بالینی", ar: "هيكل مُقوّى للاستخدام السريري اليومي" },
  featSafety: { en: "Multi-stage safety and braking systems", fa: "سامانه‌های ایمنی و ترمز چندمرحله‌ای", ar: "أنظمة سلامة وفرملة متعددة المراحل" },
  featComfort: { en: "Ergonomic seating with pressure relief", fa: "نشیمن ارگونومیک با کاهش فشار", ar: "مقعد مريح بتخفيف الضغط" },
  featService: { en: "Worldwide service and spare parts support", fa: "پشتیبانی خدمات و قطعات یدکی در سراسر جهان", ar: "دعم خدمة وقطع غيار حول العالم" },
  // Spec labels (kept compact)
  specFrame: { en: "Frame Material", fa: "جنس فریم", ar: "مادة الهيكل" },
  specWeight: { en: "Weight Capacity", fa: "ظرفیت وزن", ar: "سعة الوزن" },
  specWidth: { en: "Seat Width", fa: "عرض نشیمن", ar: "عرض المقعد" },
  specWarranty: { en: "Warranty", fa: "گارانتی", ar: "الضمان" },
  specCertification: { en: "Certification", fa: "گواهی", ar: "الشهادات" },
  // Spare parts
  sparePartsTitle: { en: "Spare Parts & Service", fa: "قطعات یدکی و خدمات", ar: "قطع الغيار والخدمة" },
  sparePartsSub: {
    en: "Genuine FARATECH replacement parts — engineered for safe, long-term operation of your mobility equipment.",
    fa: "قطعات یدکی اصلی فراتک — مهندسی‌شده برای کارکرد ایمن و بلندمدت تجهیزات تحرک شما.",
    ar: "قطع غيار فراتك الأصلية — مصممة للتشغيل الآمن وطويل الأمد لمعدات التنقل الخاصة بك.",
  },
  partJoystick: { en: "Joystick Controller", fa: "کنترلر جوی‌استیک", ar: "وحدة تحكم بعصا التحكم" },
  partWheel: { en: "Wheel Assembly", fa: "مجموعه چرخ", ar: "مجموعة العجلة" },
  partBattery: { en: "Battery Pack", fa: "پک باتری", ar: "حزمة البطارية" },
  partArmrest: { en: "Armrest Assembly", fa: "مجموعه دسته", ar: "مجموعة مسند الذراع" },
  partFootrest: { en: "Footrest Assembly", fa: "مجموعه زیرپایی", ar: "مجموعة مسند القدم" },
  partInquire: { en: "Contact us for availability and OEM compatibility.", fa: "برای موجودی و سازگاری OEM با ما تماس بگیرید.", ar: "اتصل بنا للتحقق من التوفر وتوافق OEM." },
  // Footer
  newsletter: { en: "Engineering Newsletter", fa: "خبرنامه مهندسی", ar: "النشرة الهندسية" },
  newsletterSub: { en: "Quarterly product news, technical bulletins, and clinical research.", fa: "اخبار فصلی محصول، اطلاعیه‌های فنی و تحقیقات بالینی.", ar: "أخبار فصلية للمنتجات والنشرات الفنية والبحوث السريرية." },
  subscribe: { en: "Subscribe", fa: "عضویت", ar: "اشترك" },
  emailPlaceholder: { en: "your.email@company.com", fa: "ایمیل شما", ar: "بريدك الإلكتروني" },
  rights: { en: "All rights reserved.", fa: "تمامی حقوق محفوظ است.", ar: "جميع الحقوق محفوظة." },
  // CTA section
  ctaEyebrow: { en: "Start the Conversation", fa: "شروع گفت‌وگو", ar: "ابدأ المحادثة" },
  ctaTitle: { en: "Ready to Experience FARATECH Engineering?", fa: "آماده تجربه مهندسی فراتک هستید؟", ar: "هل أنت مستعد لتجربة هندسة فراتك؟" },
  ctaSub: {
    en: "Our clinical and commercial teams are ready to help — whether you need a single wheelchair or a hospital-wide procurement partnership.",
    fa: "تیم‌های بالینی و تجاری ما آماده کمک هستند — چه به یک ویلچر نیاز داشته باشید چه به یک قرارداد تامین در سطح بیمارستان.",
    ar: "فرقنا السريرية والتجارية جاهزة للمساعدة — سواء كنت بحاجة إلى كرسي واحد أو شراكة توريد لمستشفى كامل.",
  },
  getInTouch: { en: "Get in Touch Directly", fa: "تماس مستقیم", ar: "تواصل مباشرة" },
  hq: { en: "Headquarters", fa: "دفتر مرکزی", ar: "المقر الرئيسي" },
  // Engineering / Solutions / Testimonials section eyebrows
  whyTitle: { en: "Engineering Excellence", fa: "برتری مهندسی", ar: "تميّز هندسي" },
  solutionsTitle: { en: "Solutions for Every Setting", fa: "راهکارها برای هر محیط", ar: "حلول لكل بيئة" },
  testimonialsTitle: { en: "Trusted by Professionals Worldwide", fa: "مورد اعتماد متخصصان در سراسر جهان", ar: "موثوق به من المتخصصين حول العالم" },
  // Common
  home: { en: "Home", fa: "خانه", ar: "الرئيسية" },
  email: { en: "Email", fa: "ایمیل", ar: "البريد الإلكتروني" },
  imagePlaceholderShort: { en: "Image placeholder", fa: "تصویر — به‌زودی", ar: "صورة — قريبًا" },
  productImagePlaceholder: { en: "Product image placeholder", fa: "تصویر محصول — جای‌نما", ar: "صورة المنتج — مكان مؤقت" },
  // Hero floating badges
  badgeFrameWeight: { en: "Frame Weight", fa: "وزن فریم", ar: "وزن الهيكل" },
  badgeCarbonGrade: { en: "Carbon Grade", fa: "گرید کربن", ar: "درجة الكربون" },
  badgeNew2025: { en: "NEW 2025", fa: "جدید ۲۰۲۵", ar: "جديد 2025" },
  // Stats section
  byTheNumbers: { en: "By the Numbers", fa: "بر اساس ارقام", ar: "بالأرقام" },
  statsHeadline: {
    en: "Three decades of engineering, measured in lives moved.",
    fa: "سه دهه مهندسی، اندازه‌گیری‌شده با زندگی‌هایی که به حرکت درآمده‌اند.",
    ar: "ثلاثة عقود من الهندسة، تُقاس بالأرواح التي تحرّكت.",
  },
  stat1Label: { en: "Years of Innovation", fa: "سال نوآوری", ar: "سنوات من الابتكار" },
  stat1Desc: { en: "Founded in Stuttgart, 1989", fa: "تأسیس در اشتوتگارت، ۱۹۸۹", ar: "تأسست في شتوتغارت، 1989" },
  stat2Label: { en: "Wheelchairs Delivered", fa: "ویلچر تحویل‌شده", ar: "كراسي متحركة مُسلَّمة" },
  stat2Desc: { en: "Worldwide since founding", fa: "در سراسر جهان از زمان تأسیس", ar: "حول العالم منذ التأسيس" },
  stat3Label: { en: "Countries Served", fa: "کشور تحت پوشش", ar: "دولة مخدومة" },
  stat3Desc: { en: "Global distribution network", fa: "شبکه توزیع جهانی", ar: "شبكة توزيع عالمية" },
  stat4Label: { en: "Healthcare Partners", fa: "شرکای درمانی", ar: "شركاء الرعاية الصحية" },
  stat4Desc: { en: "Hospitals & rehab centers", fa: "بیمارستان‌ها و مراکز توان‌بخشی", ar: "مستشفيات ومراكز تأهيل" },
  stat5Label: { en: "Partner Satisfaction", fa: "رضایت شرکا", ar: "رضا الشركاء" },
  stat5Desc: { en: "2024 Global Survey", fa: "نظرسنجی جهانی ۲۰۲۴", ar: "استطلاع عالمي 2024" },
  stat6Label: { en: "Engineering Staff", fa: "کارکنان مهندسی", ar: "كادر هندسي" },
  stat6Desc: { en: "R&D, production & service", fa: "تحقیق‌وتوسعه، تولید و خدمات", ar: "البحث والتطوير والإنتاج والخدمة" },
  // Engineering pillars
  engHeadline: { en: "Engineering is in our DNA.", fa: "مهندسی در DNA ماست.", ar: "الهندسة في حمضنا النووي." },
  engSub: {
    en: "From raw material to finished product, every wheelchair is built around four engineering pillars.",
    fa: "از ماده اولیه تا محصول نهایی، هر ویلچر بر اساس چهار ستون مهندسی ساخته می‌شود.",
    ar: "من المادة الخام إلى المنتج النهائي، يُبنى كل كرسي متحرك حول أربعة أعمدة هندسية.",
  },
  pillar1Title: { en: "Precision Manufacturing", fa: "تولید دقیق", ar: "تصنيع دقيق" },
  pillar1Desc: { en: "ISO 13485 production, CNC-machined components, full traceability.", fa: "تولید ISO 13485، قطعات ماشین‌کاری CNC، قابلیت ردیابی کامل.", ar: "إنتاج ISO 13485، قطع مُصنعة بـ CNC، تتبع كامل." },
  pillar2Title: { en: "Advanced Materials", fa: "مواد پیشرفته", ar: "مواد متقدمة" },
  pillar2Desc: { en: "T700 carbon fiber, aerospace-grade aluminum alloys.", fa: "فیبر کربن T700، آلیاژهای آلومینیومی گرید هوافضا.", ar: "ألياف كربون T700، سبائك ألومنيوم بجودة الطيران." },
  pillar3Title: { en: "Smart Electronics", fa: "الکترونیک هوشمند", ar: "إلكترونيات ذكية" },
  pillar3Desc: { en: "Programmable control modules with diagnostic telemetry.", fa: "ماژول‌های کنترل برنامه‌پذیر با تله‌متری تشخیصی.", ar: "وحدات تحكم قابلة للبرمجة مع قياس عن بُعد تشخيصي." },
  pillar4Title: { en: "Clinical Validation", fa: "اعتبارسنجی بالینی", ar: "تحقق سريري" },
  pillar4Desc: { en: "EN 12183/12184 tested, MDR 2017/745 compliant.", fa: "آزمون‌شده مطابق EN 12183/12184، منطبق با MDR 2017/745.", ar: "مُختبر وفق EN 12183/12184 ومتوافق مع MDR 2017/745." },
  // Solutions
  useCases: { en: "Use Cases", fa: "موارد کاربرد", ar: "حالات الاستخدام" },
  sol1Title: { en: "Hospitals", fa: "بیمارستان‌ها", ar: "المستشفيات" },
  sol1Desc: { en: "Procurement-grade durability with full clinical service contracts.", fa: "دوام در سطح خرید سازمانی همراه با قراردادهای کامل خدمات بالینی.", ar: "متانة بمستوى المشتريات مع عقود خدمة سريرية شاملة." },
  sol2Title: { en: "Rehabilitation", fa: "توان‌بخشی", ar: "التأهيل" },
  sol2Desc: { en: "Adjustable positioning and clinician-tunable seating systems.", fa: "موقعیت‌دهی قابل تنظیم و سامانه‌های نشیمن قابل‌تنظیم توسط متخصص.", ar: "وضعيات قابلة للتعديل وأنظمة جلوس يمكن للأخصائي ضبطها." },
  sol3Title: { en: "Home Care", fa: "مراقبت در منزل", ar: "الرعاية المنزلية" },
  sol3Desc: { en: "Lightweight, foldable models for daily independence at home.", fa: "مدل‌های سبک و تاشو برای استقلال روزانه در منزل.", ar: "موديلات خفيفة وقابلة للطي لاستقلالية يومية في المنزل." },
  sol4Title: { en: "Sport & Active", fa: "ورزشی و فعال", ar: "رياضي ونشط" },
  sol4Desc: { en: "Performance carbon-fiber chairs for athletes and active users.", fa: "صندلی‌های فیبر کربن با عملکرد بالا برای ورزشکاران و کاربران فعال.", ar: "كراسي ألياف كربون عالية الأداء للرياضيين والمستخدمين النشطين." },
  // Testimonials
  voicesField: { en: "Voices from the field", fa: "صداهایی از میدان", ar: "أصوات من الميدان" },
  testi1Text: { en: "FARATECH chairs deliver consistent clinical performance year after year. Their service support is unmatched in Europe.", fa: "صندلی‌های فراتک سال‌به‌سال عملکرد بالینی ثابتی ارائه می‌دهند. پشتیبانی خدمات آن‌ها در اروپا بی‌رقیب است.", ar: "تقدّم كراسي فراتك أداءً سريريًا ثابتًا عامًا بعد عام. ودعمها الخدمي لا مثيل له في أوروبا." },
  testi1Role: { en: "Head of Rehabilitation, European University Hospital", fa: "رئیس بخش توان‌بخشی، بیمارستان دانشگاهی اروپایی", ar: "رئيس قسم التأهيل، مستشفى جامعي أوروبي" },
  testi2Text: { en: "We standardised on FARATECH after a 36-month evaluation. Total cost of ownership dropped by 22%.", fa: "پس از ارزیابی ۳۶ ماهه، فراتک را به‌عنوان استاندارد انتخاب کردیم. هزینه کل مالکیت ۲۲٪ کاهش یافت.", ar: "اعتمدنا فراتك معيارًا بعد تقييم استمر 36 شهرًا. وانخفضت التكلفة الإجمالية للملكية بنسبة 22٪." },
  testi2Role: { en: "Procurement Director, National Health Network", fa: "مدیر تأمین، شبکه ملی سلامت", ar: "مدير المشتريات، شبكة الصحة الوطنية" },
  testi3Text: { en: "Patient outcomes improved measurably. The seating systems make individualised positioning genuinely accessible.", fa: "نتایج بیماران به‌طور قابل اندازه‌گیری بهبود یافت. سامانه‌های نشیمن، موقعیت‌دهی فردی را واقعاً در دسترس قرار می‌دهند.", ar: "تحسّنت نتائج المرضى بشكل ملموس. أنظمة الجلوس تجعل الوضعية المخصّصة في متناول الجميع فعلاً." },
  testi3Role: { en: "Senior Occupational Therapist, Rehabilitation Institute", fa: "کاردرمانگر ارشد، مؤسسه توان‌بخشی", ar: "أخصائي علاج وظيفي أول، معهد إعادة التأهيل" },
  testiName1: { en: "Clinical Lead", fa: "سرپرست بالینی", ar: "القائد السريري" },
  testiName2: { en: "Procurement Lead", fa: "سرپرست تأمین", ar: "مدير المشتريات" },
  testiName3: { en: "Senior Therapist", fa: "درمانگر ارشد", ar: "أخصائي أول" },
  testimonialsDisclaimer: {
    en: "Illustrative quotes used while we collect signed customer references. Names anonymised.",
    fa: "نقل‌قول‌های نمونه — تا زمان جمع‌آوری توصیه‌نامه‌های امضاشده مشتریان. اسامی محرمانه شده‌اند.",
    ar: "اقتباسات توضيحية تُستخدم حتى نجمع مراجع عملاء موقّعة. الأسماء مجهولة الهوية.",
  },
  placeholderBadge: { en: "Placeholder", fa: "نمونه", ar: "عيّنة" },
  // Form validation + states
  validation_name: { en: "Please enter your name (at least 2 characters).", fa: "لطفاً نام خود را وارد کنید (حداقل ۲ کاراکتر).", ar: "يرجى إدخال اسمك (حرفان على الأقل)." },
  validation_email: { en: "Please enter a valid email address.", fa: "لطفاً یک ایمیل معتبر وارد کنید.", ar: "يرجى إدخال بريد إلكتروني صالح." },
  validation_message: { en: "Please write a short message (at least 10 characters).", fa: "لطفاً پیامی کوتاه بنویسید (حداقل ۱۰ کاراکتر).", ar: "يرجى كتابة رسالة قصيرة (10 أحرف على الأقل)." },
  submitting: { en: "Sending…", fa: "در حال ارسال…", ar: "جارٍ الإرسال…" },
  submitError: { en: "Something went wrong. Please try again or contact us by phone.", fa: "خطایی رخ داد. لطفاً دوباره تلاش کنید یا با ما تماس بگیرید.", ar: "حدث خطأ. يرجى المحاولة مجددًا أو الاتصال بنا هاتفيًا." },
  newsletterSuccess: { en: "Subscribed — thank you.", fa: "ثبت شد — متشکریم.", ar: "تم الاشتراك — شكرًا لك." },
  contactSuccessBody: { en: "Your request has been received. Our team will contact you shortly.", fa: "درخواست شما دریافت شد. تیم ما به‌زودی با شما تماس می‌گیرد.", ar: "تم استلام طلبك. سيتواصل معك فريقنا قريبًا." },
  // CTA form
  formName: { en: "Name", fa: "نام", ar: "الاسم" },
  formEmail: { en: "Email", fa: "ایمیل", ar: "البريد الإلكتروني" },
  formOrg: { en: "Organization", fa: "سازمان", ar: "المنظمة" },
  formMessage: { en: "Message", fa: "پیام", ar: "الرسالة" },
  thankYou: { en: "Thank you", fa: "متشکریم", ar: "شكرًا لك" },
  sendAnother: { en: "Send another message", fa: "ارسال پیام دیگر", ar: "إرسال رسالة أخرى" },
  hqAddress: { en: "FARATECH\nTehran, Iran", fa: "فراتک\nتهران، ایران", ar: "فراتك\nطهران، إيران" },
  // Footer link groups
  fnMaterials: { en: "Materials & R&D", fa: "مواد و تحقیق‌وتوسعه", ar: "المواد والبحث والتطوير" },
  fnManufacturing: { en: "Manufacturing", fa: "تولید", ar: "التصنيع" },
  fnCertifications: { en: "Certifications", fa: "گواهی‌ها", ar: "الشهادات" },
  fnSustainability: { en: "Sustainability", fa: "پایداری", ar: "الاستدامة" },
  fnHospitals: { en: "Hospitals", fa: "بیمارستان‌ها", ar: "المستشفيات" },
  fnRehab: { en: "Rehabilitation", fa: "توان‌بخشی", ar: "التأهيل" },
  fnHomecare: { en: "Home Care", fa: "مراقبت در منزل", ar: "الرعاية المنزلية" },
  fnSport: { en: "Sport", fa: "ورزشی", ar: "رياضي" },
  fnPrivacy: { en: "Privacy", fa: "حریم خصوصی", ar: "الخصوصية" },
  fnTerms: { en: "Terms", fa: "شرایط", ar: "الشروط" },
  fnImprint: { en: "Imprint", fa: "اطلاعات ناشر", ar: "بيانات الناشر" },
  // Spec values
  specFrameVal: { en: "Aircraft-grade aluminum / steel", fa: "آلومینیوم / فولاد گرید هوافضا", ar: "ألومنيوم / فولاذ بجودة الطيران" },
  specWeightVal: { en: "Up to 130 kg", fa: "تا ۱۳۰ کیلوگرم", ar: "حتى 130 كجم" },
  specWidthVal: { en: "40 – 50 cm", fa: "۴۰ – ۵۰ سانتی‌متر", ar: "40 – 50 سم" },
  specWarrantyVal: { en: "24 months", fa: "۲۴ ماه", ar: "24 شهرًا" },
  // Release 1.1 — Search & Discovery
  search: { en: "Search", fa: "جستجو", ar: "بحث" },
  searchPlaceholder: {
    en: "Search products, codes, series…",
    fa: "جستجوی محصولات، کدها، سری‌ها…",
    ar: "ابحث في المنتجات والرموز والسلاسل…",
  },
  searchSubmit: { en: "Search", fa: "جستجو", ar: "بحث" },
  searching: { en: "Searching…", fa: "در حال جستجو…", ar: "جارٍ البحث…" },
  searchResultsFor: { en: "Results for", fa: "نتایج برای", ar: "نتائج البحث عن" },
  searchResultsCount: { en: "results", fa: "نتیجه", ar: "نتيجة" },
  searchNoResults: {
    en: "No products matched your search.",
    fa: "محصولی با جستجوی شما مطابقت نداشت.",
    ar: "لا توجد منتجات تطابق بحثك.",
  },
  searchEmptyState: {
    en: "Type a product name, code or series to search the catalogue.",
    fa: "نام محصول، کد یا سری را برای جستجو در کاتالوگ وارد کنید.",
    ar: "اكتب اسم منتج أو رمزًا أو سلسلة للبحث في الكتالوج.",
  },
  // Release 1.2 — Design System: shared UI state strings.
  loading: { en: "Loading…", fa: "در حال بارگذاری…", ar: "جارٍ التحميل…" },
  retry: { en: "Try again", fa: "تلاش مجدد", ar: "أعد المحاولة" },
  errorTitle: { en: "Something went wrong", fa: "خطایی رخ داد", ar: "حدث خطأ ما" },
  errorBody: {
    en: "We couldn’t complete that request. Please try again in a moment.",
    fa: "نتوانستیم این درخواست را انجام دهیم. لطفاً کمی بعد دوباره تلاش کنید.",
    ar: "لم نتمكّن من إكمال الطلب. يرجى المحاولة مرة أخرى بعد قليل.",
  },
  emptyTitle: { en: "Nothing here yet", fa: "هنوز چیزی اینجا نیست", ar: "لا يوجد شيء هنا بعد" },
  emptyBody: {
    en: "There is no content to display in this view right now.",
    fa: "در حال حاضر محتوایی برای نمایش در این صفحه وجود ندارد.",
    ar: "لا يوجد محتوى لعرضه في هذا العرض حاليًا.",
  },
  // Release 1.3 — Related Products (FEATURE-0004 / RFC-0003)
  relatedProducts: {
    en: "Related Products",
    fa: "محصولات مرتبط",
    ar: "منتجات ذات صلة",
  },
  relatedProductsLoading: {
    en: "Loading related products…",
    fa: "در حال بارگذاری محصولات مرتبط…",
    ar: "جارٍ تحميل المنتجات ذات الصلة…",
  },
  // Release 1.4 — Search Suggestions (FEATURE-0005 / RFC-0004)
  searchSuggestionsLabel: {
    en: "Search suggestions",
    fa: "پیشنهادهای جستجو",
    ar: "اقتراحات البحث",
  },
  searchSuggestionsEmpty: {
    en: "No suggestions",
    fa: "پیشنهادی یافت نشد",
    ar: "لا توجد اقتراحات",
  },
  // Release 1.5 — Product Comparison (FEATURE-0006 / RFC-0005)
  compareAdd: { en: "Add to Compare", fa: "افزودن به مقایسه", ar: "أضف إلى المقارنة" },
  compareRemove: { en: "Remove from Compare", fa: "حذف از مقایسه", ar: "إزالة من المقارنة" },
  compareFull: {
    en: "Comparison full ({max} max)",
    fa: "مقایسه پر است (حداکثر {max})",
    ar: "المقارنة ممتلئة (الحد الأقصى {max})",
  },
  compareBarTitle: { en: "Compare products", fa: "مقایسه محصولات", ar: "مقارنة المنتجات" },
  compareBarHint: {
    en: "Select 2–4 products to compare side by side.",
    fa: "۲ تا ۴ محصول را برای مقایسه کنار هم انتخاب کنید.",
    ar: "اختر من 2 إلى 4 منتجات للمقارنة جنبًا إلى جنب.",
  },
  compareOpen: { en: "Compare now", fa: "مقایسه کن", ar: "قارن الآن" },
  compareClear: { en: "Clear", fa: "پاک کردن", ar: "مسح" },
  compareDialogTitle: { en: "Product Comparison", fa: "مقایسه محصولات", ar: "مقارنة المنتجات" },
  compareDialogDescription: {
    en: "Side-by-side attributes. Differences are highlighted.",
    fa: "ویژگی‌ها در کنار هم. تفاوت‌ها برجسته شده‌اند.",
    ar: "السمات جنبًا إلى جنب. الاختلافات مميزة.",
  },
  compareAttribute: { en: "Attribute", fa: "ویژگی", ar: "السمة" },
  compareAttrName: { en: "Name", fa: "نام", ar: "الاسم" },
  compareAttrCode: { en: "Model code", fa: "کد مدل", ar: "رمز الموديل" },
  compareAttrCategory: { en: "Category", fa: "دسته", ar: "الفئة" },
  compareAttrSeries: { en: "Series", fa: "سری", ar: "السلسلة" },
  compareAttrShort: { en: "Summary", fa: "خلاصه", ar: "ملخص" },
  compareAttrStatus: { en: "Status", fa: "وضعیت", ar: "الحالة" },
  compareAttrUpdated: { en: "Last updated", fa: "آخرین به‌روزرسانی", ar: "آخر تحديث" },
  compareEmpty: {
    en: "No products selected yet. Use “Add to Compare” on any product card.",
    fa: "هنوز محصولی انتخاب نشده است. از دکمه «افزودن به مقایسه» در کارت محصول استفاده کنید.",
    ar: "لم يتم اختيار أي منتج بعد. استخدم «أضف إلى المقارنة» على بطاقة المنتج.",
  },
  compareNotEnough: {
    en: "Select at least 2 products to compare.",
    fa: "حداقل ۲ محصول را برای مقایسه انتخاب کنید.",
    ar: "اختر منتجين على الأقل للمقارنة.",
  },
  compareViewProduct: { en: "View product", fa: "مشاهده محصول", ar: "عرض المنتج" },
  compareCount: {
    en: "{n} selected",
    fa: "{n} انتخاب‌شده",
    ar: "{n} مختار",
  },
  compareDifference: { en: "Differs", fa: "متفاوت", ar: "مختلف" },
  compareSame: { en: "Same", fa: "یکسان", ar: "متماثل" },
};

