"use client";

import { Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";
import { isAlivaLandingSlug } from "@/lib/aliva-landing";

interface FinalCTASectionProps {
  project: ProjectContent;
  contactWhatsapp?: string;
}

export function FinalCTASection({ project }: FinalCTASectionProps) {
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper className="py-10 md:py-12">
      <motion.div
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="max-w-2xl mx-auto text-center p-8 md:p-10 rounded bg-navy text-white"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3 flex flex-wrap items-center justify-center gap-1">
          <span>هل تحتاج مزيداً من المعلومات؟</span>
          <span className="text-sky-300 inline-block leading-none" aria-hidden>
            ·
          </span>
        </h2>
        <p className="text-white/90 mb-8 text-base md:text-lg">
          طلب مكالمة مع مستشار مبيعات
        </p>
        <a href="#lead-form" className="inline-flex">
          <Button
            size="lg"
            className="gap-2 border border-white text-white bg-transparent shadow-none hover:bg-white/10 hover:text-white"
          >
            {isAlivaLandingSlug(project.slug) ? (
              <img
                src="/mountainview-emblem-white.webp"
                alt=""
                aria-hidden
                className="w-7 h-7 object-contain"
              />
            ) : (
              <Phone size={18} aria-hidden />
            )}
            جدول مكالمة
          </Button>
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
