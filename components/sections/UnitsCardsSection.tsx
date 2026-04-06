"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  X,
  Phone,
  MessageCircle,
  Home,
  Maximize,
  Banknote,
  MapPin,
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { ProjectContent } from "@/types/project";
import { trackMetaContact } from "@/lib/meta-contact";
import { ALIVA_UNIT_CARD_LABELS } from "@/lib/aliva-units";

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

const cardTap = { scale: 0.97 };
const cardHover = { y: -6, transition: { type: "spring" as const, stiffness: 400, damping: 22 } };

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
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      className="shrink-0 w-[calc(50vw-1.5rem)] sm:w-[280px] md:w-[360px] snap-start snap-always"
    >
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={reduceMotion ? undefined : cardTap}
        whileHover={reduceMotion ? undefined : cardHover}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="group w-full text-right block overflow-hidden rounded-xl border border-navy/12 bg-white shadow-[0_8px_30px_rgba(11,31,58,0.08)] ring-1 ring-navy/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2"
      >
        <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-navy/[0.07] to-sky-50/40">
          {!imageError && imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 280px, 360px"
              quality={75}
              onError={() => setImageError(true)}
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl font-bold text-navy/15"
              aria-hidden
            >
              {index}
            </span>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
        </div>
        <div className="border-t border-navy/8 bg-gradient-to-b from-white to-slate-50/80 px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="font-bold text-navy text-base sm:text-lg leading-snug group-hover:text-sky-800 transition-colors">
            {title}
          </p>
          <span
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-sky-800"
            aria-hidden
          >
            <span>عرض التفاصيل</span>
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          </span>
        </div>
      </motion.button>
    </motion.article>
  );
}

interface UnitsCardsSectionProps {
  project: ProjectContent;
  contactPhone?: string;
  contactWhatsapp?: string;
}

const SCROLL_EPS = 2;

const backdropVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

const contentStagger = {
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const rowFade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function UnitsCardsSection({ project, contactPhone, contactWhatsapp }: UnitsCardsSectionProps) {
  const phone = contactPhone ?? project.phoneNumber ?? project.whatsappNumber;
  const whatsapp = contactWhatsapp ?? project.whatsappNumber;
  const scrollRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerInView = useInView(bannerRef, { once: true, margin: "0px 0px -60px 0px" });
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
    `مرحباً، أريد الاستفسار عن الوحدة: ${ALIVA_UNIT_CARD_LABELS[selectedUnit as number]} - المشروع ${unit.project}`;
  const whatsappUrl = project
    ? buildWhatsAppUrl(whatsapp, whatsappMessage ?? undefined)
    : "#";
  const telUrl = project ? `tel:+${phone.replace(/\D/g, "")}` : "#";

  return (
    <SectionWrapper
      id="units"
      className="py-8 md:py-10 rounded-xl border border-navy/8 bg-gradient-to-b from-slate-50/60 via-white to-sky-50/30"
    >
      <p className="text-center text-muted text-sm md:text-base mb-1">اختر وحدة</p>
      <h2 className="text-center text-lg md:text-xl font-bold text-navy mb-5">تشكيلة الوحدات المتاحة</h2>
      <div className="relative group/units">
        {/* ───── Hot Offer Banner ───── */}
        <motion.div
          ref={bannerRef}
          role="note"
          initial={{ opacity: 0, y: 18 }}
          animate={bannerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-5 overflow-hidden rounded-xl bg-navy shadow-[0_8px_32px_rgba(11,31,58,0.22)] ring-1 ring-white/6 transition-shadow duration-300 ease-out group-hover/units:shadow-[0_14px_40px_rgba(11,31,58,0.32)]"
        >
          {/* amber top accent line — draws RTL on entrance */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={bannerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 h-[3px] origin-right bg-gradient-to-l from-amber-600 via-amber-400 to-amber-500/55"
          />

          <div className="px-4 pb-4 pt-[18px] md:px-5 md:pb-5">
            {/* label row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={bannerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="mb-3.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-amber-400">
                <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-70 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
                عرض حصري — لفترة محدودة
              </span>
              <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-0.5 text-[0.6rem] font-semibold text-white/40">
                أليڤا · ماونتن ڤيو
              </span>
            </motion.div>

            {/* two stats */}
            <div className="grid grid-cols-[1fr_1px_1fr] items-center gap-2">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={bannerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[1.65rem] font-extrabold leading-none tabular-nums tracking-tight text-white md:text-[2rem]">
                  ١٠٠ ألف
                </p>
                <p className="mt-1.5 text-xs font-medium text-white/55">
                  جنيه — مقدم الحجز
                </p>
              </motion.div>

              <motion.div
                aria-hidden
                className="h-9 w-px self-center bg-white/12 md:h-11"
                initial={{ scaleY: 0 }}
                animate={bannerInView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.52 }}
              />

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={bannerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[1.65rem] font-extrabold leading-none tabular-nums tracking-tight text-white md:text-[2rem]">
                  ١٢ سنة
                </p>
                <p className="mt-1.5 text-xs font-medium text-white/55">
                  أقصى مدة تقسيط
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-3 -mx-4 ps-4 pe-2 md:-mx-6 md:ps-6 md:pe-4 scrollbar-hide transition-[filter] duration-200 group-hover/units:[&_article]:brightness-[1.015]"
          aria-label="قائمة الوحدات — اسحب لعرض البطاقات"
        >
          {[1, 2, 3].map((i) => (
            <UnitCard
              key={i}
              index={i}
              imageSrc={UNIT_IMAGES[i - 1]}
              title={ALIVA_UNIT_CARD_LABELS[i]}
              onClick={() => setSelectedUnit(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll("prev")}
          disabled={scrollBounds.atStart}
          aria-label="البطاقة السابقة"
          className="absolute top-1/2 -translate-y-1/2 right-0 w-11 h-11 rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors z-10 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight size={20} />
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          disabled={scrollBounds.atEnd}
          aria-label="البطاقة التالية"
          className="absolute top-1/2 -translate-y-1/2 left-0 w-11 h-11 rounded-full bg-white/95 shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors z-10 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <AnimatePresence>
        {selectedUnit !== null && unit ? (
          <motion.div
            key="unit-modal"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setSelectedUnit(null)}
            role="dialog"
            aria-modal
            aria-labelledby="unit-modal-title"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0.88 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { type: "spring", stiffness: 320, damping: 32 },
              }}
              exit={{ y: "100%", opacity: 0.92, transition: { duration: 0.22 } }}
              className="relative w-full max-w-lg sm:max-w-md overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-navy/10"
              style={{ maxHeight: "min(88dvh, calc(100vh - 72px))" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 z-20 h-1.5 bg-gradient-to-l from-navy via-sky-700 to-sky-500" aria-hidden />

              <button
                type="button"
                onClick={() => setSelectedUnit(null)}
                className="absolute top-4 left-4 z-30 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white shadow-md border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white touch-manipulation"
                aria-label="إغلاق"
              >
                <X size={22} strokeWidth={2.5} />
              </button>

              <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-navy">
                {!modalImageError ? (
                  <Image
                    src={UNIT_IMAGES[selectedUnit - 1]}
                    alt=""
                    fill
                    className="object-cover opacity-95"
                    sizes="(max-width: 448px) 100vw, 448px"
                    quality={75}
                    onError={() => setModalImageError(true)}
                  />
                ) : (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/25"
                    aria-hidden
                  >
                    {selectedUnit}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-5 pt-12 text-white">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/70">أليڤا · ماونتن ڤيو</p>
                  <h2 id="unit-modal-title" className="text-xl sm:text-2xl font-bold leading-tight mt-1">
                    {ALIVA_UNIT_CARD_LABELS[selectedUnit]}
                  </h2>
                </div>
              </div>

              <motion.div
                className="overflow-y-auto overflow-x-hidden px-5 pb-6 pt-2 max-h-[min(52dvh,420px)] sm:max-h-none [-webkit-overflow-scrolling:touch]"
                variants={contentStagger}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={rowFade} className="mt-4 rounded-lg border border-navy/10 bg-gradient-to-br from-slate-50 to-white p-4">
                  <p className="text-xs text-muted mb-1 flex items-center gap-1.5">
                    <Banknote size={14} className="text-sky-700" aria-hidden />
                    السعر يبدأ من
                  </p>
                  <p className="text-2xl font-bold text-navy tabular-nums">{unit.price}</p>
                  <p className="text-sm text-muted mt-2 border-t border-navy/10 pt-2">{unit.downPayment}</p>
                </motion.div>

                <motion.div
                  variants={rowFade}
                  className="mt-4 grid grid-cols-2 gap-3"
                >
                  <div className="rounded-lg border border-navy/10 bg-white p-3 text-center shadow-sm">
                    <Home className="mx-auto mb-1 text-sky-700" size={20} aria-hidden />
                    <p className="text-xs text-muted">الغرف</p>
                    <p className="font-semibold text-navy text-sm mt-0.5">{unit.rooms}</p>
                  </div>
                  <div className="rounded-lg border border-navy/10 bg-white p-3 text-center shadow-sm">
                    <Maximize className="mx-auto mb-1 text-sky-700" size={20} aria-hidden />
                    <p className="text-xs text-muted">المساحة</p>
                    <p className="font-semibold text-navy text-sm mt-0.5">{unit.area}</p>
                  </div>
                </motion.div>

                <motion.div variants={rowFade} className="mt-4 flex items-start gap-2 rounded-lg border border-navy/8 bg-navy/[0.03] p-3">
                  <MapPin className="shrink-0 text-sky-700 mt-0.5" size={18} aria-hidden />
                  <div>
                    <p className="text-xs text-muted">الموقع</p>
                    <p className="text-sm font-medium text-navy leading-snug">{unit.location}</p>
                    <p className="text-xs text-muted mt-1">
                      {unit.project} · {unit.developer}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={rowFade} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    href={telUrl}
                    className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-navy text-white py-3 px-4 font-semibold hover:bg-navy/90 transition-colors touch-manipulation"
                    onClick={() => trackMetaContact(project.slug, "phone_unit_modal")}
                  >
                    <Phone size={20} aria-hidden />
                    اتصال
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white py-3 px-4 font-semibold hover:bg-[#20bd5a] transition-colors touch-manipulation"
                    onClick={() => trackMetaContact(project.slug, "whatsapp_unit_modal")}
                  >
                    <MessageCircle size={20} aria-hidden />
                    واتساب
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionWrapper>
  );
}
