"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ProjectContent } from "@/types/project";
import type { NextSearchParams } from "@/types/next";
import type { LeadFormPayload } from "@/types/lead";
import { isValidEgyptPhone, normalizeEgyptPhone } from "@/lib/validation";
import { getSearchParam } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";
import { fadeInUp, noMotion } from "@/lib/motion";

interface LeadFormSectionProps {
  project: ProjectContent;
  searchParams?: NextSearchParams;
}

export function LeadFormSection({ project, searchParams }: LeadFormSectionProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;
  const utmSource = getSearchParam(searchParams?.utm_source);
  const utmCampaign = getSearchParam(searchParams?.utm_campaign);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "الاسم مطلوب";
    if (!phone.trim()) next.phone = "رقم الهاتف مطلوب";
    else if (!isValidEgyptPhone(phone)) next.phone = "رقم هاتف مصري صحيح مطلوب";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setErrors({});

    const payload: LeadFormPayload = {
      project_slug: project.slug,
      name: name.trim(),
      phone: normalizeEgyptPhone(phone),
      source: [utmSource, utmCampaign].filter(Boolean).join(" | ") || undefined,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "حدث خطأ، يرجى المحاولة لاحقاً");
      }
      trackClick(project.slug, "lead_submit");
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
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
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
            <label htmlFor="lead-name" className="block text-base font-medium text-navy mb-1">
              الاسم *
            </label>
            <Input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك"
              disabled={status === "loading"}
              autoComplete="name"
              error={errors.name}
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
              placeholder="01xxxxxxxxx"
              disabled={status === "loading"}
              autoComplete="tel"
              error={errors.phone}
            />
            <p className="mt-1 text-sm text-muted">مثال: 01012345678</p>
          </div>
          {errors.form && (
            <p className="text-sm text-red-600">{errors.form}</p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={status === "loading"}
          >
            {project.slug === "mountainview" ? (
              <img src="/mountainview-emblem-white.png" alt="" aria-hidden className="w-7 h-7 object-contain" />
            ) : (
              <Send size={18} aria-hidden />
            )}
            {status === "loading" ? "جاري الإرسال..." : (project.leadFormCtaText ?? project.ctaText)}
          </Button>
        </form>
      </motion.div>
    </SectionWrapper>
  );
}
