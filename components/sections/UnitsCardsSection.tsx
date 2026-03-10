"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronLeft, X, Phone, MessageCircle } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { ProjectContent } from "@/types/project";

const CTA_TEXT = "احصل على عرض سعر";

/** Add unit-1.jpg … unit-3.jpg to public/ for each card photo, or use your own paths. */
const UNIT_IMAGES = ["/unit-1.jpg", "/unit-2.jpg", "/unit-3.jpg"];

export interface UnitDetails {
  project: string;
  developer: string;
  location: string;
  rooms: string;
  area: string;
  price: string;
  downPayment: string;
}

const UNIT_DETAILS: UnitDetails[] = [
  {
    project: "أليڤا",
    developer: "ماونتن ڤيو",
    location: "المستقبل سيتي - القاهرة الجديدة",
    rooms: "٣",
    area: "١٢٥م",
    price: "١٠،٥٠٠،٠٠٠",
    downPayment: "١٠٠ الف جنيه و التقسيط يصل لـ ١٠ سنوات",
  },
  {
    project: "أليڤا",
    developer: "ماونتن ڤيو",
    location: "المستقبل سيتي - القاهرة الجديدة",
    rooms: "٤ غرف على طابقين",
    area: "٢٠٥ متر + حديقة",
    price: "١٨،٩٠٠،٠٠٠",
    downPayment: "١٠٠ الف جنيه و التقسيط يصل لـ ١٠ سنوات",
  },
  {
    project: "أليڤا",
    developer: "ماونتن ڤيو",
    location: "المستقبل سيتي - القاهرة الجديدة",
    rooms: "٣",
    area: "٢١٠ متر + حديقة",
    price: "٢٩،٧٧١،٠٠٠",
    downPayment: "١٠٠ الف جنيه و التقسيط يصل لـ ١٠ سنوات",
  },
];

function UnitCard({
  index,
  imageSrc,
  title,
  onClick,
}: {
  index: number;
  imageSrc: string;
  title: string;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  return (
    <article className="shrink-0 w-[calc(50vw-1.5rem)] sm:w-[280px] md:w-[380px] snap-start snap-always">
      <button
        type="button"
        onClick={onClick}
        className="group w-full text-right block overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-[0_4px_24px_rgba(15,33,64,0.08)] hover:shadow-[0_12px_40px_rgba(15,33,64,0.12)] transition-all duration-300"
      >
        <div className="aspect-[4/3] relative bg-gradient-to-br from-navy/10 to-navy/5 overflow-hidden">
          {!imageError && imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 280px"
              quality={82}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl font-bold text-navy/20" aria-hidden>
              {index}
            </span>
          )}
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          <p className="font-semibold text-navy text-sm sm:text-base md:text-lg group-hover:text-gold transition-colors leading-tight">
            {title}
          </p>
          <span className="inline-flex items-center gap-1 mt-1.5 md:mt-2 text-xs md:text-sm text-gold font-medium" aria-hidden>
            <span>تفاصيل الوحدة</span>
            <ArrowLeft size={14} className="md:w-4 md:h-4" />
          </span>
        </div>
      </button>
    </article>
  );
}

const UNIT_TITLES: Record<number, string> = {
  1: "شقة ٣ غرف",
  2: "أي ڤيلا",
  3: "تاون هاوس",
};

export function UnitsCardsSection({ project }: { project: ProjectContent }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [modalImageError, setModalImageError] = useState(false);

  useEffect(() => {
    if (selectedUnit !== null) setModalImageError(false);
  }, [selectedUnit]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedUnit(null);
    }
    if (selectedUnit !== null) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedUnit]);

  function scroll(direction: "prev" | "next") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.85 + 20;
    const offset = direction === "next" ? -cardWidth : cardWidth;
    el.scrollBy({ left: offset, behavior: "smooth" });
  }

  const unit = selectedUnit !== null ? UNIT_DETAILS[selectedUnit - 1] : null;
  const whatsappMessage =
    unit &&
    `مرحباً، أريد الاستفسار عن الوحدة: ${UNIT_TITLES[selectedUnit as number]} - المشروع ${unit.project}`;
  const whatsappUrl = project
    ? buildWhatsAppUrl(project.whatsappNumber, whatsappMessage ?? undefined)
    : "#";
  const telUrl = project ? `tel:+${project.whatsappNumber.replace(/\D/g, "")}` : "#";

  return (
    <SectionWrapper id="units" className="py-12 md:py-16">
      <p className="text-center text-muted text-sm md:text-base mb-4">
        اضغط على الوحدة لعرض تفاصيلها
      </p>
      <div className="relative">
        {/* Slide track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-hide"
          aria-label="قائمة الوحدات — اسحب لعرض البطاقات"
        >
          {[1, 2, 3].map((i) => (
            <UnitCard
              key={i}
              index={i}
              imageSrc={UNIT_IMAGES[i - 1]}
              title={UNIT_TITLES[i]}
              onClick={() => setSelectedUnit(i)}
            />
          ))}
        </div>
        {/* Left / Right arrows — show on all screens so users know it's scrollable */}
        <button
          type="button"
          onClick={() => scroll("prev")}
          className="absolute top-1/2 -translate-y-1/2 right-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors z-10"
          aria-label="البطاقة السابقة"
        >
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          className="absolute top-1/2 -translate-y-1/2 left-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors z-10"
          aria-label="البطاقة التالية"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Unit details modal — slides up from bottom, slides down on close */}
      <AnimatePresence>
        {selectedUnit !== null && unit ? (
          <motion.div
            key="unit-modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
            onClick={() => setSelectedUnit(null)}
            role="dialog"
            aria-modal
            aria-labelledby="unit-modal-title"
          >
            <div
              className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Close button — top left, visible */}
            <button
              type="button"
              onClick={() => setSelectedUnit(null)}
              className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
            {/* Unit photo — smaller */}
            <div className="relative w-full h-36 sm:h-44 rounded-t-3xl overflow-hidden bg-gradient-to-br from-navy/10 to-navy/5">
              {!modalImageError ? (
                <Image
                  src={UNIT_IMAGES[selectedUnit - 1]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 448px) 100vw, 448px"
                  quality={82}
                  onError={() => setModalImageError(true)}
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-navy/20" aria-hidden>
                  {selectedUnit}
                </span>
              )}
            </div>
            <div className="p-6 md:p-8">
              <h2 id="unit-modal-title" className="text-xl font-bold text-navy mb-6">
                {UNIT_TITLES[selectedUnit]}
              </h2>
              <dl className="space-y-3 text-navy">
                <div>
                  <dt className="text-muted text-sm">المشروع</dt>
                  <dd className="font-medium">{unit.project}</dd>
                </div>
                <div>
                  <dt className="text-muted text-sm">المطور</dt>
                  <dd className="font-medium">{unit.developer}</dd>
                </div>
                <div>
                  <dt className="text-muted text-sm">الموقع</dt>
                  <dd className="font-medium">{unit.location}</dd>
                </div>
                <div>
                  <dt className="text-muted text-sm">عدد الغرف</dt>
                  <dd className="font-medium">{unit.rooms}</dd>
                </div>
                <div>
                  <dt className="text-muted text-sm">المساحة</dt>
                  <dd className="font-medium">{unit.area}</dd>
                </div>
                <div>
                  <dt className="text-muted text-sm">السعر</dt>
                  <dd className="font-medium">{unit.price}</dd>
                </div>
                <div>
                  <dt className="text-muted text-sm">المقدم والتقسيط</dt>
                  <dd className="font-medium">{unit.downPayment}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={telUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy text-white py-3 px-5 font-medium hover:bg-navy/90 transition-colors"
                >
                  <Phone size={20} />
                  اتصال
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-3 px-5 font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle size={20} />
                  واتساب
                </a>
              </div>
            </div>
          </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionWrapper>
  );
}
