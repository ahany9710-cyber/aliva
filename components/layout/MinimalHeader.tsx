"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildProjectWhatsAppUrl, buildWhatsAppUrl } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";
import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";

interface MinimalHeaderProps {
  projectSlug: string;
  projectName?: string;
  whatsappNumber: string;
  /** Optional custom pre-filled message for the WhatsApp link. When set, overrides the default inquiry message. */
  whatsappInquiryMessage?: string;
  /** When set (e.g. for mountainview), show this logo instead of the Beitlee link and do not make it clickable. */
  logoSrc?: string;
  logoAlt?: string;
  /** When true, use a translucent bar so hero video blends through (over hero). */
  overHero?: boolean;
}

export function MinimalHeader({ projectSlug, projectName, whatsappNumber, whatsappInquiryMessage, logoSrc, logoAlt, overHero }: MinimalHeaderProps) {
  const mvLanding = isMountainViewLandingSlug(projectSlug);
  const whatsappUrl = whatsappInquiryMessage
    ? buildWhatsAppUrl(whatsappNumber, whatsappInquiryMessage)
    : projectName
      ? buildProjectWhatsAppUrl({ whatsappNumber, projectName }, "inquiry")
      : buildWhatsAppUrl(whatsappNumber);

  return (
    <header
      className={
        overHero
          ? "sticky top-0 z-40 w-full border-b border-white/20 bg-white/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/50"
          : "sticky top-0 z-40 w-full border-b border-navy/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      }
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {logoSrc ? (
          <span className="relative inline-block h-8 w-auto">
            <Image
              src={logoSrc}
              alt={logoAlt ?? projectName ?? "Logo"}
              width={120}
              height={32}
              className="h-8 w-auto object-contain object-left"
            />
          </span>
        ) : (
          <Link href="/" className="font-semibold text-navy text-lg">
            Beitlee
          </Link>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(projectSlug, "header_whatsapp")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white px-4 py-2 text-base font-medium hover:bg-[#20bd5a] transition-colors"
        >
          {mvLanding ? (
            <Image
              src="/mountainview-emblem-white.webp"
              alt=""
              width={18}
              height={18}
              className="shrink-0 object-contain"
              aria-hidden
            />
          ) : (
            <MessageCircle size={18} aria-hidden />
          )}
          <span>واتســاب</span>
        </a>
      </div>
    </header>
  );
}
