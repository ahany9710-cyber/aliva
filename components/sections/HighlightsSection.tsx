"use client";

import {
  MapPin,
  Home,
  Building2,
  Calendar,
  Wallet,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { fadeInUp, fadeInUpStagger, noMotion, noMotionStagger } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  location: MapPin,
  home: Home,
  building: Building2,
  calendar: Calendar,
  wallet: Wallet,
  chart: BarChart3,
};

interface HighlightsSectionProps {
  project: ProjectContent;
}

export function HighlightsSection({ project }: HighlightsSectionProps) {
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;
  const staggerVariants = reducedMotion ? noMotionStagger : fadeInUpStagger;

  return (
    <SectionWrapper id="highlights" className="bg-white rounded-2xl shadow-sm">
      <motion.h2
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="text-2xl font-bold text-navy mb-6"
      >
        أبرز المعلومات
      </motion.h2>

      {/* Stats highlights */}
      <motion.div
        variants={staggerVariants.container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {project.highlights.map((point, index) => {
          const Icon = HIGHLIGHT_ICONS[point.icon] ?? BarChart3;
          return (
            <motion.div
              key={`${point.label}-${index}`}
              variants={staggerVariants.item}
              className="p-3 rounded-xl border border-navy/10 bg-background flex gap-2.5 items-start"
            >
              <span className="shrink-0 text-gold mt-0.5" aria-hidden>
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <div>
                <span className="text-muted text-sm">{point.label}</span>
                <p className="font-semibold text-navy text-base mt-0.5 leading-snug">{point.value}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
