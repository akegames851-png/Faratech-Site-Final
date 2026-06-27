import { useState } from "react";
import { CheckCircle2, Mail, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";
import { type Lang, T, t } from "@/lib/i18n";
import { contactSchema, submitContact, type ContactInput } from "@/lib/lead-capture";

const PHONE = "021-7751 6927-28";

type Status = "idle" | "submitting" | "success" | "error";

export function CTA({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [form, setForm] = useState<ContactInput>({ name: "", email: "", organization: "", message: "" });
  const [hp, setHp] = useState("");


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        // issue.message maps to T[validation_*] keys
        const dict = (T as Record<string, Partial<Record<Lang, string>>>)[issue.message];
        fieldErrors[key] = dict ? t(dict, lang) : issue.message;
      }
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      await submitContact(parsed.data, hp);
      setStatus("success");
    } catch {
      setStatus("error");
      setServerError(t(T.submitError, lang));
    }
  };

  const reset = () => {
    setStatus("idle");
    setForm({ name: "", email: "", organization: "", message: "" });
    setErrors({});
    setServerError(null);
  };

  const inputBase = "w-full border rounded-md px-4 py-3 text-sm focus:outline-none transition-colors";
  const inputClass = (k: keyof ContactInput) =>
    `${inputBase} ${errors[k] ? "border-red-400 focus:border-red-500" : "border-input focus:border-[var(--brand-navy)]"}`;

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[var(--brand-red)]" />
            <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">{t(T.ctaEyebrow, lang)}</span>
            <div className="w-8 h-px bg-[var(--brand-red)]" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--brand-navy)] mb-6 text-balance">{t(T.ctaTitle, lang)}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t(T.ctaSub, lang)}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-[var(--brand-navy)] rounded-2xl p-8 text-white">
              <h3 className="font-heading text-lg font-bold mb-6">{t(T.getInTouch, lang)}</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[var(--brand-red)] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/50 mb-1">{t(T.intlSales, lang)}</div>
                    <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors" dir="ltr">{PHONE}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[var(--brand-red)] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/50 mb-1">{t(T.email, lang)}</div>
                    <a href="mailto:info@faratech.com" className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors">info@faratech.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[var(--brand-red)] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/50 mb-1">{t(T.hq, lang)}</div>
                    <address className="text-sm font-medium not-italic leading-relaxed whitespace-pre-line">{t(T.hqAddress, lang)}</address>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-8">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16" role="status" aria-live="polite">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[var(--brand-navy)] mb-3">{t(T.thankYou, lang)}</h3>
                <p className="text-sm text-muted-foreground max-w-sm">{t(T.contactSuccessBody, lang)}</p>
                <button onClick={reset} className="mt-6 text-sm font-medium text-[var(--brand-red)] hover:underline">{t(T.sendAnother, lang)}</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate aria-busy={status === "submitting"}>
                <h3 className="font-heading text-xl font-bold text-[var(--brand-navy)]">{t(T.requestQuote, lang)}</h3>
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      placeholder={t(T.formName, lang)}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "err-name" : undefined}
                    />
                    {errors.name && <p id="err-name" className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      placeholder={t(T.formEmail, lang)}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                    />
                    {errors.email && <p id="err-email" className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <input
                    type="text"
                    autoComplete="organization"
                    placeholder={t(T.formOrg, lang)}
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className={`md:col-span-2 ${inputClass("organization")}`}
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={5}
                    placeholder={t(T.formMessage, lang)}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={inputClass("message")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "err-message" : undefined}
                  />
                  {errors.message && <p id="err-message" className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>
                {status === "error" && serverError && (
                  <div role="alert" className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center gap-2 bg-[var(--brand-red)] hover:bg-[var(--brand-red-dark)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      {t(T.submitting, lang)}
                    </>
                  ) : (
                    t(T.requestQuote, lang)
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
