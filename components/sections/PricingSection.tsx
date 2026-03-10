"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { ProjectContent } from "@/types/project";

interface PricingSectionProps {
  project: ProjectContent;
}

export function PricingSection({ project }: PricingSectionProps) {
  const whatsappUrl = buildWhatsAppUrl(
    project.whatsappNumber,
    `مرحباً، أريد معرفة تفاصيل الأسعار والتقسيط لمشروع ${project.projectName}`
  );

  return (
    <SectionWrapper id="pricing">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-white border border-navy/10 shadow-md"
      >
        <h2 className="text-2xl font-bold text-navy mb-4">الأسعار والعروض</h2>
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
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block"
        >
          <Button size="lg">{project.ctaText}</Button>
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
