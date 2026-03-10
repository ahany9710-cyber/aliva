"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { ProjectContent } from "@/types/project";

interface WhyThisSectionProps {
  project: ProjectContent;
}

export function WhyThisSection({ project }: WhyThisSectionProps) {
  return (
    <SectionWrapper id="why-this-project">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-navy mb-10 text-center"
      >
        لماذا تختار {project.projectName}؟
      </motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.whyPoints.map((point, i) => (
          <motion.article
            key={point.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl bg-white border border-navy/10 shadow-sm"
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
