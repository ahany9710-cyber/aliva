"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronLeft, X, Phone, MessageCircle } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { ProjectContent } from "@/types/project";
import { trackMetaContact } from "@/lib/meta-fbq";

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
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 280px, 380px"
              quality={75}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl font-bold text-navy/20" aria-hidden>
              {index}
            </span>
          )}
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          <p className="font-semibold text-navy text-base sm:text-base md:text-lg group-hover:text-gold transition-colors leading-tight">
            {title}
          </p>
          <span className="inline-flex items-center gap-1 mt-1.5 md:mt-2 text-sm md:text-base text-gold font-medium" aria-hidden>
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

interface UnitsCardsSectionProps {
  project: ProjectContent;
  contactPhone?: string;
  contactWhatsapp?: string;
}

const SCROLL_EPS = 2;

export function UnitsCardsSection({ project, contactPhone, contactWhatsapp }: UnitsCardsSectionProps) {
  const phone = contactPhone ?? project.phoneNumber ?? project.whatsappNumber;
  const whatsapp = contactWhatsapp ?? project.whatsappNumber;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [modalImageError, setModalImageError] = useState(false);
  const [scrollBounds, setScrollBounds] = useState({ atStart: true, atEnd: false });

  const snapToBoundsRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScrollBounds = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollBounds({ atStart: true, atEnd: true });
      return;
    }
    const isRtl = typeof window !== "undefined" && window.getComputedStyle(el).direction === "rtl";
    const atStart = isRtl ? scrollLeft >= -SCROLL_EPS : scrollLeft <= SCROLL_EPS;
    const atEnd = isRtl ? scrollLeft <= -maxScroll + SCROLL_EPS : scrollLeft >= maxScroll - SCROLL_EPS;
    setScrollBounds({ atStart, atEnd });

    // When scroll settles, snap to exact end/start so no gap appears beside the last or first card
    if (snapToBoundsRef.current) clearTimeout(snapToBoundsRef.current);
    snapToBoundsRef.current = setTimeout(() => {
      snapToBoundsRef.current = null;
      const el2 = scrollRef.current;
      if (!el2) return;
      const { scrollLeft: sl, scrollWidth: sw, clientWidth: cw } = el2;
      const max = sw - cw;
      if (max <= 0) return;
      const rtl = typeof window !== "undefined" && window.getComputedStyle(el2).direction === "rtl";
      if (rtl) {
        if (sl > -SCROLL_EPS && sl < 0) el2.scrollLeft = 0;
        else if (sl < -max + SCROLL_EPS && sl > -max - SCROLL_EPS) el2.scrollLeft = -max;
      } else {
        if (sl < SCROLL_EPS && sl >= 0) el2.scrollLeft = 0;
        else if (sl > max - SCROLL_EPS && sl < max + SCROLL_EPS) el2.scrollLeft = max;
      }
    }, 150);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollBounds();
    el.addEventListener("scroll", updateScrollBounds, { passive: true });
    const ro = new ResizeObserver(updateScrollBounds);
    ro.observe(el);
    return () => {
      if (snapToBoundsRef.current) clearTimeout(snapToBoundsRef.current);
      el.removeEventListener("scroll", updateScrollBounds);
      ro.disconnect();
    };
  }, []);

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
    if (direction === "next" && scrollBounds.atEnd) return;
    if (direction === "prev" && scrollBounds.atStart) return;
    const cardWidth = el.offsetWidth * 0.85 + 20;
    const offset = direction === "next" ? -cardWidth : cardWidth;
    el.scrollBy({ left: offset, behavior: "smooth" });
  }

  const unit = selectedUnit !== null ? UNIT_DETAILS[selectedUnit - 1] : null;
  const whatsappMessage =
    unit &&
    `مرحباً، أريد الاستفسار عن الوحدة: ${UNIT_TITLES[selectedUnit as number]} - المشروع ${unit.project}`;
  const whatsappUrl = project
    ? buildWhatsAppUrl(whatsapp, whatsappMessage ?? undefined)
    : "#";
  const telUrl = project ? `tel:+${phone.replace(/\D/g, "")}` : "#";

  return (
    <SectionWrapper id="units" className="py-12 md:py-16">
      <p className="text-center text-muted text-sm md:text-base mb-4">
        اضغط على الوحدة لعرض تفاصيلها
      </p>
      <div className="relative">
        {/* Slide track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 -mx-4 ps-4 pe-0 md:-mx-6 md:ps-6 md:pe-0 scrollbar-hide"
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
        {/* Left / Right arrows — show on all screens; disabled at scroll bounds to avoid overflow bug */}
        <button
          type="button"
          onClick={() => scroll("prev")}
          disabled={scrollBounds.atStart}
          aria-label="البطاقة السابقة"
          className="absolute top-1/2 -translate-y-1/2 right-0 w-11 h-11 md:w-11 md:h-11 rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors z-10 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          disabled={scrollBounds.atEnd}
          aria-label="البطاقة التالية"
          className="absolute top-1/2 -translate-y-1/2 left-0 w-11 h-11 md:w-11 md:h-11 rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors z-10 disabled:opacity-40 disabled:pointer-events-none"
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
              className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-w-md w-full overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] pb-[env(safe-area-inset-bottom,0px)]"
              style={{ maxHeight: "min(85dvh, calc(100vh - 80px))" }}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Close button — 44px min touch target, top-left */}
            <button
              type="button"
              onClick={() => setSelectedUnit(null)}
              className="absolute top-3 left-3 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white active:bg-navy/10 touch-manipulation"
              aria-label="إغلاق"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
            {/* Unit photo */}
            <div className="relative w-full h-32 sm:h-44 rounded-t-3xl overflow-hidden bg-gradient-to-br from-navy/10 to-navy/5">
              {!modalImageError ? (
                <Image
                  src={UNIT_IMAGES[selectedUnit - 1]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 448px) 100vw, 448px"
                  quality={75}
                  onError={() => setModalImageError(true)}
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-navy/20" aria-hidden>
                  {selectedUnit}
                </span>
              )}
            </div>
            <div className="p-4 sm:p-6 md:p-8 pt-14 sm:pt-6">
              <h2 id="unit-modal-title" className="text-lg sm:text-xl font-bold text-navy mb-4 sm:mb-6">
                {UNIT_TITLES[selectedUnit]}
              </h2>
              <dl className="space-y-2.5 sm:space-y-3 text-navy text-base">
                <div>
                  <dt className="text-muted text-base">المشروع</dt>
                  <dd className="font-medium">{unit.project}</dd>
                </div>
                <div>
                  <dt className="text-muted text-base">المطور</dt>
                  <dd className="font-medium">{unit.developer}</dd>
                </div>
                <div>
                  <dt className="text-muted text-base">الموقع</dt>
                  <dd className="font-medium">{unit.location}</dd>
                </div>
                <div>
                  <dt className="text-muted text-base">عدد الغرف</dt>
                  <dd className="font-medium">{unit.rooms}</dd>
                </div>
                <div>
                  <dt className="text-muted text-base">المساحة</dt>
                  <dd className="font-medium">{unit.area}</dd>
                </div>
                <div>
                  <dt className="text-muted text-base">السعر</dt>
                  <dd className="font-medium">{unit.price}</dd>
                </div>
                <div>
                  <dt className="text-muted text-base">المقدم والتقسيط</dt>
                  <dd className="font-medium">{unit.downPayment}</dd>
                </div>
              </dl>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={telUrl}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-navy text-white py-3.5 px-5 font-medium hover:bg-navy/90 active:opacity-90 transition-colors touch-manipulation"
                  onClick={() => trackMetaContact(project.slug, "phone_unit_modal")}
                >
                  <Phone size={20} aria-hidden />
                  اتصال
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-3.5 px-5 font-medium hover:bg-[#20bd5a] active:opacity-90 transition-colors touch-manipulation"
                  onClick={() => trackMetaContact(project.slug, "whatsapp_unit_modal")}
                >
                  <MessageCircle size={20} aria-hidden />
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
