"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";

interface FAQSectionProps {
  project: ProjectContent;
}

export function FAQSection({ project }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper id="faq">
      <motion.h2
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="text-2xl font-bold text-navy mb-5 text-center"
      >
        أسئلة شائعة
      </motion.h2>
      <div className="max-w-2xl mx-auto space-y-2">
        {project.faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={sectionVariants.initial}
            whileInView={sectionVariants.animate}
            viewport={sectionVariants.viewport}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-navy/10 bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right font-medium text-navy hover:bg-navy/5 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 pt-0 text-muted leading-relaxed border-t border-navy/5">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
