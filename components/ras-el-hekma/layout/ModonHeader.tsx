"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { formatPhoneDisplay, telHref } from "@/lib/phone-display";
import type { ProjectContent } from "@/types/project";
import { trackClick } from "@/lib/analytics";

interface ModonHeaderProps {
  project: ProjectContent;
  contactPhone: string;
  whatsappUrl: string;
}

export function ModonHeader({ project, contactPhone, whatsappUrl }: ModonHeaderProps) {
  const display = formatPhoneDisplay(contactPhone);
  const logoAlt = `${project.projectName} — ${project.developer}`;
  const tel = telHref(contactPhone);

  return (
    <motion.header
      className="sticky top-0 z-60 bg-[#0A4D68] shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* dir=ltr keeps column 1 = physical left (call), column 2 = centered logo */}
      <div
        dir="ltr"
        className="max-w-6xl mx-auto w-full grid grid-cols-3 items-center gap-2 sm:gap-4 py-3 px-4 sm:px-6"
      >
        <a
          dir="rtl"
          href={tel}
          className="justify-self-start inline-flex items-center justify-center min-h-11 px-4 sm:px-6 text-sm sm:text-base font-semibold text-white border-2 border-white bg-transparent rounded-none hover:bg-white hover:text-[#0A4D68] active:bg-white active:text-[#0A4D68] transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 whitespace-nowrap"
          aria-label={`اتصل بنا — ${display}`}
        >
          اتصل بنا
        </a>

        <div className="flex justify-center w-full min-w-0">
          <div className="relative h-11 w-40 sm:h-12 sm:w-48 max-w-[min(100%,12rem)] sm:max-w-52 shrink-0">
            <Image
              src="/raselhekmalogo.png"
              alt={logoAlt}
              fill
              sizes="(max-width: 640px) 10rem, 13rem"
              className="object-contain object-center"
              priority
            />
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(project.slug, "header_whatsapp")}
          className="justify-self-end inline-flex items-center justify-center gap-1.5 min-h-10 px-4 sm:px-5 text-sm font-semibold text-white bg-[#25D366] rounded-full hover:bg-[#20bd5a] active:bg-[#20bd5a] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 whitespace-nowrap"
          aria-label="تواصل عبر واتساب"
        >
          <MessageCircle size={16} className="shrink-0" aria-hidden strokeWidth={2} />
          <span className="hidden sm:inline">واتساب</span>
        </a>
      </div>
    </motion.header>
  );
}
