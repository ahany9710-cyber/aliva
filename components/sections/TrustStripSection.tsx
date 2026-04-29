"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { TrustFact } from "@/content/site";

interface TrustStripSectionProps {
  facts: TrustFact[];
}

export function TrustStripSection({ facts }: TrustStripSectionProps) {
  const reducedMotion = useReducedMotion();
  const v = reducedMotion ? noMotion : fadeInUp;

  return (
    <section
      aria-label="ماونتن ڤيو بالأرقام"
      className="border-y border-navy/10 bg-navy text-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-center">
          {facts.map((f, i) => (
            <motion.li
              key={f.label}
              initial={v.initial}
              whileInView={v.animate}
              viewport={v.viewport}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">
                {f.value}
              </span>
              <span className="text-[0.78rem] md:text-sm text-white/70">
                {f.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
