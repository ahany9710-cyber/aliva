"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Anchor,
  Compass,
  Landmark,
  MapPinned,
  Palmtree,
  Phone,
  Ship,
  TreePine,
  X,
} from "lucide-react";
import type { ProjectContent } from "@/types/project";
import { fadeInUp, noMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { formatPhoneDisplay, telHref } from "@/lib/phone-display";
import { trackClick } from "@/lib/analytics";
import styles from "./about-section.module.css";

interface AboutSectionProps {
  project: ProjectContent;
  contactPhone: string;
  projectSlug: string;
}

const CHIPS = [
  {
    id: "coastal-life",
    Icon: Palmtree,
    label: "حياة ساحلية",
    title: "حياة ساحلية معاصرة",
    description:
      "تجمع راس الحكمة بين طاقة الحياة الحضرية وجمال العيش على الشاطئ، مع شوارع مشاة وإطلالات بحرية وتجربة يومية متصلة بالماء والسماء المفتوحة.",
  },
  {
    id: "marina",
    Icon: Ship,
    label: "مرسى يخوت",
    title: "مرسى يخوت",
    description:
      "تُخطط المدينة لتجربة بحرية متكاملة تشمل مراسي وربطاً بحراً ضمن رؤية ساحلية طويلة الأمد — للاستفسار عن التفاصيل والمراحل يمكنكم التواصل مع فريق المبيعات.",
  },
  {
    id: "coastline",
    Icon: Anchor,
    label: "شريط ساحلي",
    title: "شريط ساحلي يمتد لعشرات الكيلومترات",
    description:
      "يمتد شاطئ رأس الحكمة لنحو ٤٤ كيلومتراً على البحر المتوسط، ما يمنح أحياء المشروع علاقة مباشرة ومستدامة مع البحر ضمن تخطيط يخدم السكن والتنزه والأنشطة الساحلية.",
  },
  {
    id: "green",
    Icon: TreePine,
    label: "مساحات خضراء",
    title: "مساحات خضراء وممرات طبيعية",
    description:
      "تحرص التصاميم على اندماج المساحات الخضراء والممرات المائية في نسيج المدينة، لتحقيق توازن بين العمران والعافية والهواء الطلق في أحياء مثل وادي يم والمراحل القادمة.",
  },
] as const;

export function AboutSection({ project, contactPhone, projectSlug }: AboutSectionProps) {
  const reducedMotion = useReducedMotion();
  const v = reducedMotion ? noMotion : fadeInUp;
  const aboutSrc = project.aboutImage;
  const [openId, setOpenId] = useState<(typeof CHIPS)[number]["id"] | null>(null);
  const titleId = useId();
  const descId = useId();
  const tel = telHref(contactPhone);
  const callLabel = formatPhoneDisplay(contactPhone);

  const active = openId ? CHIPS.find((c) => c.id === openId) ?? null : null;

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
    <section className={cn(styles.sandy, "py-12 md:py-16 overflow-hidden")}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={cn(
            aboutSrc &&
              "flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-14 lg:items-stretch"
          )}
        >
          <motion.div
            className={cn(!aboutSrc && "max-w-4xl")}
            initial={v.initial}
            whileInView={v.animate}
            viewport={v.viewport}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex p-2 bg-[#0A4D68] text-[#1BA8C8] shrink-0">
                <Landmark size={24} strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A4D68] uppercase tracking-wide">
                راس الحكمة
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {CHIPS.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setOpenId(id)}
                  aria-haspopup="dialog"
                  aria-expanded={openId === id}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#0D2E3D] bg-white/80 border border-[#0A4D68]/15 px-3 py-2 shadow-sm hover:border-[#1BA8C8]/60 hover:bg-white active:bg-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1BA8C8] focus-visible:outline-offset-2"
                >
                  <Icon className="text-[#1BA8C8] shrink-0" size={18} strokeWidth={2} aria-hidden />
                  {label}
                </button>
              ))}
            </div>

            <p className="text-base md:text-lg leading-relaxed text-[#0D2E3D] whitespace-pre-line">
              {project.description}
            </p>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-[#0D2E3D] flex gap-2 items-start">
              <MapPinned className="text-[#1BA8C8] shrink-0 mt-1" size={20} aria-hidden />
              <span>{project.location}</span>
            </p>
          </motion.div>

          {aboutSrc ? (
            <motion.div
              className={cn(
                "relative isolate min-h-[200px] sm:min-h-[260px]",
                "h-[min(52vw,380px)] sm:h-[min(48vw,400px)] lg:h-full lg:min-h-[440px]",
                "-mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full",
                "overflow-hidden bg-[#0A4D68]/10 ring-1 ring-inset ring-[#0A4D68]/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              )}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.985, x: -22 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={aboutSrc}
                alt=""
                fill
                className="object-cover object-[center_38%] sm:object-[center_40%]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                quality={82}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0A4D68]/25 via-transparent to-transparent"
                aria-hidden
              />
              <motion.div
                className="absolute top-4 inset-s-4 bg-[#0A4D68]/90 text-white p-3 border border-white/30 shadow-lg"
                initial={reducedMotion ? false : { opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.45 }}
                aria-hidden
              >
                <Compass size={26} strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          ) : null}
        </div>
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
