"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import type { ProjectContent } from "@/types/project";

const EGYPT_PHONE_REGEX = /^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/;

interface LeadFormSectionProps {
  project: ProjectContent;
}

export function LeadFormSection({ project }: LeadFormSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "الاسم مطلوب";
    if (!phone.trim()) next.phone = "رقم الهاتف مطلوب";
    else if (!EGYPT_PHONE_REGEX.test(phone.replace(/\s/g, "")))
      next.phone = "رقم هاتف مصري صحيح مطلوب";
    if (!consent) next.consent = "يرجى الموافقة على التواصل";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setErrors({});

    const normalizedPhone = phone.replace(/\s/g, "");
    const source = [
      searchParams.get("utm_source"),
      searchParams.get("utm_campaign"),
    ]
      .filter(Boolean)
      .join(" | ") || undefined;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_slug: project.slug,
          name: name.trim(),
          phone: normalizedPhone,
          email: email.trim() || undefined,
          notes: notes.trim() || undefined,
          source,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "حدث خطأ، يرجى المحاولة لاحقاً");
      }
      router.push(`/thank-you?project=${encodeURIComponent(project.slug)}`);
    } catch (err) {
      setStatus("error");
      setErrors({
        form: err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة لاحقاً",
      });
    }
  }

  return (
    <SectionWrapper id="lead-form" className="bg-navy/5 rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-navy mb-2">
          احجز استشارتك الآن
        </h2>
        <p className="text-muted mb-8">
          اترك بياناتك وسنتواصل معك في أقرب وقت بخصوص {project.projectName}.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="lead-name" className="block text-sm font-medium text-navy mb-1">
              الاسم *
            </label>
            <input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
              placeholder="أدخل اسمك"
              disabled={status === "loading"}
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="lead-phone" className="block text-sm font-medium text-navy mb-1">
              رقم الهاتف *
            </label>
            <input
              id="lead-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
              placeholder="01xxxxxxxxx"
              disabled={status === "loading"}
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="lead-email" className="block text-sm font-medium text-navy mb-1">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
              placeholder="example@email.com"
              disabled={status === "loading"}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="lead-notes" className="block text-sm font-medium text-navy mb-1">
              ملاحظات (اختياري)
            </label>
            <textarea
              id="lead-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none"
              placeholder="أي استفسار إضافي"
              disabled={status === "loading"}
            />
          </div>
          <div className="flex items-start gap-3">
            <input
              id="lead-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 rounded border-navy/30 text-gold focus:ring-gold"
              disabled={status === "loading"}
            />
            <label htmlFor="lead-consent" className="text-sm text-muted">
              أوافق على أن يتم التواصل معي عبر الهاتف أو الواتساب بخصوص العروض والاستفسارات.
            </label>
          </div>
          {errors.consent && (
            <p className="text-sm text-red-600">{errors.consent}</p>
          )}
          {errors.form && (
            <p className="text-sm text-red-600">{errors.form}</p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? "جاري الإرسال..." : project.ctaText}
          </Button>
        </form>
      </motion.div>
    </SectionWrapper>
  );
}
