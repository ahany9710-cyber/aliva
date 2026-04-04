"use client";

import { MessageCircle, MessageSquare } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { buildProjectWhatsAppUrl } from "@/lib/utils";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";
import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";

interface FinalCTASectionProps {
  project: ProjectContent;
  /** Override for WhatsApp link (from admin page_settings). */
  contactWhatsapp?: string;
}

export function FinalCTASection({ project, contactWhatsapp }: FinalCTASectionProps) {
  const whatsappNumber = contactWhatsapp ?? project.whatsappNumber;
  const whatsappUrl = buildProjectWhatsAppUrl(
    { ...project, whatsappNumber },
    "booking"
  );
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper className="py-20">
      <motion.div
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="max-w-2xl mx-auto text-center p-10 rounded-2xl bg-navy text-white"
      >
        <h2 className="text-2xl font-bold mb-3">
          لا تفوت الفرصة — الوحدات محدودة
        </h2>
        <p className="text-white/90 mb-8">
          تواصل الآن واحصل على أفضل العروض وخطط التقسيط المناسبة لك.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="primary"
              size="lg"
              className="gap-2 bg-gold hover:bg-amber-500 text-white border-0"
            >
              {isMountainViewLandingSlug(project.slug) ? (
                <img src="/mountainview-emblem-white.webp" alt="" aria-hidden className="w-7 h-7 object-contain" />
              ) : (
                <MessageCircle size={18} aria-hidden />
              )}
              تواصل عبر واتساب
            </Button>
          </a>
          <a href="#lead-form">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-2 border-white text-white hover:bg-white hover:text-navy"
            >
              {isMountainViewLandingSlug(project.slug) ? (
                <img src="/mountainview-emblem-white.webp" alt="" aria-hidden className="w-7 h-7 object-contain" />
              ) : (
                <MessageSquare size={18} aria-hidden />
              )}
              اطلب استشارة
            </Button>
          </a>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
