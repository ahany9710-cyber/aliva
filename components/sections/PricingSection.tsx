"use client";

import { Phone, Tag } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";
import { isAlivaLandingSlug } from "@/lib/aliva-landing";
import { trackMetaContact } from "@/lib/meta-contact";

interface PricingSectionProps {
  project: ProjectContent;
  /** Override for tel: link (from admin page_settings). */
  contactPhone?: string;
}

export function PricingSection({ project, contactPhone }: PricingSectionProps) {
  const phone = contactPhone ?? project.phoneNumber ?? project.whatsappNumber;
  const callUrl = `tel:+${phone.replace(/\D/g, "")}`;
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper id="pricing">
      <motion.div
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="max-w-2xl mx-auto text-center p-8 rounded-lg bg-gradient-to-br from-white via-slate-50/40 to-sky-100/40 border border-navy/10 shadow-md"
      >
        <h2 className="text-2xl font-bold text-navy mb-4 flex items-center justify-center gap-2">
          <Tag size={24} className="text-sky-700" aria-hidden />
          الأسعار والعروض
        </h2>
        <p className="text-3xl font-bold text-navy mt-2">
          يبدأ من {project.startingPrice}
        </p>
        <p className="text-muted mt-2">
          مقدم {project.downPayment} — تقسيط حتى {project.installmentYears} سنة
        </p>
        <p className="text-base text-muted mt-1">
          للاستفسار عن الوحدات والأسعار الحالية
        </p>
        <a
          href={callUrl}
          className="mt-6 inline-flex items-center gap-2"
          onClick={() => trackMetaContact(project.slug, "phone_pricing")}
        >
          <Button size="lg" className="gap-2">
            {isAlivaLandingSlug(project.slug) ? (
              <img src="/mountainview-emblem-white.webp" alt="" aria-hidden className="w-7 h-7 object-contain" />
            ) : (
              <Phone size={18} aria-hidden />
            )}
            {project.ctaText}
          </Button>
        </a>
      </motion.div>
    </SectionWrapper>
  );
}
