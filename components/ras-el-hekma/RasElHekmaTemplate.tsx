"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import type { ProjectContent } from "@/types/project";
import type { NextSearchParams } from "@/types/next";
import { buildProjectWhatsAppUrl, buildWhatsAppUrl } from "@/lib/utils";
import rehStyles from "./reh-scope.module.css";
import { ModonHeader } from "./layout/ModonHeader";
import { AlwaysVisiblePhoneBar } from "./layout/AlwaysVisiblePhoneBar";
import { FullscreenHero } from "./sections/FullscreenHero";
import { KeyFactsBar } from "./sections/KeyFactsBar";
import { AboutSection } from "./sections/AboutSection";
import { WadiYemmSection } from "./sections/WadiYemmSection";
import { WhySection } from "./sections/WhySection";
import { SimpleContactForm } from "./sections/SimpleContactForm";

interface RasElHekmaTemplateProps {
  project: ProjectContent;
  searchParams?: NextSearchParams;
  /** Effective call / display number (admin override or project default). */
  contactPhone: string;
  /** WhatsApp number for wa.me links (admin override or project default). */
  contactWhatsapp: string;
}

/**
 * Ras El Hekma — Modon visual identity + scroll progress and animated sections.
 */
export function RasElHekmaTemplate({
  project,
  searchParams,
  contactPhone,
  contactWhatsapp,
}: RasElHekmaTemplateProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
  const whatsappUrl = project.whatsappInquiryMessage
    ? buildWhatsAppUrl(contactWhatsapp, project.whatsappInquiryMessage)
    : buildProjectWhatsAppUrl(
        { whatsappNumber: contactWhatsapp, projectName: project.projectName },
        "inquiry"
      );

  return (
    <div className={rehStyles.reh} lang="ar" dir="rtl">
      <motion.div
        aria-hidden
        className="fixed top-19 left-0 right-0 h-[3px] bg-[#1BA8C8] z-61 origin-right pointer-events-none"
        style={{ scaleX }}
      />
      <ModonHeader
        project={project}
        contactPhone={contactPhone}
        whatsappUrl={whatsappUrl}
      />
      <main className="pb-24 md:pb-8">
        <FullscreenHero
          project={project}
          contactPhone={contactPhone}
          whatsappUrl={whatsappUrl}
        />
        <KeyFactsBar contactPhone={contactPhone} projectSlug={project.slug} />
        <AboutSection
          project={project}
          contactPhone={contactPhone}
          projectSlug={project.slug}
        />
        <WadiYemmSection project={project} />
        <WhySection
          project={project}
          contactPhone={contactPhone}
          projectSlug={project.slug}
        />
        <SimpleContactForm
          project={project}
          searchParams={searchParams}
          whatsappUrl={whatsappUrl}
        />
      </main>
      <AlwaysVisiblePhoneBar
        projectSlug={project.slug}
        contactPhone={contactPhone}
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
