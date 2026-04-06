"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";

interface WhyThisSectionProps {
  project: ProjectContent;
}

export function WhyThisSection({ project }: WhyThisSectionProps) {
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper
      id="why-this-project"
      className="rounded-lg border border-navy/10 bg-gradient-to-br from-white via-slate-50/50 to-sky-100/30"
    >
      <motion.p
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="section-label mb-3 text-center"
      >
        نمط حياة | تجارب متنوعة | مجتمع متكامل
      </motion.p>
      <motion.h2
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="text-3xl font-light text-navy mb-10 text-center leading-snug"
      >
        لماذا تختار {project.projectName}؟
      </motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.whyPoints.map((point, i) => (
          <motion.article
            key={point.title}
            initial={sectionVariants.initial}
            whileInView={sectionVariants.animate}
            viewport={sectionVariants.viewport}
            transition={{ delay: i * 0.05 }}
            className="ps-5 py-5 pe-4 bg-white border-s-4 border-sky-700 rounded-none shadow-none"
          >
            <h3 className="font-semibold text-navy text-lg">{point.title}</h3>
            <p className="mt-2 text-muted leading-relaxed">
              {point.description}
            </p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
