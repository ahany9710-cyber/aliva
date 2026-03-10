"use client";

import { Phone, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { fadeInUp } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";

interface PricingSectionProps {
  project: ProjectContent;
  /** Override for tel: link (from admin page_settings). */
  contactPhone?: string;
}

export function PricingSection({ project, contactPhone }: PricingSectionProps) {
  const phone = contactPhone ?? project.whatsappNumber;
  const callUrl = `tel:+${phone.replace(/\D/g, "")}`;

  return (
    <SectionWrapper id="pricing">
      <motion.div
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        viewport={fadeInUp.viewport}
        className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-white border border-navy/10 shadow-md"
      >
        <h2 className="text-2xl font-bold text-navy mb-4 flex items-center justify-center gap-2">
          <Tag size={24} className="text-gold" aria-hidden />
          الأسعار والعروض
        </h2>
        <p className="text-3xl font-bold text-gold mt-2">
          يبدأ من {project.startingPrice}
        </p>
        <p className="text-muted mt-2">
          مقدم {project.downPayment} — تقسيط حتى {project.installmentYears} سنة
        </p>
        <p className="text-sm text-muted mt-1">
          للاستفسار عن الوحدات والأسعار الحالية
        </p>
        <a
          href={callUrl}
          className="mt-6 inline-flex items-center gap-2"
        >
          <Button size="lg" className="gap-2">
            <Phone size={18} aria-hidden />
            {project.ctaText}
          </Button>
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
