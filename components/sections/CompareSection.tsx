"use client";

import { Phone, MessageCircle, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { buildProjectWhatsAppUrl } from "@/lib/utils";
import { telHref } from "@/lib/phone-display";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";

interface CompareSectionProps {
  projects: ProjectContent[];
}

function arabicYears(n: number): string {
  return new Intl.NumberFormat("ar-EG").format(n);
}

export function CompareSection({ projects }: CompareSectionProps) {
  const reduce = useReducedMotion();
  const v = reduce ? noMotion : fadeInUp;

  return (
    <SectionWrapper id="compare" className="bg-gradient-to-b from-white via-slate-50/40 to-white">
      <motion.p
        initial={v.initial}
        whileInView={v.animate}
        viewport={v.viewport}
        className="section-label mb-2 text-center"
      >
        قارن في ٣٠ ثانية
      </motion.p>
      <motion.h2
        initial={v.initial}
        whileInView={v.animate}
        viewport={v.viewport}
        className="text-2xl sm:text-3xl font-bold text-navy mb-8 text-center"
      >
        أيهم يناسب ميزانيتك؟
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((p, i) => {
          const tel = telHref(p.phoneNumber ?? p.whatsappNumber);
          const wa = buildProjectWhatsAppUrl(
            { whatsappNumber: p.whatsappNumber, projectName: p.projectName },
            "pricing"
          );
          return (
            <motion.article
              key={p.slug}
              initial={v.initial}
              whileInView={v.animate}
              viewport={v.viewport}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                {p.developer}
              </p>
              <h3 className="mt-1 text-lg font-bold text-navy">{p.projectName}</h3>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted">
                <MapPin size={14} className="text-sky-700" aria-hidden />
                {p.city ?? p.location.split(/[—.]/)[0]}
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="السعر يبدأ من" value={p.startingPrice} />
                <Row label="مقدم الحجز" value={p.downPayment} />
                <Row label="التقسيط" value={`حتى ${arabicYears(p.installmentYears)} سنوات`} />
                <Row label="نوع الوحدات" value={p.propertyTypes.join(" · ")} />
              </dl>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <a
                  href={tel}
                  className="inline-flex items-center justify-center gap-1.5 rounded bg-navy text-white py-2.5 text-sm font-semibold hover:bg-navy/90 transition-colors"
                  aria-label={`اتصل عن ${p.projectName}`}
                >
                  <Phone size={16} aria-hidden />
                  اتصل
                </a>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded bg-[#25D366] text-white py-2.5 text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
                  aria-label={`واتساب عن ${p.projectName}`}
                >
                  <MessageCircle size={16} aria-hidden />
                  واتساب
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-navy/8 pb-1.5 last:border-0">
      <dt className="text-muted whitespace-nowrap shrink-0">{label}</dt>
      <dd className="font-medium text-navy text-end">{value}</dd>
    </div>
  );
}
