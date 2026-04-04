"use client";

import { useCallback, useEffect, useId, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Layers3, MapPinned, Phone, Waves, X } from "lucide-react";
import { fadeInUpStagger, noMotionStagger } from "@/lib/motion";
import { formatPhoneDisplay, telHref } from "@/lib/phone-display";
import { trackClick } from "@/lib/analytics";

const STATS = [
  {
    id: "coast",
    number: "٤٤",
    label: "كيلومتر عرض الشاطئ",
    Icon: Waves,
    title: "شريط ساحلي يمتد لنحو ٤٤ كيلومتراً",
    description:
      "يمتد شاطئ رأس الحكمة لنحو ٤٤ كيلومتراً على البحر الأبيض المتوسط، ما يمنح المدينة وجهاً بحرياً طويلاً لمراسٍ وشواطئ وتجارب ساحلية متنوعة ضمن تخطيط حضري متجدد.",
  },
  {
    id: "districts",
    number: "١٧",
    label: "حيّاً مميزاً",
    Icon: Layers3,
    title: "١٧ حيّاً مصمماً بعناية",
    description:
      "صُممت المدينة حول ١٧ حيّاً يجمع بين الهدوء والحيوية، حيث تلتقي الراحة والتصميم الأنيق مع مدارس ومرافق أعمال وعافية ومراسٍ ومساحات خضراء وربطٍ مستقبلي للتنقل.",
  },
  {
    id: "wadi-yem",
    number: "وادي يم",
    label: "أول الأحياء",
    Icon: MapPinned,
    title: "وادي يم — بداية الرحلة",
    description:
      "وادي يم هو أول حيّ يُطرح ضمن راس الحكمة: أسلوب حياة ساحلي مستوحى من البحر المتوسط مع شوارع للمشاة ومساحات خضراء وممرات مائية، بإيقاع أهدأ لعيش عصري على البحر.",
  },
] as const;

interface KeyFactsBarProps {
  contactPhone: string;
  projectSlug: string;
}

export function KeyFactsBar({ contactPhone, projectSlug }: KeyFactsBarProps) {
  const reducedMotion = useReducedMotion();
  const stagger = reducedMotion ? noMotionStagger : fadeInUpStagger;
  const [openId, setOpenId] = useState<(typeof STATS)[number]["id"] | null>(
    null
  );
  const titleId = useId();
  const descId = useId();
  const tel = telHref(contactPhone);
  const callLabel = formatPhoneDisplay(contactPhone);

  const active = openId
    ? STATS.find((s) => s.id === openId) ?? null
    : null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!openId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, close]);

  return (
    <section className="bg-[#0A4D68] py-8 md:py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col md:flex-row md:divide-x md:divide-x-reverse md:divide-white/20"
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {STATS.map(({ id, number, label, Icon }) => (
            <motion.div
              key={id}
              variants={stagger.item}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="flex-1 border-b md:border-b-0 border-white/20 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setOpenId(id)}
                className="w-full text-center px-4 md:px-6 py-6 md:py-2 cursor-pointer rounded-none hover:bg-white/5 active:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#1BA8C8] focus-visible:outline-offset-2"
                aria-haspopup="dialog"
                aria-expanded={openId === id}
              >
                <div className="inline-flex w-12 h-12 items-center justify-center mx-auto mb-3 rounded-full bg-white/10 border border-white/20 pointer-events-none">
                  <Icon size={26} className="text-[#1BA8C8]" strokeWidth={1.75} aria-hidden />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-[#1BA8C8] leading-none mb-2 pointer-events-none">
                  {number}
                </p>
                <p className="text-sm sm:text-base text-white/90 leading-snug pointer-events-none">
                  {label}
                </p>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:p-4"
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
              transition={{
                type: "spring",
                damping: 32,
                stiffness: 320,
              }}
              className="relative z-[1] w-full max-w-lg bg-[#F2EDE4] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#0A4D68]/10 max-h-[min(88dvh,92vh)] flex flex-col"
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
