"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ProjectContent } from "@/types/project";
import { isValidEgyptPhone, normalizePhone } from "@/lib/validation";
import { fadeInUp, noMotion } from "@/lib/motion";
import { isAlivaLandingSlug } from "@/lib/aliva-landing";
import { ALIVA_UNIT_FORM_OPTIONS } from "@/lib/aliva-units";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdapyovz";

const selectBaseClasses =
  "w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none";

interface LeadFormSectionProps {
  project: ProjectContent;
}

export function LeadFormSection({ project }: LeadFormSectionProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [unitType, setUnitType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!phone.trim()) next.phone = "رقم الهاتف مطلوب";
    else if (!isValidEgyptPhone(phone)) {
      next.phone = "رقم هاتف صحيح مطلوب (مصر، السعودية، البحرين، الإمارات، قطر)";
    }
    if (whatsapp.trim() && !isValidEgyptPhone(whatsapp)) {
      next.whatsapp = "رقم واتساب غير صالح";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});

    const payload: Record<string, string> = {
      phone: normalizePhone(phone) || phone.trim(),
      project_slug: project.slug,
      _subject: `استفسار ${project.projectName} — ${name.trim() || "عميل"}`,
    };
    if (name.trim()) payload.name = name.trim();
    if (whatsapp.trim()) payload.whatsapp = normalizePhone(whatsapp) || whatsapp.trim();
    if (unitType) payload.unit_type = unitType;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Record<string, string> };

      if (!res.ok) {
        const msg =
          (typeof data.error === "string" && data.error) ||
          Object.values(data.errors ?? {})[0] ||
          "تعذر إرسال النموذج. حاول مرة أخرى.";
        setErrors({ form: msg });
        return;
      }

      router.push("/thank-you");
    } catch {
      setErrors({ form: "حدث خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionWrapper id="lead-form" className="bg-navy/5 rounded-2xl">
      <motion.div
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-navy mb-2">احجز استشارتك الآن</h2>
        <p className="text-muted mb-5">
          اترك بياناتك وسنتواصل معك في أقرب وقت بخصوص {project.projectName}. الحقل الوحيد الإلزامي هو رقم
          الهاتف.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lead-name" className="block text-base font-medium text-navy mb-1">
              الاسم <span className="text-muted font-normal">(اختياري)</span>
            </label>
            <Input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك"
              autoComplete="name"
              disabled={submitting}
            />
          </div>
          <div>
            <label htmlFor="lead-phone" className="block text-base font-medium text-navy mb-1">
              رقم الهاتف *
            </label>
            <Input
              id="lead-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+20 10xxxxxxxx أو +966 5xxxxxxxx"
              autoComplete="tel"
              disabled={submitting}
              error={errors.phone}
            />
            <p className="mt-1 text-sm text-muted">
              مثال: 01012345678 أو 966501234567 (مصر، السعودية، البحرين، الإمارات، قطر)
            </p>
          </div>
          <div>
            <label htmlFor="lead-whatsapp" className="block text-base font-medium text-navy mb-1">
              رقم واتساب <span className="text-muted font-normal">— أو أكد رقم الهاتف</span>
              <span className="text-muted font-normal"> (اختياري)</span>
            </label>
            <Input
              id="lead-whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="رقم واتساب إن كان مختلفاً، أو أعد كتابة رقم الهاتف للتأكيد"
              autoComplete="tel"
              disabled={submitting}
              error={errors.whatsapp}
            />
          </div>
          <div>
            <label htmlFor="lead-unit" className="block text-base font-medium text-navy mb-1">
              نوع الوحدة <span className="text-muted font-normal">(اختياري)</span>
            </label>
            <select
              id="lead-unit"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              disabled={submitting}
              className={selectBaseClasses}
            >
              {ALIVA_UNIT_FORM_OPTIONS.map((opt) => (
                <option key={opt.label + opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
          <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
            {isAlivaLandingSlug(project.slug) ? (
              <img src="/mountainview-emblem-white.webp" alt="" aria-hidden className="w-7 h-7 object-contain" />
            ) : (
              <Send size={18} aria-hidden />
            )}
            {submitting ? "جاري الإرسال…" : project.leadFormCtaText ?? project.ctaText}
          </Button>
        </form>
      </motion.div>
    </SectionWrapper>
  );
}
