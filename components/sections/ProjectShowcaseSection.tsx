"use client";

import Image from "next/image";
import { Phone, MessageCircle, MapPin, Wallet, Clock, Tag, Home, Maximize, BedDouble, Download } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { buildProjectWhatsAppUrl, buildWhatsAppUrl } from "@/lib/utils";
import { telHref } from "@/lib/phone-display";
import { fadeInUp, noMotion } from "@/lib/motion";
import type { ProjectContent } from "@/types/project";

interface ProjectShowcaseSectionProps {
  project: ProjectContent;
  /** Position index used to alternate background. */
  index?: number;
}

function arabicYears(n: number): string {
  return new Intl.NumberFormat("ar-EG").format(n);
}

export function ProjectShowcaseSection({ project, index = 0 }: ProjectShowcaseSectionProps) {
  const reduce = useReducedMotion();
  const v = reduce ? noMotion : fadeInUp;

  const tel = telHref(project.phoneNumber ?? project.whatsappNumber);
  const waInquiry = project.whatsappInquiryMessage
    ? buildWhatsAppUrl(project.whatsappNumber, project.whatsappInquiryMessage)
    : buildProjectWhatsAppUrl(
        { whatsappNumber: project.whatsappNumber, projectName: project.projectName },
        "inquiry"
      );

  const cover = project.cover ?? project.heroImage;
  const isAlt = index % 2 === 1;

  return (
    <section
      id={project.slug}
      aria-label={project.projectName}
      className={
        isAlt
          ? "relative bg-gradient-to-b from-slate-50/70 via-white to-slate-50/40 border-y border-navy/8"
          : "relative bg-white"
      }
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={v.initial}
          whileInView={v.animate}
          viewport={v.viewport}
          className="flex flex-wrap items-center gap-2 mb-3"
        >
          <Badge variant="hotLight">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-sky-700" aria-hidden />
              {project.city ?? project.developer}
            </span>
          </Badge>
          {project.offerBadge ? (
            <Badge variant="hotLight" className="border-amber-500/30">
              <span>{project.offerBadge}</span>
            </Badge>
          ) : null}
        </motion.div>

        <motion.h2
          initial={v.initial}
          whileInView={v.animate}
          viewport={v.viewport}
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy leading-tight"
        >
          {project.projectName}
        </motion.h2>
        <motion.p
          initial={v.initial}
          whileInView={v.animate}
          viewport={v.viewport}
          className="mt-2 text-base sm:text-lg text-muted leading-relaxed max-w-3xl"
        >
          {project.headline}
        </motion.p>

        {/* Cover image + KPI strip */}
        <div className="mt-7 grid lg:grid-cols-5 gap-5 lg:gap-7">
          <motion.div
            initial={v.initial}
            whileInView={v.animate}
            viewport={v.viewport}
            className="lg:col-span-3 relative aspect-[16/10] rounded-xl overflow-hidden border border-navy/10 shadow-sm bg-navy/5"
          >
            <Image
              src={cover}
              alt={project.projectName}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              quality={82}
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/55 to-transparent p-4">
              <p className="text-white text-sm font-medium drop-shadow">
                {project.location}
              </p>
            </div>
          </motion.div>

          <motion.aside
            initial={v.initial}
            whileInView={v.animate}
            viewport={v.viewport}
            className="lg:col-span-2 grid grid-cols-3 lg:grid-cols-1 gap-3"
          >
            <KpiCard
              icon={<Tag size={18} aria-hidden />}
              label="السعر يبدأ من"
              value={project.startingPrice}
            />
            <KpiCard
              icon={<Wallet size={18} aria-hidden />}
              label="مقدم الحجز"
              value={project.downPayment}
            />
            <KpiCard
              icon={<Clock size={18} aria-hidden />}
              label="التقسيط"
              value={`حتى ${arabicYears(project.installmentYears)} سنوات`}
            />
          </motion.aside>
        </div>

        {/* Description */}
        {project.subheadline ? (
          <motion.p
            initial={v.initial}
            whileInView={v.animate}
            viewport={v.viewport}
            className="mt-7 text-base sm:text-lg text-foreground/85 leading-relaxed max-w-3xl"
          >
            {project.subheadline}
          </motion.p>
        ) : null}

        {/* Unit cards */}
        {project.units && project.units.length > 0 ? (
          <div className="mt-8">
            <p className="section-label mb-3">تشكيلة الوحدات</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.units.map((u) => (
                <motion.article
                  key={u.type + u.image}
                  initial={v.initial}
                  whileInView={v.animate}
                  viewport={v.viewport}
                  className="group relative overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[5/4] overflow-hidden bg-navy/5">
                    <Image
                      src={u.image}
                      alt={u.type}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="px-4 py-3.5">
                    <p className="font-bold text-navy text-base">{u.type}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                      {u.rooms ? (
                        <span className="inline-flex items-center gap-1">
                          <BedDouble size={14} aria-hidden /> {u.rooms}
                        </span>
                      ) : null}
                      {u.area ? (
                        <span className="inline-flex items-center gap-1">
                          <Maximize size={14} aria-hidden /> {u.area}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-navy tabular-nums">{u.price}</p>
                    {u.payment ? (
                      <p className="mt-1 text-xs text-muted">{u.payment}</p>
                    ) : null}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        ) : null}

        {/* Amenities */}
        {project.amenities && project.amenities.length > 0 ? (
          <div className="mt-8">
            <p className="section-label mb-3">الخدمات والمرافق</p>
            <ul className="flex flex-wrap gap-2">
              {project.amenities.map((a) => (
                <li
                  key={a}
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy/12 bg-white px-3 py-1.5 text-sm text-navy"
                >
                  <Home size={14} className="text-sky-700" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* CTAs */}
        <motion.div
          initial={v.initial}
          whileInView={v.animate}
          viewport={v.viewport}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href={tel}
            className="inline-flex"
            aria-label={`اتصل عن ${project.projectName}`}
          >
            <Button size="lg" className="gap-2">
              <Phone size={18} aria-hidden />
              اتصل عن {project.projectName}
            </Button>
          </a>
          <a
            href={waInquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
            aria-label={`واتساب عن ${project.projectName}`}
          >
            <Button
              size="lg"
              className="gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-md"
            >
              <MessageCircle size={18} aria-hidden />
              واتساب
            </Button>
          </a>
          {project.brochureUrl ? (
            <a
              href={project.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              aria-label={`تحميل بروشور ${project.projectName} (PDF)`}
              className="inline-flex"
            >
              <Button
                variant="mv-outline"
                size="lg"
                className="gap-2 bg-white border-navy/25"
              >
                <Download size={18} aria-hidden />
                حمّل البروشور
              </Button>
            </a>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-navy/10 bg-white p-3 lg:p-4 text-center lg:text-right">
      <div className="flex items-center justify-center lg:justify-start gap-1.5 text-sky-700 mb-1">
        {icon}
        <span className="text-[0.68rem] lg:text-xs uppercase tracking-wide text-muted font-semibold">
          {label}
        </span>
      </div>
      <p className="font-bold text-navy text-sm lg:text-base leading-tight">{value}</p>
    </div>
  );
}
