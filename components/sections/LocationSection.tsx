"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { ProjectContent } from "@/types/project";

interface LocationSectionProps {
  project: ProjectContent;
}

export function LocationSection({ project }: LocationSectionProps) {
  return (
    <SectionWrapper id="location" className="bg-white rounded-2xl shadow-sm">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-navy mb-6"
      >
        الموقع والوصول
      </motion.h2>
      <p className="text-muted mb-6">{project.location}</p>
      <ul className="space-y-3 mb-8">
        {project.nearbyPlaces.map((place, i) => (
          <motion.li
            key={place.name}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 text-foreground"
          >
            <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
            <span className="font-medium">{place.name}</span>
            <span className="text-muted text-sm">— {place.distance}</span>
          </motion.li>
        ))}
      </ul>
      <div
        className="aspect-video rounded-xl bg-navy/10 flex items-center justify-center text-muted"
        aria-hidden
      >
        <span className="text-sm">خريطة — سيتم إضافة الخريطة لاحقاً</span>
      </div>
    </SectionWrapper>
  );
}
