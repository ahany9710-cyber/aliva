"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { ProjectContent } from "@/types/project";

interface HighlightsSectionProps {
  project: ProjectContent;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function HighlightsSection({ project }: HighlightsSectionProps) {
  return (
    <SectionWrapper id="highlights" className="bg-white rounded-2xl shadow-sm">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-navy mb-8"
      >
        لماذا {project.projectName}؟
      </motion.h2>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div
          variants={item}
          className="p-4 rounded-xl border border-navy/10 bg-background"
        >
          <span className="text-muted text-sm">الموقع</span>
          <p className="font-semibold text-navy mt-1">{project.location}</p>
        </motion.div>
        <motion.div
          variants={item}
          className="p-4 rounded-xl border border-navy/10 bg-background"
        >
          <span className="text-muted text-sm">الوحدات</span>
          <p className="font-semibold text-navy mt-1">
            {project.propertyTypes.join(" · ")}
          </p>
        </motion.div>
        <motion.div
          variants={item}
          className="p-4 rounded-xl border border-navy/10 bg-background"
        >
          <span className="text-muted text-sm">المطور</span>
          <p className="font-semibold text-navy mt-1">{project.developer}</p>
        </motion.div>
        <motion.div
          variants={item}
          className="p-4 rounded-xl border border-navy/10 bg-background"
        >
          <span className="text-muted text-sm">التسليم</span>
          <p className="font-semibold text-navy mt-1">{project.deliveryDate}</p>
        </motion.div>
        <motion.div
          variants={item}
          className="p-4 rounded-xl border border-navy/10 bg-background"
        >
          <span className="text-muted text-sm">مقدم الحجز</span>
          <p className="font-semibold text-navy mt-1">{project.downPayment}</p>
        </motion.div>
        <motion.div
          variants={item}
          className="p-4 rounded-xl border border-navy/10 bg-background"
        >
          <span className="text-muted text-sm">التقسيط</span>
          <p className="font-semibold text-navy mt-1">
            حتى {project.installmentYears} سنوات
          </p>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
