"use client";

import Link from "next/link";
import { MessageCircle, PhoneCall } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { buildProjectWhatsAppUrl } from "@/lib/utils";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";
import { trackMetaContact } from "@/lib/meta-contact";

interface HighlightsSectionProps {
  project: ProjectContent;
  contactPhone?: string;
  contactWhatsapp?: string;
}

export function HighlightsSection({
  project,
  contactPhone,
  contactWhatsapp,
}: HighlightsSectionProps) {
  const phone = contactPhone ?? project.phoneNumber ?? project.whatsappNumber;
  const callUrl = `tel:+${phone.replace(/\D/g, "")}`;
  const whatsappNumber = contactWhatsapp ?? project.whatsappNumber;
  const whatsappUrl = buildProjectWhatsAppUrl(
    { ...project, whatsappNumber },
    "inquiry"
  );
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper
      id="highlights"
      className="py-10 md:py-12 border-t border-b border-navy/10 bg-white"
    >
      <motion.p
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="section-label mb-3 text-center"
      >
        تواصل مع المبيعات
      </motion.p>
      <motion.h2
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="text-2xl sm:text-3xl font-bold text-navy mb-3 text-center"
      >
        جاهز للخطوة التالية؟
      </motion.h2>
      <motion.p
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="text-center text-muted max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
      >
        اتصل أو راسلنا على واتساب — فريق ماونتن ڤيو يساعدك في اختيار الوحدة وخطة السداد بدون التزام.
      </motion.p>
      <motion.div
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href={callUrl}
          onClick={() => trackMetaContact(project.slug, "phone_highlights")}
          className="inline-flex"
        >
          <Button size="lg" className="gap-2">
            <PhoneCall size={18} aria-hidden />
            {project.ctaText}
          </Button>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackMetaContact(project.slug, "whatsapp_highlights")}
          className="inline-flex"
        >
          <Button variant="mv-outline" size="lg" className="gap-2 bg-white border-navy/20">
            <MessageCircle size={18} aria-hidden />
            تواصل مع فريق المبيعات
          </Button>
        </a>
      </motion.div>
      <motion.p
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="mt-6 text-center text-sm text-muted"
      >
        تفضّل النموذج؟{" "}
        <Link
          href="#lead-form"
          className="font-medium text-navy underline underline-offset-2 hover:text-sky-800"
        >
          {project.leadFormCtaText ?? "سجّل اهتمامك"}
        </Link>
      </motion.p>
    </SectionWrapper>
  );
}
