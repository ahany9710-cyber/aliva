"use client";

import { useCallback, useEffect, useId, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Building2,
  Globe2,
  Landmark,
  LayoutGrid,
  Phone,
  TrendingUp,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ProjectContent } from "@/types/project";
import { fadeInUpStagger, noMotionStagger } from "@/lib/motion";
import { formatPhoneDisplay, telHref } from "@/lib/phone-display";
import { trackClick } from "@/lib/analytics";

const ICONS: LucideIcon[] = [
  Building2,
  LayoutGrid,
  Waves,
  Globe2,
  Landmark,
  TrendingUp,
];

interface WhySectionProps {
  project: ProjectContent;
  contactPhone: string;
  projectSlug: string;
}

export function WhySection({ project, contactPhone, projectSlug }: WhySectionProps) {
  const points = project.whyPoints.slice(0, 6);
  const reducedMotion = useReducedMotion();
  const stagger = reducedMotion ? noMotionStagger : fadeInUpStagger;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleId = useId();
  const descId = useId();
  const tel = telHref(contactPhone);
  const callLabel = formatPhoneDisplay(contactPhone);

  const active = openIndex !== null ? points[openIndex] ?? null : null;

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close]);

  return (
    <section className="bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A4D68] text-center uppercase tracking-wide mb-8 md:mb-10">
          لماذا راس الحكمة؟
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {points.map((point, i) => {
            const Icon = ICONS[i] ?? Building2;
            return (
              <motion.button
                key={`${point.title}-${i}`}
                type="button"
                variants={stagger.item}
                whileHover={reducedMotion ? undefined : { y: -2 }}
                onClick={() => setOpenIndex(i)}
                aria-haspopup="dialog"
                aria-expanded={openIndex === i}
                className="text-start p-6 md:p-8 border border-[#0A4D68]/15 rounded-none shadow-md bg-white transition-shadow duration-200 hover:border-[#1BA8C8]/50 hover:shadow-[0_0_0_3px_rgba(27,168,200,0.12)] focus-visible:outline-2 focus-visible:outline-[#1BA8C8] focus-visible:outline-offset-2 cursor-pointer"
              >
                <Icon className="text-[#1BA8C8] mb-4" size={36} strokeWidth={1.5} aria-hidden />
                <h3 className="text-lg md:text-xl font-bold text-[#0A4D68] mb-2">
                  {point.title}
                </h3>
                <p className="text-base text-[#0D2E3D]/80 leading-relaxed line-clamp-4">
                  {point.description}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-[#1BA8C8]">
                  اطّلع على المزيد
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px] border-0 cursor-default"
              aria-label="إغلاق"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={reducedMotion ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reducedMotion ? undefined : { y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="relative z-1 w-full max-w-lg bg-[#F2EDE4] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#0A4D68]/10 max-h-[min(88dvh,92vh)] flex flex-col"
            >
              <div className="shrink-0 flex items-start justify-between gap-3 p-5 pb-3 border-b border-[#0A4D68]/10 bg-[#0A4D68] text-white rounded-t-2xl sm:rounded-t-2xl">
                <h2 id={titleId} className="text-lg sm:text-xl font-bold leading-snug pe-2">
                  {active.title}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  aria-label="إغلاق"
                >
                  <X size={20} strokeWidth={2} aria-hidden />
                </button>
              </div>
              <div className="overflow-y-auto overflow-x-hidden p-5 pt-4 flex-1 min-h-0">
                <p
                  id={descId}
                  className="text-base sm:text-lg text-[#0D2E3D] leading-relaxed"
                >
                  {active.description}
                </p>
                <a
                  href={tel}
                  onClick={() => trackClick(projectSlug, "cta_call")}
                  aria-label={callLabel ? `اتصل بنا على ${callLabel}` : "اتصل بنا"}
                  className="mt-8 w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-4 bg-[#0A4D68] text-white text-base font-semibold rounded-xl hover:bg-[#0D3D54] active:bg-[#0D3D54] transition-colors focus-visible:outline-2 focus-visible:outline-[#0A4D68] focus-visible:outline-offset-2"
                >
                  <Phone size={18} aria-hidden />
                  اتصل بنا
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
