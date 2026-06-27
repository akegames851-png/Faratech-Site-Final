// AUTO-GENERATED from /mnt/user-uploads/PRODUCTS_MASTER.txt (Phase 2A ingestion).
// Hand-edits permitted; re-run the ingestion script when the upstream changes.
// Consumed by src/lib/products.ts → applyMasterOverlay().

import type { ProductCategoryKey } from "../products";

export type MasterSpecItem = {
  key: string;
  labelEn: string;
  labelFa: string;
  valueFa: string;
};

export type MasterProduct = {
  category: ProductCategoryKey;
  slug: string;
  nameEn: string;
  seriesEn: string | null;
  status: 'published' | 'draft' | 'archived';
  fa: {
    name: string;
    model?: string;
    brand?: string;
    shortDescription: string;
    description: string;
    competitiveAdvantage: string;
    usage: string;
    audience: string;
    features: string[];
    bundled: string[];
    warrantyPeriod: string;
    warrantyConditions: string;
    afterSales: string;
  };
  specs: MasterSpecItem[];
  certifications: { name: string }[];
};

export const MASTER_PRODUCTS: MasterProduct[] = 
[
  {
    "category": "power-wheelchairs",
    "slug": "beta25",
    "nameEn": "Beta 25 Foldable Power Wheelchair",
    "seriesEn": "Foldable Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی بتا 25",
      "model": "25",
      "brand": "Beta",
      "shortDescription": "ویلچر برقی تاشو بتا 25، با دو موتور ۲۵۰ وات ساخت تایوان و کنترلر DYNAMIC / P&G.",
      "description": "بتا 25 به عنوان یک ویلچر برقی با قابلیت حمل و نقل آسان طراحی شده است. این دستگاه با بهره‌گیری از دو موتور ۲۵۰ وات تایوان و سیستم کنترلر پیشرفته DYNAMIC یا P&G، امکان حرکت ایمن در شیب‌های تا ۱۲ درصد و حمل کاربرانی با وزن تا ۹۵ کیلوگرم را فراهم می‌آورد. طراحی تاشو و قابلیت تنظیم ارتفاع زیرآرنجی و زیرپایی، آن را به گزینه‌ای ایده‌آل برای استفاده‌های روزمره و جابه‌جایی تبدیل کرده است.",
      "competitiveAdvantage": "وزن نسبتاً پایین ۴۹ کیلوگرمی، ابعاد جمع و جور (عرض ۶۰ سانتی‌متر)، و پشتیبانی رسمی ۵ ساله از قطعات به دلیل واردات مستقیم (با قابلیت تأمین تا ۱۵ سال)، آن را به محصولی مقرون‌به‌صرفه و قابل اعتماد در میان ویلچرهای برقی کلاس سبک تبدیل نموده است.",
      "usage": "مناسب برای تردد در محیط‌های مسکونی، اداری، بیمارستانی و فضاهای شهری با سطوح مسطح و شیب‌های ملایم.",
      "audience": "سالمندان، افراد دارای محدودیت حرکتی متوسط، و کاربرانی که به دنبال یک ویلچر برقی تاشو، سبک و با قابلیت حمل آسان در صندوق خودرو هستند.",
      "features": [
        "قابلیت تاشو با باتری",
        "زیر آرنجی متحرک (قابل تنظیم ارتفاع)",
        "زیرپایی متحرک (قابل تنظیم ارتفاع)",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۴۹ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۹۵ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۵ × عرض ۶۰ × ارتفاع ۹۲ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۲۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۱۸ یا ۲۲ آمپر ساعت (۲ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۸ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۳ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "delta35",
    "nameEn": "Delta 35 Foldable Power Wheelchair",
    "seriesEn": "Foldable Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی دلتا 35",
      "model": "35",
      "brand": "Delta",
      "shortDescription": "ویلچر برقی تاشو دلتا 35، با دو موتور قدرتمند ۳۵۰ وات ساخت تایوان و سیستم کنترلر DYNAMIC / P&G.",
      "description": "دلتا 35 یک مدل تاشو با توان موتوری بالاتر (۳۵۰ وات) است که برای ارائه عملکردی روان‌تر در مسیرهای متنوع طراحی شده است. با برخورداری از سیستم کنترلرهای باکیفیت DYNAMIC یا P&G، این ویلچر قابلیت حرکت ایمن در شیب‌های تا ۱۲ درصد را دارد. وزن ۵۱ کیلوگرم و ابعاد ۱۱۶×۷۶ سانتی‌متر، همراه با امکانات تنظیم ارتفاع زیرآرنجی و زیرپایی، تجربه کاربری مطلوب و استانداردهای ایمنی قابل قبولی را به کاربر ارائه می‌دهد.",
      "competitiveAdvantage": "بهره‌گیری از موتورهای پرتوان ۳۵۰ وات در کنار سیستم کنترلر DYNAMIC یا P&G، همراه با پشتیبانی رسمی و تأمین قطعات به مدت ۵ سال (با قابلیت تا ۱۵ سال) به دلیل واردات مستقیم، این محصول را برای کاربرانی که نیازمند توان حرکتی بیشتر هستند، به گزینه‌ای برتر تبدیل می‌کند.",
      "usage": "مناسب برای استفاده در محیط‌های داخلی و بیرونی، مراکز توان‌بخشی و ترددهای شهری با سطوح ناهموارتر نسبت به مدل‌های سبک‌تر.",
      "audience": "افرادی با محدودیت حرکتی که نیازمند قدرت مانور و کشش بیشتر هستند، سالمندان فعال، و بیماران با نیازهای حرکتی پیشرفته.",
      "features": [
        "قابلیت تاشو با باتری",
        "زیر آرنجی متحرک (قابل تنظیم ارتفاع)",
        "زیرپایی متحرک (قابل تنظیم ارتفاع)",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۵۱ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۹۵ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۱۶ × عرض ۷۶ × ارتفاع ۱۰۰ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۳۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۱۸ یا ۲۲ آمپر ساعت (۲ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۰ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۳ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "gamma45",
    "nameEn": "Gamma 45 - 45XL Foldable Power Wheelchair",
    "seriesEn": "Foldable Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی گاما 45 - 45XL",
      "model": "45 - 45XL",
      "brand": "Gamma",
      "shortDescription": "ویلچر برقی تاشو گاما 45-45XL، مجهز به سیستم محرکه دوگانه ۴۵۰ وات ساخت تایوان و کنترلرهای معتبر DYNAMIC / P&G، با قابلیت حمل بار تا ۱۲۰ کیلوگرم.",
      "description": "گاما 45-45XL یک ویلچر برقی تاشو با استانداردهای بالای مهندسی پزشکی است. این دستگاه با بهره‌گیری از دو موتور ۴۵۰ وات و سیستم کنترلر DYNAMIC یا P&G، توانایی حرکت در شیب‌های تا ۱۲ درصد و حمل کاربرانی با وزن تا ۱۲۰ کیلوگرم را دارا می‌باشد. سیستم باتری دوگانه ۳۰ آمپر ساعت، زمان شارژ ۴ ساعته را تضمین کرده و قابلیت جداسازی باتری، تاشوندگی، و تنظیم ارتفاع زیرآرنجی و زیرپایی، حمل‌ونقل و انبارش دستگاه را برای مراقبین و کاربران تسهیل می‌نماید.",
      "competitiveAdvantage": "استفاده از موتورهای ۴۵۰ وات ساخت تایوان با گشتاور بالا در کنار سیستم کنترلرهای معتبر جهانی (Dynamic & P&G)، ظرفیت تحمل وزن ۱۲۰ کیلوگرم (که در کلاس وزنی خود بی‌نظیر است)، و پشتیبانی ۵ ساله از قطعات به دلیل واردات مستقیم (تأمین تا ۱۵ سال)، از مهم‌ترین مزیت‌های رقابتی این محصول در بازار تجهیزات توان‌بخشی کشور است.",
      "usage": "مناسب برای استفاده در محیط‌های داخلی و خارجی، مراکز توان‌بخشی، بیمارستان‌ها، آسایشگاه‌ها، و ترددهای روزمره شهری با قابلیت حرکت در سطوح شیب‌دار.",
      "audience": "افراد با محدودیت حرکتی شدید، بیماران مبتلا به ناتوانی‌های جسمی-حرکتی، سالمندان و افرادی که نیازمند جابه‌جایی مستقل و ایمن با وزن بالا هستند.",
      "features": [
        "قابلیت تاشو و جمع‌آوری",
        "باتری قابل جداسازی (Detachable battery)",
        "زیر آرنجی قابل تنظیم ارتفاع",
        "زیرپایی متحرک و قابل تنظیم",
        "دارای کمربند ایمنی",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)",
        "کمربند ایمنی"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۵۸ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۲۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۴ × عرض ۷۰ × ارتفاع ۹۴ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۴۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۲۸ یا ۳۰ آمپر ساعت (۲ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۰ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۴ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "super-gamma",
    "nameEn": "Super Gamma Foldable Power Wheelchair",
    "seriesEn": "Foldable Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی سوپر گاما",
      "model": "Super Gamma",
      "brand": "Gamma",
      "shortDescription": "ویلچر برقی تاشو سوپر گاما، مجهز به دو موتور قدرتمند ۵۰۰ وات ساخت تایوان و سیستم کنترلر DYNAMIC / P&G، با بیشینه سرعت ۱۵ کیلومتر بر ساعت.",
      "description": "سوپر گاما یک ویلچر برقی تاشوی پیشرفته در کلاس سنگین است که با دو موتور ۵۰۰ وات و سیستم کنترلر DYNAMIC یا P&G، قدرت مانور و شتاب بالایی را ارائه می‌دهد. این دستگاه قادر است کاربرانی تا وزن ۱۲۰ کیلوگرم را به راحتی جابجا کرده و در شیب‌های تا ۱۲ درصد به صورت ایمن تردد نماید. طراحی تاشو، باتری جداشونده، امکان تنظیم زیرآرنجی و زیرپایی، همراه با سیستم روشنایی و کمربند ایمنی، استانداردهای یک ویلچر برقی مدرن و کاربردی را فراهم می‌آورد.",
      "competitiveAdvantage": "بهره‌گیری از موتورهای قدرتمند ۵۰۰ وات (ساخت تایوان) و کنترلرهای معتبر جهانی در کنار ابعاد تاشو، این محصول را به گزینه‌ای قدرتمند و در عین حال جمع‌وجور برای کاربران تبدیل کرده است. پشتیبانی ۵ ساله و تأمین قطعات تا ۱۵ سال به دلیل واردات مستقیم، نقطه اتکای این محصول در بازار تجهیزات پزشکی است.",
      "usage": "مناسب برای ترددهای طولانی‌مدت در محیط‌های شهری، مراکز توان‌بخشی و فضاهای باز با نیاز به سرعت و توان بالاتر.",
      "audience": "افراد فعال با محدودیت حرکتی، کاربرانی که نیازمند سرعت حمل‌ونقل بالاتر و ظرفیت وزنی بالا هستند.",
      "features": [
        "قابلیت تاشو و جمع‌آوری",
        "باتری قابل جداسازی",
        "زیر آرنجی و زیرپایی قابل تنظیم",
        "سیستم روشنایی",
        "کمربند ایمنی",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)",
        "کمربند ایمنی"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۶۰ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۲۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۴ × عرض ۶۱ × ارتفاع ۹۸ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۵۰۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۲۸ یا ۳۰ آمپر ساعت (۲ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۵ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۴ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "fateh-lx2",
    "nameEn": "Fateh LX2 Power Wheelchair",
    "seriesEn": "Upholstered Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی فاتح LX2",
      "model": "LX2",
      "brand": "Fateh",
      "shortDescription": "ویلچر برقی فاتح LX2 با دو موتور ۵۰۰ یا ۴۵۰ وات و سیستم تعلیق کمک‌فنر، مناسب برای مسیرهای خارجی و ناهموار.",
      "description": "فاطح LX2 یک ویلچر برقی سنگین و با دوام است که برای عبور از مسیرهای سخت و خارجی طراحی شده است. این دستگاه با بهره‌گیری از دو موتور قدرتمند ۵۰۰ یا ۴۵۰ وات ساخت تایوان، سیستم کمک‌فنر (شاک‌آبسورب)، و کنترلرهای DYNAMIC یا P&G، قدرت و نرمی حرکت را تضمین می‌کند. صندلی زاویه‌دار و قابلیت افزایش ظرفیت باتری تا ۴ عدد، آن را به انتخابی استراتژیک برای استفاده‌های سنگین تبدیل نموده است.",
      "competitiveAdvantage": "قابلیت افزایش باتری تا ۴ عدد، سیستم کمک‌فنر جاذب ضربه، صندلی زاویه‌دار، و تحمل وزن تا ۱۵۰ کیلوگرم، این مدل را از رقبا متمایز می‌کند. خدمات پس از فروش ۵ ساله و پشتیبانی قطعات (تا ۱۵ سال) به دلیل واردات مستقیم، اطمینان خریداران را جلب می‌نماید.",
      "usage": "مناسب برای محیط‌های خارج از شهر، پارک‌ها، سطوح ناهموار و استفاده‌های درمانی طولانی‌مدت در مراکز توان‌بخشی.",
      "audience": "بیماران با محدودیت حرکتی شدید، کاربران با وزن بالا و افرادی که نیازمند تردد در محیط‌های ناهموار و خارج از ساختمان هستند.",
      "features": [
        "صندلی زاویه‌دار",
        "سیستم تعلیق کمک‌فنر",
        "قابلیت افزایش تعداد باتری تا ۴ عدد",
        "زیر آرنجی و زیرپایی قابل تنظیم",
        "سیستم روشنایی",
        "کمربند ایمنی",
        "سیستم ضد واژگونی",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)",
        "کیسه خرید"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۹۸ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۶ × عرض ۶۹ × ارتفاع ۱۱۲ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۵۰۰ یا ۴۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۴۰ یا ۴۵ آمپر ساعت (۲ عدد - قابل افزایش تا ۴ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۵ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۵ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "fateh-jx2-lift",
    "nameEn": "Fateh JX2 Power Wheelchair",
    "seriesEn": "Upholstered Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی فاتح JX2",
      "model": "JX2",
      "brand": "Fateh",
      "shortDescription": "ویلچر برقی فاتح JX2، مجهز به سیستم تعلیق کمک‌فنر، صندلی و زیرآرنجی کاملاً تنظیم‌شونده با دو موتور ۵۰۰ یا ۴۵۰ وات.",
      "description": "فاطح JX2 مدلی از سری حرفه‌ای فاتح است که بر روی ارگونومی و راحتی کاربر تمرکز دارد. با بهره‌گیری از دو موتور ۵۰۰/۴۵۰ وات تایوان، کنترلرهای DYNAMIC یا P&G، و سیستم تعلیق کمک‌فنر، حرکتی نرم و قدرتمند را ارائه می‌دهد. قابلیت تنظیم ارتفاع صندلی، زیرآرنجی، و زیرپایی، شخصی‌سازی کامل را برای کاربران فراهم می‌سازد.",
      "competitiveAdvantage": "صندلی و زیرآرنجی با قابلیت تنظیم گسترده، سیستم کمک‌فنر، قابلیت حمل بار ۱۵۰ کیلوگرم و سرعت ۱۵ کیلومتر بر ساعت، همراه با ۵ سال پشتیبانی قطعات (با قابلیت ۱۵ سال)، مدل JX2 را برای مصارف سنگین و طولانی‌مدت ایده‌آل ساخته است.",
      "usage": "مناسب برای ترددهای روزمره در سطوح مختلف شهری، محیط‌های ناهموار و فضاهای باز که نیازمند راحتی کاربر و جذب ضربه هستند.",
      "audience": "سالمندان و بیماران با محدودیت حرکتی که به دنبال راحتی بالا، صندلی قابل تنظیم و قدرت مانور در محیط‌های خارج از ساختمان هستند.",
      "features": [
        "صندلی و زیرآرنجی قابل تنظیم ارتفاع",
        "زیرپایی متحرک و قابل تنظیم",
        "سیستم تعلیق کمک‌فنر",
        "سیستم روشنایی",
        "کمربند ایمنی",
        "سیستم ضد واژگونی",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)",
        "کیسه خرید"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۱۰۲ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۸ × عرض ۶۵ × ارتفاع ۱۲۲ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۵۰۰ یا ۴۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۴۰ یا ۴۵ آمپر ساعت (۲ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۵ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۵ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "fateh-luxury",
    "nameEn": "Fateh Luxury Power Wheelchair",
    "seriesEn": "Upholstered Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی فاتح لاکچری",
      "model": "Luxury",
      "brand": "Fateh",
      "shortDescription": "ویلچر برقی فاتح لاکچری با صندلی زاویه‌دار و ارگونومیک، سیستم کمک‌فنر و قابلیت افزایش باتری تا ۴ عدد.",
      "description": "فاطح لاکچری یک ویلچر برقی رده بالا با طراحی ارگونومیک و صندلی زاویه‌دار است که برای راحتی حداکثری کاربر طراحی شده است. موتورهای ۵۰۰ یا ۴۵۰ وات تایوان به همراه کنترلرهای DYNAMIC یا P&G و سیستم کمک‌فنر، حرکتی نرم و پایدار را تضمین می‌کنند. قابلیت افزایش ظرفیت باتری تا ۴ واحد، برد حرکتی بسیار بالایی را برای کاربران فراهم می‌آورد.",
      "competitiveAdvantage": "طراحی ارگونومیک و صندلی زاویه‌دار ویژه، قابلیت افزایش باتری تا ۴ عدد برای برد حرکتی طولانی، و پشتیبانی ۵ ساله از قطعات، این محصول را به یکی از کامل‌ترین گزینه‌های موجود در رده ویلچرهای برقی لاکچری کشور تبدیل کرده است.",
      "usage": "مناسب برای استفاده‌های روزمره طولانی‌مدت، گردش در محیط‌های باز و جاده‌ای، و مصارف پزشکی سطح بالا در منزل یا مراکز درمانی.",
      "audience": "کاربرانی که به دنبال حداکثر راحتی، برد حرکتی بالا و صندلی دارای قابلیت تنظیمات پیشرفته هستند.",
      "features": [
        "صندلی و زیرآرنجی زاویه‌دار و ارگونومیک",
        "زیرپایی قابل تنظیم",
        "سیستم تعلیق کمک‌فنر",
        "قابلیت افزایش تعداد باتری تا ۴ عدد",
        "سیستم روشنایی",
        "کمربند ایمنی",
        "سیستم ضد واژگونی",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)",
        "کیسه خرید"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۹۸ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۶ × عرض ۶۸ × ارتفاع ۱۲۰ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۵۰۰ یا ۴۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۴۰ یا ۴۵ آمپر ساعت (۲ عدد - قابل افزایش تا ۴ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۵ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۵ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "fateh-capitan",
    "nameEn": "Fateh Captain Power Wheelchair",
    "seriesEn": "Upholstered Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی فاتح کاپیتان",
      "model": "Captain",
      "brand": "Fateh",
      "shortDescription": "ویلچر برقی فاتح کاپیتان با بیشینه سرعت ۱۸ کیلومتر بر ساعت، موتورهای ۵۰۰/۴۵۰ وات و سیستم تعلیق کمک‌فنر کامل.",
      "description": "فاطح کاپیتان قدرتمندترین مدل سری فاتح با بیشینه سرعت ۱۸ کیلومتر بر ساعت و سیستم تعلیق کمک‌فنر است. با دو موتور ۵۰۰ یا ۴۵۰ وات و کنترلرهای DYNAMIC یا P&G، این ویلچر برای کاربرانی که نیازمند سرعت بالا و تردد در مسیرهای طولانی و چالش‌برانگیز هستند طراحی شده است. صندلی و زیرآرنجی زاویه‌دار، سیستم ضد واژگونی و قابلیت افزایش ظرفیت باتری تا ۴ عدد، ایمنی و کارایی آن را تضمین می‌کنند.",
      "competitiveAdvantage": "سرعت منحصر‌به‌فرد ۱۸ کیلومتر بر ساعت، قابلیت حمل ۱۵۰ کیلوگرم بار، و قابلیت افزایش ظرفیت باتری‌ها تا ۴ عدد، کاپیتان را به گزینه‌ای بی‌نظیر در کلاس خود تبدیل کرده است. همراهی با ۵ سال پشتیبانی رسمی قطعات (قابل تمدید تا ۱۵ سال)، ارزش این محصول را دوچندان ساخته است.",
      "usage": "مناسب برای افرادی که نیازمند جابه‌جایی سریع، ترددهای طولانی‌مدت در مناطق مختلف شهری و جاده‌ای هستند.",
      "audience": "کاربران حرفه‌ای با محدودیت حرکتی که به دنبال حداکثر سرعت، استحکام و قابلیت اطمینان در یک ویلچر برقی سنگین هستند.",
      "features": [
        "صندلی و زیرآرنجی زاویه‌دار و ارگونومیک",
        "زیرپایی قابل تنظیم",
        "سیستم تعلیق کمک‌فنر",
        "قابلیت افزایش تعداد باتری تا ۴ عدد",
        "سیستم روشنایی",
        "کمربند ایمنی",
        "سیستم ضد واژگونی",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)",
        "کیسه خرید"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۱۰۲ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۱۸ × عرض ۷۸ × ارتفاع ۱۲۲ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۵۰۰ یا ۴۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۴۰ یا ۴۵ آمپر ساعت (۲ عدد - قابل افزایش تا ۴ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۸ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۵ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "power-wheelchairs",
    "slug": "fateh-extra-new",
    "nameEn": "Fateh EXTRA Power Wheelchair",
    "seriesEn": "Upholstered Power Wheelchairs",
    "status": "published",
    "fa": {
      "name": "ویلچر برقی فاتح اکسترا",
      "model": "Extra",
      "brand": "Fateh",
      "shortDescription": "ویلچر برقی فاتح اکسترا با تحمل وزن بی‌نظیر ۲۰۰ کیلوگرم، دو موتور ۵۰۰/۴۵۰ وات و سیستم تعلیق کمک‌فنر.",
      "description": "فاطح اکسترا ویژه‌ترین مدل از سری فاتح است که با تحمل وزن ۲۰۰ کیلوگرم و دو موتور ۵۰۰ یا ۴۵۰ وات ساخت تایوان، برای سنگین‌ترین کاربران طراحی شده است. کنترلرهای DYNAMIC یا P&G، سیستم کمک‌فنر و صندلی زاویه‌دار، تجربه‌ای ایمن، بادوام و قدرتمند را برای کاربران تضمین می‌کند. قابلیت افزایش باتری تا ۴ عدد نیز برای برد حرکتی بالا در نظر گرفته شده است.",
      "competitiveAdvantage": "ظرفیت تحمل وزن ۲۰۰ کیلوگرم که در صنعت ویلچرهای برقی بسیار نادر است، همراه با موتورهای تایوانی، سیستم کمک‌فنر و امکان افزایش باتری‌ها تا ۴ عدد، اکسترا را در صدر رقابت‌های بازار قرار می‌دهد. پشتیبانی رسمی ۵ ساله و گارانتی ۱ ساله نیز قابل رقابت با برندهای خارجی است.",
      "usage": "مناسب برای استفاده‌های فوق‌سنگین، مراکز توان‌بخشی ویژه بیماران با وزن بالا، و فضاهای باز با سطوح سخت.",
      "audience": "بیماران و سالمندان با وزن بسیار بالا، افرادی که نیازمند ویلچری با دوام و استحکام فوق‌العاده برای استفاده‌های روزمره سنگین هستند.",
      "features": [
        "صندلی زاویه‌دار",
        "زیرآرنجی و زیرپایی قابل تنظیم",
        "سیستم تعلیق کمک‌فنر",
        "قابلیت افزایش تعداد باتری تا ۴ عدد",
        "سیستم روشنایی",
        "کمربند ایمنی",
        "سیستم ضد واژگونی",
        "سیستم کنترلر DYNAMIC یا P&G"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)",
        "کیسه خرید"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۱۰۵ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۲۰۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۸ × عرض ۷۰ × ارتفاع ۱۲۰ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "دو موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۲ × ۵۰۰ یا ۴۵۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۴۰ یا ۴۵ آمپر ساعت (۲ عدد - قابل افزایش تا ۴ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۵ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۵ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک (قابل سفارشی‌سازی طبق رنگ دلخواه مشتری)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "mobility-scooters",
    "slug": "m150-4wheel",
    "nameEn": "Mobility Scooter M150",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "اسکوتر الکترونیکی M150",
      "model": "M150",
      "brand": "Mobility Scooter",
      "shortDescription": "اسکوتر برقی M150 با یک موتور ۵۰۰ وات، دارای سیستم تعلیق، آینه بغل و قابلیت حمل بار تا ۱۵۰ کیلوگرم.",
      "description": "اسکوتر M150 یک وسیله نقلیه شخصی برقی با قابلیت جابه‌جایی آسان در فضاهای داخلی و خارجی است. با برخورداری از یک موتور ۵۰۰ وات تایوان، سیستم تعلیق کمک‌فنر، فرمان کنترل‌شونده و آینه‌های بغل، تجربه رانندگی ایمن و راحتی را برای کاربران فراهم می‌آورد. ظرفیت بالای باتری (۴۵ آمپر ساعت) و تحمل وزن ۱۵۰ کیلوگرم، آن را به گزینه‌ای برای سفرهای روزمره طولانی تبدیل کرده است.",
      "competitiveAdvantage": "طراحی منحصربه‌فرد اسکوتر با آینه بغل، سبد خرید و سیستم تعلیق پیشرفته، همراه با موتور پرتوان ۵۰۰ وات و پشتیبانی ۵ ساله قطعات، جایگاه آن را در میان اسکوترهای برقی تثبیت کرده است.",
      "usage": "مناسب برای سالمندان جهت خرید روزمره، جابه‌جایی در محوطه‌های باز و بسته، بیمارستان‌ها و فضاهای تفریحی.",
      "audience": "افراد با محدودیت حرکتی که به دنبال یک وسیله نقلیه برقی مستقل، با ظرفیت بار بالا و ایمن هستند.",
      "features": [
        "آینه بغل",
        "سیستم تعلیق کمک‌فنر",
        "قابلیت تنظیم ارتفاع زیرآرنجی",
        "سیستم روشنایی",
        "دارای سبد خرید (Shopping basket)",
        "صندلی ارگونومیک"
      ],
      "bundled": [
        "شارژر مخصوص",
        "باتری (۲ عدد)"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۹۰ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۲۶ × عرض ۶۴ × ارتفاع ۹۰ سانتی‌متر"
      },
      {
        "key": "motor_type",
        "labelEn": "Motor Type",
        "labelFa": "نوع موتور",
        "valueFa": "تک موتور DC"
      },
      {
        "key": "motor_power",
        "labelEn": "Motor Power",
        "labelFa": "قدرت موتور",
        "valueFa": "۱ × ۵۰۰ وات (ساخت تایوان)"
      },
      {
        "key": "voltage",
        "labelEn": "Voltage",
        "labelFa": "ولتاژ",
        "valueFa": "۱۲ ولت"
      },
      {
        "key": "battery_capacity",
        "labelEn": "Battery Capacity",
        "labelFa": "ظرفیت باتری",
        "valueFa": "۴۰ یا ۴۵ آمپر ساعت (۲ عدد)"
      },
      {
        "key": "speed",
        "labelEn": "Speed",
        "labelFa": "سرعت",
        "valueFa": "۱۲ کیلومتر بر ساعت (قابل تنظیم)"
      },
      {
        "key": "slope",
        "labelEn": "Slope Angle",
        "labelFa": "زاویه شیب حرکت",
        "valueFa": "۱۲ درصد"
      },
      {
        "key": "charge_time",
        "labelEn": "Charge Time",
        "labelFa": "زمان شارژ مجدد",
        "valueFa": "۵ ساعت"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "patient-lifts",
    "slug": "l160",
    "nameEn": "Electric Patient Lift L160",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "بالابر (لیفت) الکترونیکی بیمار L160",
      "model": "L160",
      "brand": "Electric Patient Lift",
      "shortDescription": "لیفت بیمار الکترونیکی L160، مجهز به اکچویتور ۶۰۰۰ نیوتن Linak و قابلیت تحمل وزن ۱۲۰ کیلوگرم.",
      "description": "بالابر بیمار مدل L160 با اکچویتور قدرتمند ۶۰۰۰ نیوتن برند Linak و ابعاد پایه ۶۸×۱۱۹ سانتی‌متر، برای انتقال ایمن و کم‌خطر بیماران طراحی شده است. ساختار تاشو برای حمل‌ونقل، همراه با سیستم کنترل پدالی و باتری‌های ۲×۹ آمپر ساعت، یک راه‌حل تخصصی و استاندارد برای مراکز درمانی و مراقبت‌های خانگی ارائه می‌دهد.",
      "competitiveAdvantage": "استفاده از اکچویتور Linak با استاندارد جهانی، قابلیت تاشوندگی برای جابه‌جایی آسان، و پشتیبانی ۵ ساله قطعات، این محصول را به انتخاب اول مراکز درمانی و توان‌بخشی تبدیل کرده است.",
      "usage": "مناسب برای انتقال بیماران از تخت به ویلچر، حمام و توالت در بیمارستان‌ها، آسایشگاه‌ها و منازل.",
      "audience": "بیماران بستری، سالمندان ناتوان و مراکز مراقبت‌های پزشکی که نیازمند جابه‌جایی ایمن و بدون فشار فیزیکی روی کادر درمان هستند.",
      "features": [
        "پدال کنترل زاویه‌دار (Angular Foot Pedal)",
        "قابلیت تاشوندگی برای حمل‌ونقل",
        "عملکرد روان اکچویتور Linak"
      ],
      "bundled": [
        "شارژر باتری",
        "جک و اسلینگ (زیرپایی و دستگیره تخصصی بیمار)"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "actuator_type",
        "labelEn": "Actuator Type",
        "labelFa": "نوع اکچویتور",
        "valueFa": "۶۰۰۰ نیوتن (Linak)"
      },
      {
        "key": "battery",
        "labelEn": "Battery",
        "labelFa": "باتری",
        "valueFa": "۲×۲/۹ آمپر ساعت"
      },
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۵۰ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۲۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Base Dimensions",
        "labelFa": "ابعاد پایه",
        "valueFa": "طول ۱۱۹ × عرض ۶۸ سانتی‌متر"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "patient-lifts",
    "slug": "l180",
    "nameEn": "Electric Patient Lift L180",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "بالابر (لیفت) الکترونیکی بیمار L180",
      "model": "L180",
      "brand": "Electric Patient Lift",
      "shortDescription": "لیفت بیمار الکترونیکی L180، مجهز به اکچویتور ۶۰۰۰ نیوتن Linak و قابلیت تحمل وزن ۱۵۰ کیلوگرم.",
      "description": "بالابر بیمار مدل L180 با قابلیت تحمل ۱۵۰ کیلوگرم وزن، به کاربران امکان جابجایی بیماران سنگین‌وزن را با استفاده از اکچویتور ۶۰۰۰ نیوتن برند Linak می‌دهد. سیستم پدال کنترل زاویه‌دار و قابلیت تاشوندگی، آن را به یکی از تجهیزات حیاتی و ضروری در کلینیک‌ها و مراکز مراقبت‌های ویژه تبدیل کرده است.",
      "competitiveAdvantage": "ظرفیت ۱۵۰ کیلوگرمی (نسبت به مدل L160)، اکچویتور Linak، قابلیت تاشو، و پشتیبانی ۵ ساله قطعات، L180 را به گزینه‌ای ایده‌آل برای محیط‌های با تردد و وزن بیمار بالا تبدیل می‌کند.",
      "usage": "مناسب برای بیمارستان‌ها، مراکز توان‌بخشی و منازل جهت جابجایی بیماران با وزن بالا یا ناتوانی شدید.",
      "audience": "بیماران با محدودیت حرکتی کامل و وزن بالا، کادر درمان و مراقبین بیمار.",
      "features": [
        "پدال کنترل زاویه‌دار (Angular Foot Pedal)",
        "قابلیت تاشوندگی برای حمل‌ونقل",
        "عملکرد روان اکچویتور Linak"
      ],
      "bundled": [
        "شارژر باتری",
        "جک و اسلینگ (زیرپایی و دستگیره تخصصی بیمار)"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "actuator_type",
        "labelEn": "Actuator Type",
        "labelFa": "نوع اکچویتور",
        "valueFa": "۶۰۰۰ نیوتن (Linak)"
      },
      {
        "key": "battery",
        "labelEn": "Battery",
        "labelFa": "باتری",
        "valueFa": "۲×۲/۹ آمپر ساعت"
      },
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۵۲ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Base Dimensions",
        "labelFa": "ابعاد پایه",
        "valueFa": "طول ۱۱۹ × عرض ۶۸ سانتی‌متر"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "patient-lifts",
    "slug": "l280",
    "nameEn": "Electric Patient Lift L280",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "بالابر (لیفت) الکترونیکی بیمار L280",
      "model": "L280",
      "brand": "Electric Patient Lift",
      "shortDescription": "لیفت بیمار الکترونیکی L280 با پایه کنترل زاویه‌دار الکتریکی و اکچویتور ۶۰۰۰ نیوتن Linak، مناسب برای بیماران سنگین‌وزن.",
      "description": "مدل L280 بالاترین سطح تکنولوژی را در لیفت‌های بیمار ارائه می‌دهد و دارای پایه کنترل زاویه‌دار الکتریکی (به جای مکانیکی/پدالی) و اکچویتور ۶۰۰۰ نیوتن Linak است. با تحمل وزن ۱۵۰ کیلوگرم، این دستگاه برای بالاترین استانداردهای ایمنی در بیمارستان‌ها و مراکز مراقبت ویژه طراحی شده است.",
      "competitiveAdvantage": "برخورداری از پایه کنترل زاویه‌دار برقی که کار جابجایی را به‌مراتب ساده‌تر و اتوماتیک‌تر می‌کند، همراه با قابلیت تاشو و تحمل وزن ۱۵۰ کیلوگرم، آن را در رده پیشرفته‌ترین لیفت‌های بیمار قرار می‌دهد.",
      "usage": "مناسب برای مراکز درمانی درجه یک، اتاق‌های عمل، بخش‌های ویژه و منازل بزرگ با نیاز به استانداردهای بالای مراقبت از بیمار.",
      "audience": "بیماران با ناتوانی حرکتی شدید و سنگین‌وزن، و پرستاران که نیازمند ابزاری قدرتمند و کم‌دردسر برای جابجایی بیمار هستند.",
      "features": [
        "پایه کنترل زاویه‌دار الکتریکی (Electrical Angular Foot)",
        "قابلیت تاشوندگی برای حمل‌ونقل",
        "عملکرد روان اکچویتور Linak"
      ],
      "bundled": [
        "شارژر باتری",
        "جک و اسلینگ (زیرپایی و دستگیره تخصصی بیمار)"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "actuator_type",
        "labelEn": "Actuator Type",
        "labelFa": "نوع اکچویتور",
        "valueFa": "۶۰۰۰ نیوتن (Linak)"
      },
      {
        "key": "battery",
        "labelEn": "Battery",
        "labelFa": "باتری",
        "valueFa": "۲×۲/۹ آمپر ساعت"
      },
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۵۲ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Base Dimensions",
        "labelFa": "ابعاد پایه",
        "valueFa": "طول ۱۱۹ × عرض ۶۸ سانتی‌متر"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "manual-wheelchairs",
    "slug": "alpha850-al",
    "nameEn": "Alpha 850 Manual Foldable Wheelchair",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "ویلچر دستی تاشو آلفا 850",
      "model": "850",
      "brand": "Alpha",
      "shortDescription": "ویلچر دستی تاشو آلفا 850، با وزن ۱۹ کیلوگرم، شاسی فولاد و آلومینیوم و رنگ الکترواستاتیک پودری.",
      "description": "آلفا 850 یک ویلچر دستی تاشو با طراحی مهندسی‌شده برای حمل‌ونقل آسان و دوام بالا است. ساختار شاسی از ترکیب فولاد و آلومینیوم و رنگ الکترواستاتیک پودری، استحکام و ماندگاری آن را تضمین کرده و با تحمل وزن ۱۵۰ کیلوگرم، گزینه‌ای استاندارد برای مصارف پزشکی، بیمارستانی و خانگی محسوب می‌شود.",
      "competitiveAdvantage": "وزن بسیار سبک ۱۹ کیلوگرم در کنار استحکام فولاد و آلومینیوم، پشتیبانی ۵ ساله قطعات، و امکان تاشو با کمربند ضربدری (Double Cross Over)، آن را برای استفاده روزمره و مسافرت بسیار جذاب کرده است.",
      "usage": "مناسب برای استفاده در منزل، بیمارستان‌ها، مراکز درمانی و حمل‌ونقل روزمره.",
      "audience": "سالمندان و بیماران با محدودیت حرکتی متوسط، کادر درمان برای جابجایی بیماران در بیمارستان.",
      "features": [
        "قابلیت تاشوندگی",
        "زیرآرنجی متحرک و قابل تنظیم",
        "زیرپایی متحرک",
        "پشتی ثابت",
        "کمربند ضربدری (Double Cross Over)",
        "رنگ الکترواستاتیک پودری مقاوم"
      ],
      "bundled": [
        "کمربند ایمنی"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۱۹ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۰ × عرض ۶۶ × ارتفاع ۸۸ سانتی‌متر"
      },
      {
        "key": "frame_material",
        "labelEn": "Frame Material",
        "labelFa": "جنس فریم",
        "valueFa": "فولاد و آلومینیوم"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک پودری"
      },
      {
        "key": "rear_wheel",
        "labelEn": "Rear Wheel",
        "labelFa": "چرخ عقب",
        "valueFa": "۲۴ اینچ (توپر)"
      },
      {
        "key": "front_wheel",
        "labelEn": "Front Wheel",
        "labelFa": "چرخ جلو",
        "valueFa": "۶ اینچ (توپر)"
      },
      {
        "key": "seat_size",
        "labelEn": "Seat Size",
        "labelFa": "سایز صندلی",
        "valueFa": "۴۲ سانتی‌متر"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "manual-wheelchairs",
    "slug": "alpha851-al",
    "nameEn": "Alpha 851 Manual Foldable Wheelchair",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "ویلچر دستی تاشو آلفا 851",
      "model": "851",
      "brand": "Alpha",
      "shortDescription": "ویلچر دستی تاشو آلفا 851، با وزن ۲۰ کیلوگرم، دارای شاسی فولاد و آلومینیوم و قابلیت تحمل وزن ۱۵۰ کیلوگرم.",
      "description": "آلفا 851 با ترکیب شاسی فولاد و آلومینیوم، وزن ۲۰ کیلوگرم و قابلیت تحمل ۱۵۰ کیلوگرم، محصولی پایدار و مقاوم برای استفاده‌های روزمره است. رنگ پودری الکترواستاتیک، دوام آن را در برابر خوردگی و سایش افزایش داده و مناسب برای بیمارستان‌ها، مراکز درمانی و منازل است.",
      "competitiveAdvantage": "کیفیت ساخت بالا با شاسی ترکیبی و رنگ الکترواستاتیک، ابعاد ۱۰۰×۶۶ سانتی‌متر و وزن مناسب، همراه با پشتیبانی قطعات ۵ ساله، ارزش خرید بالایی را برای کاربران فراهم می‌آورد.",
      "usage": "مناسب برای استفاده در محیط‌های مراقبت‌های سلامتی، منازل، و جابجایی روزانه.",
      "audience": "سالمندان، بیماران با محدودیت حرکتی و مراکز درمانی که نیازمند ویلچری با دوام و استاندارد هستند.",
      "features": [
        "قابلیت تاشوندگی",
        "زیرآرنجی متحرک و قابل تنظیم",
        "زیرپایی متحرک",
        "پشتی ثابت",
        "کمربند ضربدری (Double Cross Over)",
        "رنگ الکترواستاتیک پودری مقاوم"
      ],
      "bundled": [
        "کمربند ایمنی"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۲۰ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۰ × عرض ۶۶ × ارتفاع ۸۸ سانتی‌متر"
      },
      {
        "key": "frame_material",
        "labelEn": "Frame Material",
        "labelFa": "جنس فریم",
        "valueFa": "فولاد و آلومینیوم"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک پودری"
      },
      {
        "key": "rear_wheel",
        "labelEn": "Rear Wheel",
        "labelFa": "چرخ عقب",
        "valueFa": "۲۴ اینچ (توپر)"
      },
      {
        "key": "front_wheel",
        "labelEn": "Front Wheel",
        "labelFa": "چرخ جلو",
        "valueFa": "۶ اینچ (توپر)"
      },
      {
        "key": "seat_size",
        "labelEn": "Seat Size",
        "labelFa": "سایز صندلی",
        "valueFa": "۴۲ سانتی‌متر"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "manual-wheelchairs",
    "slug": "alpha950",
    "nameEn": "Alpha 950 Manual Foldable Wheelchair",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "ویلچر دستی تاشو آلفا 950",
      "model": "950",
      "brand": "Alpha",
      "shortDescription": "ویلچر دستی تاشو آلفا 950، با صندلی ۵۲ سانتی‌متری و وزن ۲۱ کیلوگرم، شاسی فولاد و آلومینیوم.",
      "description": "آلفا 950 به عنوان مدل بزرگ‌تر و با صندلی ۵۲ سانتی‌متری، برای کاربرانی با ابعاد بدنی بزرگتر طراحی شده است. وزن ۲۱ کیلوگرمی آن با ساختار مقاوم فولاد و آلومینیوم، تحمل وزن ۱۵۰ کیلوگرم را فراهم کرده و رنگ الکترواستاتیک پودری آن مقاومت بالایی در برابر شرایط محیطی دارد.",
      "competitiveAdvantage": "سایز بزرگ‌تر صندلی (۵۲ سانتی‌متر) نسبت به مدل‌های ۸۵۰ و ۸۵۱، انعطاف‌پذیری و راحتی بیشتری برای کاربران با ابعاد بدنی درشت‌تر ایجاد می‌کند. همراه با ۵ سال پشتیبانی قطعات، انتخابی هوشمندانه است.",
      "usage": "مناسب برای استفاده در منازل، بیمارستان‌ها و مراکز توان‌بخشی برای افراد با شرایط فیزیکی مختلف.",
      "audience": "سالمندان و بیماران با ابعاد بدنی بزرگتر که نیازمند صندلی ویلچر عریض‌تر برای راحتی و جابجایی بهتر هستند.",
      "features": [
        "صندلی ۵۲ سانتی‌متری (بزرگ‌تر از سری ۸۵۰)",
        "قابلیت تاشوندگی",
        "زیرآرنجی متحرک و قابل تنظیم",
        "زیرپایی متحرک",
        "پشتی ثابت",
        "کمربند ضربدری (Double Cross Over)",
        "رنگ الکترواستاتیک پودری مقاوم"
      ],
      "bundled": [
        "کمربند ایمنی"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۲۱ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۱۰۰ × عرض ۷۰ × ارتفاع ۸۸ سانتی‌متر"
      },
      {
        "key": "frame_material",
        "labelEn": "Frame Material",
        "labelFa": "جنس فریم",
        "valueFa": "فولاد و آلومینیوم"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک پودری"
      },
      {
        "key": "rear_wheel",
        "labelEn": "Rear Wheel",
        "labelFa": "چرخ عقب",
        "valueFa": "۲۴ اینچ (توپر)"
      },
      {
        "key": "front_wheel",
        "labelEn": "Front Wheel",
        "labelFa": "چرخ جلو",
        "valueFa": "۸ اینچ (توپر)"
      },
      {
        "key": "seat_size",
        "labelEn": "Seat Size",
        "labelFa": "سایز صندلی",
        "valueFa": "۵۲ سانتی‌متر"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "manual-wheelchairs",
    "slug": "alpha750",
    "nameEn": "Alpha 750 Manual Foldable Wheelchair",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "ویلچر دستی تاشو آلفا 750",
      "model": "750",
      "brand": "Alpha",
      "shortDescription": "ویلچر دستی تاشو آلفا 750، فوق‌سبک با وزن ۱۷ کیلوگرم، شاسی فولاد و آلومینیوم و چرخ‌های ۱۲ اینچ.",
      "description": "آلفا 750 یک ویلچر دستی فوق‌سبک و ایده‌آل برای کاربرانی است که به دنبال حمل‌ونقل آسان هستند. با وزن تنها ۱۷ کیلوگرم و شاسی ترکیبی فولاد و آلومینیوم، دوام بالایی دارد. چرخ‌های ۱۲ اینچ توپر جلو و عقب، آن را برای جابجایی در فضاهای مختلف بسیار کاربردی کرده و رنگ پودری الکترواستاتیک نیز مقاومت بالایی در برابر خط و خش ایجاد می‌کند.",
      "competitiveAdvantage": "وزن فوق‌سبک ۱۷ کیلوگرم، ابعاد کوچک ۹۷×۵۶ سانتی‌متر، قابلیت تنظیم ارتفاع صندلی و زیرپایی، و بهره‌مندی از کمربند ضربدری، آلفا ۷۵۰ را به بهترین انتخاب برای مسافرت و استفاده‌های روزمره تبدیل کرده است.",
      "usage": "مناسب برای جابجایی در فضاهای کوچک، مسافرت، حمل با خودرو و استفاده روزانه در خانه.",
      "audience": "سالمندان، افراد کم‌توان و بیمارانی که نیاز به یک ویلچر بسیار سبک برای حمل‌ونقل روزانه یا سفر دارند.",
      "features": [
        "قابلیت تاشوندگی",
        "زیرآرنجی متحرک و قابل تنظیم",
        "زیرپایی متحرک و قابل تنظیم ارتفاع صندلی",
        "کمربند ضربدری (Double Cross Over)",
        "رنگ الکترواستاتیک پودری مقاوم"
      ],
      "bundled": [
        "کمربند ایمنی"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن",
        "valueFa": "۱۷ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "dimensions",
        "labelEn": "Dimensions",
        "labelFa": "ابعاد دستگاه",
        "valueFa": "طول ۹۷ × عرض ۵۶ × ارتفاع ۸۹ سانتی‌متر"
      },
      {
        "key": "frame_material",
        "labelEn": "Frame Material",
        "labelFa": "جنس فریم",
        "valueFa": "فولاد و آلومینیوم"
      },
      {
        "key": "finish",
        "labelEn": "Finish",
        "labelFa": "جنس رنگ",
        "valueFa": "الکترواستاتیک پودری"
      },
      {
        "key": "wheel_type",
        "labelEn": "Wheel Type",
        "labelFa": "نوع چرخ",
        "valueFa": "چرخ‌های جلو و عقب ۱۲ اینچ (توپر)"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  },
  {
    "category": "patient-lifts",
    "slug": "personal-sit-to-stand",
    "nameEn": "Personal Lift Electronic Lift",
    "seriesEn": null,
    "status": "published",
    "fa": {
      "name": "بالابر (لیفت) شخصی الکترونیکی",
      "model": "Personal Lift",
      "brand": "Personal Lift",
      "shortDescription": "بالابر شخصی (لیفت) الکترونیکی با اکچویتور ۶۰۰۰ نیوتن Linak و منبع تغذیه ۲۲۰ ولت، مناسب برای جابجایی فردی.",
      "description": "لیفت شخصی یک دستگاه بالابر فوق‌سبک با وزن ۱۵ کیلوگرم است که به کاربران امکان جابجایی مستقل را فراهم می‌کند. مجهز به اکچویتور ۶۰۰۰ نیوتن برند Linak و دارای قابلیت جابجایی کاربر (User Displacement)، این لیفت برای استفاده در منازل، مراکز مراقبتی و آسایشگاه‌ها ایده‌آل می‌باشد.",
      "competitiveAdvantage": "وزن بسیار سبک ۱۵ کیلوگرمی، قابلیت استفاده با برق شهر ۲۲۰ ولت، و پشتیبانی ۵ ساله قطعات، آن را به گزینه‌ای عملی، کم‌هزینه و کارآمد برای مراقبت از بیماران در خانه تبدیل کرده است.",
      "usage": "مناسب برای جابجایی یک فرد از ویلچر به تخت یا صندلی و بالعکس در فضاهای داخلی بیمارستان‌ها و منازل.",
      "audience": "پرستاران، مراقبین بیمار، و بیمارانی که نیازمند کمک برای جابجایی در محیط داخلی خود هستند.",
      "features": [
        "جابجایی کاربر توسط خود فرد (User Displacement)",
        "قابلیت اضافه شدن پد دسترسی پشتی قابل جداسازی (Detachable backrest access pad)",
        "طراحی مناسب برای محیط‌های داخلی"
      ],
      "bundled": [
        "کابل برق ۲۲۰ ولت",
        "پد و اسلینگ مخصوص جابجایی"
      ],
      "warrantyPeriod": "۱ سال",
      "warrantyConditions": "دستگاه مشمول گارانتی می‌شود در صورتی که دچار سانحه، تصادف، یا آسیب فیزیکی ناشی از استفاده نادرست توسط مشتری نشده باشد (خرابی ناشی از استفاده غلط مشمول گارانتی نمی‌شود).",
      "afterSales": "ارائه خدمات، تعمیرات و پشتیبانی قطعات به مدت ۵ سال رسمی (به دلیل واردات مستقیم، تأمین قطعات تا ۱۰ الی ۱۵ سال نیز توسط مجموعه امکان‌پذیر است)."
    },
    "specs": [
      {
        "key": "actuator_type",
        "labelEn": "Actuator Type",
        "labelFa": "نوع اکچویتور",
        "valueFa": "۶۰۰۰ نیوتن (Linak)"
      },
      {
        "key": "power_source",
        "labelEn": "Power Source",
        "labelFa": "منبع تغذیه",
        "valueFa": "۲۲۰ ولت"
      },
      {
        "key": "weight",
        "labelEn": "Weight",
        "labelFa": "وزن دستگاه",
        "valueFa": "۱۵ کیلوگرم"
      },
      {
        "key": "capacity",
        "labelEn": "Weight Capacity",
        "labelFa": "تحمل وزن",
        "valueFa": "۱۵۰ کیلوگرم"
      },
      {
        "key": "standards",
        "labelEn": "Standards",
        "labelFa": "استانداردها",
        "valueFa": "ISO 13485"
      }
    ],
    "certifications": [
      {
        "name": "ISO 13485"
      }
    ]
  }
]
;

export const MASTER_BY_KEY = new Map<string, MasterProduct>(
  MASTER_PRODUCTS.map((m) => [`${m.category}/${m.slug}`, m]),
);
