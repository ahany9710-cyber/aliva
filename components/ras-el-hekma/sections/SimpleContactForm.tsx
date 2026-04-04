"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, MessageCircle, Phone, Send, User } from "lucide-react";
import type { ProjectContent } from "@/types/project";
import type { LeadFormPayload } from "@/types/lead";
import type { NextSearchParams } from "@/types/next";
import { isValidEgyptPhone, normalizeEgyptPhone } from "@/lib/validation";
import { getSearchParam } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";
import { fadeInUp, noMotion } from "@/lib/motion";

interface SimpleContactFormProps {
  project: ProjectContent;
  searchParams?: NextSearchParams;
  whatsappUrl: string;
}

const inputClass =
  "w-full h-16 px-5 text-xl text-[#0D2E3D] border-2 border-[#0A4D68]/30 rounded-none bg-white focus:border-[#0A4D68] focus:outline-none focus:ring-0 transition-all duration-200 focus:scale-[1.01]";

export function SimpleContactForm({ project, searchParams, whatsappUrl }: SimpleContactFormProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const v = reducedMotion ? noMotion : fadeInUp;
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
    else if (!isValidEgyptPhone(phone)) {
      next.phone =
        "رقم هاتف صحيح مطلوب (مصر، السعودية، البحرين، الإمارات، قطر)";
    }
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

  const ctaText = project.leadFormCtaText ?? project.ctaText;

  return (
    <motion.section
      id="contact"
      className="bg-[#F2EDE4] py-16 md:py-24 scroll-mt-8"
      initial={v.initial}
      whileInView={v.animate}
      viewport={v.viewport}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0A4D68] uppercase tracking-wide text-center mb-4">
          سجّل اهتمامك
        </h2>
        <p className="text-xl text-[#0D2E3D]/90 text-center mb-10 leading-relaxed">
          اترك اسمك ورقم هاتفك وسنتواصل معك بخصوص {project.projectName}.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="reh-name"
              className="flex items-center gap-2 text-2xl font-semibold text-[#0A4D68] mb-3"
            >
              <User size={18} className="text-[#1BA8C8] shrink-0" aria-hidden strokeWidth={2} />
              الاسم *
            </label>
            <input
              id="reh-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading"}
              placeholder="أدخل اسمك"
              className={inputClass}
            />
            {errors.name && <p className="mt-2 text-lg text-red-700">{errors.name}</p>}
          </div>
          <div>
            <label
              htmlFor="reh-phone"
              className="flex items-center gap-2 text-2xl font-semibold text-[#0A4D68] mb-3"
            >
              <Phone size={18} className="text-[#1BA8C8] shrink-0" aria-hidden strokeWidth={2} />
              رقم الهاتف *
            </label>
            <input
              id="reh-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={status === "loading"}
              placeholder="مثال: 01012345678"
              className={inputClass}
            />
            {errors.phone && <p className="mt-2 text-lg text-red-700">{errors.phone}</p>}
          </div>
          {errors.form && <p className="text-lg text-red-700">{errors.form}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full min-h-[60px] inline-flex items-center justify-center gap-2 bg-[#0A4D68] text-white text-lg font-semibold tracking-wide rounded-none hover:bg-[#0D3D54] active:bg-[#0D3D54] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#0A4D68] focus-visible:outline-offset-2 transition-colors"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={20} className="animate-spin shrink-0" aria-hidden />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send size={18} className="shrink-0" aria-hidden />
                {ctaText}
              </>
            )}
          </button>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-[#0A4D68]/15" />
            <span className="text-sm text-[#0D2E3D]/50 shrink-0">أو</span>
            <div className="flex-1 h-px bg-[#0A4D68]/15" />
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(project.slug, "cta_whatsapp")}
            className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 border border-[#25D366] text-[#1a8c47] text-base font-semibold rounded-none bg-white hover:bg-[#f0fdf4] active:bg-[#dcfce7] transition-colors focus-visible:outline-2 focus-visible:outline-[#25D366] focus-visible:outline-offset-2"
          >
            <MessageCircle size={18} className="shrink-0 text-[#25D366]" aria-hidden strokeWidth={2} />
            تواصل عبر واتساب
          </a>
        </form>
      </div>
    </motion.section>
  );
}
