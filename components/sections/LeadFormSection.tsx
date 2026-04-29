"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { fadeInUp, noMotion } from "@/lib/motion";
import { buildWhatsAppUrl } from "@/lib/utils";
import { telHref } from "@/lib/phone-display";
import { LeadForm } from "@/components/sections/LeadForm";
import type { ProjectContent } from "@/types/project";

interface LeadFormSectionProps {
  /** Projects shown as chips. */
  projects: ProjectContent[];
  /** Default WhatsApp / phone for the inline call/WhatsApp microbar. */
  whatsappNumber: string;
  phoneNumber: string;
  /** Optional pre-selected slug. */
  defaultProjectSlug?: string;
}

export function LeadFormSection({
  projects,
  whatsappNumber,
  phoneNumber,
  defaultProjectSlug,
}: LeadFormSectionProps) {
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  const tel = telHref(phoneNumber);
  const wa = buildWhatsAppUrl(
    whatsappNumber,
    "السلام عليكم، مهتم بمشاريع ماونتن ڤيو وأرغب بالتواصل مع المبيعات."
  );

  return (
    <SectionWrapper id="lead-form" className="bg-white border-y border-navy/10">
      <motion.div
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="max-w-xl mx-auto"
      >
        {/* Friendlier 2-step framing: prefer call, form is fallback. */}
        <p className="section-label text-center mb-2">أسرع طريقة</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-navy text-center">
          اتصل أو ابعت واتساب — هنرد عليك في دقايق
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={tel}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy text-white py-3 px-4 font-semibold hover:bg-navy/90 transition-colors"
          >
            <Phone size={18} aria-hidden /> اتصل الآن
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white py-3 px-4 font-semibold hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle size={18} aria-hidden /> واتساب
          </a>
        </div>

        <div className="my-6 flex items-center gap-3 text-muted text-xs uppercase tracking-widest">
          <span className="h-px flex-1 bg-navy/12" />
          أو سجل اهتمامك ونتواصل معك
          <span className="h-px flex-1 bg-navy/12" />
        </div>

        <LeadForm
          projects={projects}
          defaultProjectSlug={defaultProjectSlug}
          source="section"
        />
      </motion.div>
    </SectionWrapper>
  );
}
