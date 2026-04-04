"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Droplets, Footprints, PenLine, Sun, TreePine } from "lucide-react";
import type { ProjectContent } from "@/types/project";
import { revealStagger, revealStaggerReduced } from "@/lib/motion";

interface WadiYemmSectionProps {
  project: ProjectContent;
}

const FEATURE_ICONS = [Sun, Footprints, Droplets, TreePine] as const;

export function WadiYemmSection({ project }: WadiYemmSectionProps) {
  const body = project.whyPoints[2]?.description ?? project.subheadline;
  const reducedMotion = useReducedMotion();
  const stagger = reducedMotion ? revealStaggerReduced : revealStagger;

  return (
    <section className="overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[min(56vh,520px)]">
        <motion.div
          className="relative min-h-[220px] md:min-h-0 order-1 md:order-2"
          initial={reducedMotion ? false : { scale: 0.96, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={project.heroImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={82}
          />
        </motion.div>

        <div className="order-2 md:order-1 bg-[#0A4D68] flex flex-col justify-center px-5 sm:px-8 lg:px-10 py-10 md:py-12">
          <motion.div
            className="w-full"
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            <motion.div variants={stagger.item} className="flex items-center gap-4 mb-5 text-white/60">
              {FEATURE_ICONS.map((Icon, i) => (
                <Icon key={i} size={22} strokeWidth={1.75} aria-hidden />
              ))}
            </motion.div>
            <motion.h2
              variants={stagger.item}
              className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-5"
            >
              وادي يم: الفصل الافتتاحي من راس الحكمة
            </motion.h2>
            <motion.p
              variants={stagger.item}
              className="text-base sm:text-lg text-white/90 leading-relaxed mb-5"
            >
              {project.subheadline}
            </motion.p>
            <motion.p
              variants={stagger.item}
              className="text-base sm:text-lg text-white/90 leading-relaxed mb-8"
            >
              {body}
            </motion.p>
            <motion.div variants={stagger.item}>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 min-h-12 w-full sm:w-auto px-8 sm:px-10 text-sm sm:text-base uppercase tracking-wide font-semibold text-white border-2 border-white bg-transparent hover:bg-white hover:text-[#0A4D68] active:bg-white active:text-[#0A4D68] transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-none text-center"
              >
                <PenLine size={18} aria-hidden />
                سجّل اهتمامك
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
