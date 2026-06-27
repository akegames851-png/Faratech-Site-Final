import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Play, Share2, Loader2, Check, AlertCircle } from "lucide-react";
import { type Lang, T, t } from "@/lib/i18n";
import { listVisibleCategories } from "@/lib/products";
import { COMPANY_PROFILE } from "@/lib/data/company";
import { newsletterSchema, submitNewsletter } from "@/lib/lead-capture";
import { DirArrow } from "@/components/faratech/dir-icon";

const PHONE = COMPANY_PROFILE.contact.phoneNumbers.join(" / ");
const LOGO_SRC = "/logo.png";
const certBadges = [
  ...COMPANY_PROFILE.certificates.standards,
  "CE",
  "FDA",
  "TÜV",
  "EN 12183",
  "EN 12184",
];

type NewsletterStatus = "idle" | "submitting" | "success" | "error";

export function Footer({ lang }: { lang: Lang }) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [error, setError] = useState<string | null>(null);


  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setError(t(T.validation_email, lang));
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      await submitNewsletter(parsed.data, hp);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError(t(T.submitError, lang));
    }
  };

  return (
    <footer className="bg-[var(--brand-navy)] text-white relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-red)]/60 to-transparent" />

      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-heading text-xl font-bold mb-1">{t(T.newsletter, lang)}</h3>
            <p className="text-sm text-white/55">{t(T.newsletterSub, lang)}</p>
          </div>
          <form className="flex flex-col gap-2 w-full min-w-0" onSubmit={onSubscribe} noValidate aria-busy={status === "submitting"}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full min-w-0">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                placeholder={t(T.emailPlaceholder, lang)}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "newsletter-err" : status === "success" ? "newsletter-ok" : undefined}
                disabled={status === "submitting"}
                className={`flex-1 min-w-0 bg-white/10 border rounded-md px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/40 disabled:opacity-60 ${status === "error" ? "border-red-400/70" : "border-white/15"}`}
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="shrink-0 bg-[var(--brand-red)] hover:bg-[var(--brand-red-dark)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {t(T.submitting, lang)}
                  </>
                ) : (
                  <>
                    {t(T.subscribe, lang)}
                    <DirArrow lang={lang} size={14} />
                  </>
                )}
              </button>
            </div>
            {status === "success" && (
              <p id="newsletter-ok" role="status" className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
                <Check size={13} /> {t(T.newsletterSuccess, lang)}
              </p>
            )}
            {status === "error" && error && (
              <p id="newsletter-err" role="alert" className="inline-flex items-center gap-1.5 text-xs text-red-300">
                <AlertCircle size={13} /> {error}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Link to={`/${lang}`} className="inline-flex items-center gap-3 mb-6" aria-label="FARATECH home">
              <img
                src={LOGO_SRC}
                alt="FARATECH"
                className="h-14 w-auto object-contain"
                decoding="async"
              />
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-white text-lg tracking-widest uppercase">FARATECH</span>
                <span className="text-[9px] text-white/40 tracking-[0.2em] uppercase">Mobility Systems</span>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">{t(T.heroSub, lang)}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {certBadges.map((b) => (
                <span key={b} className="text-[10px] font-semibold px-2.5 py-1 border border-white/15 rounded text-white/50 tracking-wide">{b}</span>
              ))}
            </div>
            <div className="flex gap-3">
              {[ExternalLink, Play, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-white/15 rounded-md flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
            <div className="mt-6 text-xs text-white/50" dir="ltr">{PHONE}</div>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-5">{t(T.products, lang)}</h4>
            <ul className="space-y-3">
              {listVisibleCategories().map((c) => (
                <li key={c.key}>
                  <Link to={`/${lang}/products/${c.key}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {c.title[lang]}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={`/${lang}/spare-parts`} className="text-sm text-white/60 hover:text-white transition-colors">
                  {t(T.spareParts, lang)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-5">{t(T.engineering, lang)}</h4>
            <ul className="space-y-3">
              {[t(T.fnMaterials, lang), t(T.fnManufacturing, lang), t(T.fnCertifications, lang), t(T.fnSustainability, lang)].map((l) => (
                <li key={l}><a href={`/${lang}#engineering`} className="text-sm text-white/60 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-5">{t(T.solutions, lang)}</h4>
            <ul className="space-y-3">
              {[t(T.fnHospitals, lang), t(T.fnRehab, lang), t(T.fnHomecare, lang), t(T.fnSport, lang)].map((l) => (
                <li key={l}><a href={`/${lang}#solutions`} className="text-sm text-white/60 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-5">{t(T.contact, lang)}</h4>
            <ul className="space-y-3">
              <li><a href={`/${lang}#contact`} className="text-sm text-white/60 hover:text-white transition-colors">{t(T.findDistributor, lang)}</a></li>
              <li><a href={`/${lang}#contact`} className="text-sm text-white/60 hover:text-white transition-colors">{t(T.requestQuote, lang)}</a></li>
              <li><a href={`/${lang}#contact`} className="text-sm text-white/60 hover:text-white transition-colors">{t(T.about, lang)}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} FARATECH. {t(T.rights, lang)}</p>
          <div className="flex gap-6">
            {[t(T.fnPrivacy, lang), t(T.fnTerms, lang), t(T.fnImprint, lang)].map((l) => (
              <a key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
