"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectWhyPoint } from "@/types/project";

interface WhyThisSectionProps {
  /** Either pass a list of whyPoints, or pass a project + we'll use project.whyPoints. */
  whyPoints: ProjectWhyPoint[];
  title?: string;
  eyebrow?: string;
}

export function WhyThisSection({
  whyPoints,
  title = "ليه ماونتن ڤيو؟",
  eyebrow = "تشكيلة | خبرة | فريق متاح دلوقتي",
}: WhyThisSectionProps) {
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper
      id="why-mountain-view"
      className="rounded-lg border border-navy/10 bg-gradient-to-br from-white via-slate-50/50 to-sky-100/30"
    >
      <motion.p
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="section-label mb-3 text-center"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="text-2xl sm:text-3xl font-bold text-navy mb-8 text-center leading-snug"
      >
        {title}
      </motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {whyPoints.map((point, i) => (
          <motion.article
            key={point.title}
            initial={sectionVariants.initial}
            whileInView={sectionVariants.animate}
            viewport={sectionVariants.viewport}
            transition={{ delay: i * 0.05 }}
            className="ps-5 py-5 pe-4 bg-white border-s-4 border-sky-700 rounded-none shadow-none"
          >
            <h3 className="font-semibold text-navy text-lg">{point.title}</h3>
            <p className="mt-2 text-muted leading-relaxed">{point.description}</p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
