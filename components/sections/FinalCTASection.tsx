"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { ProjectContent } from "@/types/project";

interface FinalCTASectionProps {
  project: ProjectContent;
}

export function FinalCTASection({ project }: FinalCTASectionProps) {
  const whatsappUrl = buildWhatsAppUrl(
    project.whatsappNumber,
    `مرحباً، أريد الحجز أو الاستفسار عن مشروع ${project.projectName}`
  );

  return (
    <SectionWrapper className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
              className="bg-gold hover:bg-amber-500 text-white border-0"
            >
              تواصل عبر واتساب
            </Button>
          </a>
          <a href="#lead-form">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-navy"
            >
              اطلب استشارة
            </Button>
          </a>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
