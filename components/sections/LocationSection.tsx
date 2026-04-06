"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Map, MapPin, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";

/** Map + travel-times graphic (public/aliva-location-map.png) */
const LOCATION_MAP_SRC = "/aliva-location-map.png";
const LOCATION_MAP_WIDTH = 956;
const LOCATION_MAP_HEIGHT = 748;

interface LocationSectionProps {
  project: ProjectContent;
}

function MasterplanModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const ctaBarHeight = 76;

  return createPortal(
    <div
      className="fixed left-0 right-0 top-0 z-9999 flex items-end sm:items-center justify-center bg-black/70"
      style={{ bottom: ctaBarHeight }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col border-t border-navy/10 overflow-hidden"
        style={{ maxHeight: "min(calc(100dvh - 76px), calc(100vh - 76px))" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-label="خريطة الموقع وأوقات الوصول"
      >
        {/* header — white, mobile-friendly touch targets */}
        <div className="flex items-center justify-between shrink-0 px-4 sm:px-6 py-3 min-h-14 border-b border-navy/10 bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-navy truncate flex-1 min-w-0 mr-3">
            الموقع وأوقات الوصول
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-navy/70 hover:text-navy active:bg-navy/15 bg-navy/5 touch-manipulation"
            aria-label="إغلاق"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* image — smooth scroll on iOS */}
        <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-100 [-webkit-overflow-scrolling:touch]">
          <Image
            src={LOCATION_MAP_SRC}
            alt="خريطة موقع أليڤا في شرق مدينة نصر وأوقات الوصول التقريبية"
            width={LOCATION_MAP_WIDTH}
            height={LOCATION_MAP_HEIGHT}
            className="block w-full h-auto"
            quality={85}
          />
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export function LocationSection({ project }: LocationSectionProps) {
  const [masterplanOpen, setMasterplanOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const sectionVariants = reducedMotion ? noMotion : fadeInUp;

  return (
    <SectionWrapper
      id="location"
      className="rounded-lg border border-navy/10 bg-gradient-to-br from-white via-slate-50/55 to-sky-100/30 shadow-sm"
    >
      <motion.h2
        initial={sectionVariants.initial}
        whileInView={sectionVariants.animate}
        viewport={sectionVariants.viewport}
        className="text-2xl font-bold text-navy mb-4 flex items-center gap-2"
      >
        <Map size={24} className="text-sky-700 shrink-0" aria-hidden />
        الموقع و خريطة المشروع
      </motion.h2>
      <p className="text-muted mb-4">{project.location}</p>

      {/* Map + travel times (same asset as lightbox) */}
      <button
        type="button"
        onClick={() => setMasterplanOpen(true)}
        className="group relative block w-full rounded-lg overflow-hidden border border-navy/10 bg-slate-100 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        aria-label="عرض الخريطة بحجم أكبر"
      >
        <Image
          src={LOCATION_MAP_SRC}
          alt="خريطة موقع أليڤا في شرق مدينة نصر وأوقات الوصول التقريبية"
          width={LOCATION_MAP_WIDTH}
          height={LOCATION_MAP_HEIGHT}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, 672px"
          quality={85}
          priority={false}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/55 to-transparent pt-10 pb-3 px-4">
          <span className="flex items-center justify-center gap-2 text-white text-sm font-medium drop-shadow">
            <Maximize2 size={16} />
            اضغط للعرض بحجم أكبر
          </span>
        </div>
      </button>

      {project.nearbyPlaces && project.nearbyPlaces.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="أماكن قريبة">
          {project.nearbyPlaces.map((place) => (
            <li
              key={place.name}
              className="flex items-center gap-3 p-3 rounded-xl border border-navy/10 bg-background"
            >
              <span className="shrink-0 text-sky-700" aria-hidden>
                <MapPin size={20} strokeWidth={1.8} />
              </span>
              <div>
                <span className="font-medium text-navy text-base">{place.name}</span>
                <span className="text-muted text-base block mt-0.5">{place.distance}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {masterplanOpen && (
          <MasterplanModal onClose={() => setMasterplanOpen(false)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
