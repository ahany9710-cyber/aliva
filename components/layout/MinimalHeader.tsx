"use client";

import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";
import { trackMetaContact } from "@/lib/meta-contact";
import { formatPhoneDisplay, telHref } from "@/lib/phone-display";

interface MinimalHeaderProps {
  /** Used only for analytics labelling. */
  projectSlug?: string;
  /** Header logo path under /public. */
  logoSrc?: string;
  logoAlt?: string;
  /** WhatsApp number (E.164 digits, no plus). */
  whatsappNumber: string;
  /** Optional separate phone for tel:; falls back to whatsappNumber. */
  callPhone?: string;
  /** Pre-filled message for WhatsApp; if omitted, no text is appended. */
  whatsappInquiryMessage?: string;
  /** When true, header sits over the hero with a translucent dark style. */
  overHero?: boolean;
}

export function MinimalHeader({
  projectSlug = "site",
  logoSrc = "/Mountain View Logo.webp",
  logoAlt = "Mountain View",
  whatsappNumber,
  callPhone,
  whatsappInquiryMessage,
  overHero = false,
}: MinimalHeaderProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, whatsappInquiryMessage);
  const phoneForTel = callPhone ?? whatsappNumber;
  const tel = telHref(phoneForTel);
  const phoneDisplay = formatPhoneDisplay(phoneForTel);

  const barClass = overHero
    ? "border-b border-white/15 bg-navy/30 backdrop-blur-md supports-[backdrop-filter]:bg-navy/20"
    : "border-b border-navy/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80";

  return (
    <header className={`sticky top-0 z-40 w-full ${barClass}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center gap-2 sm:gap-3">
        <span className="relative inline-flex h-8 w-auto shrink-0">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={140}
            height={36}
            className={
              overHero
                ? "h-8 w-auto object-contain object-right brightness-0 invert"
                : "h-8 w-auto object-contain object-right"
            }
            priority
          />
        </span>

        <div className="ms-auto flex items-center gap-2">
          <a
            href={tel}
            aria-label={phoneDisplay ? `Call ${phoneDisplay}` : "Call us"}
            className={
              overHero
                ? "inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-md border border-white/40 bg-white/10 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                : "inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-md border border-navy/25 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-navy hover:border-navy/50 hover:bg-navy/5 transition-colors"
            }
            onClick={() => {
              trackClick(projectSlug, "header_phone");
              trackMetaContact(projectSlug, "phone_header");
            }}
          >
            <Phone size={16} strokeWidth={2.2} aria-hidden />
            <span className="hidden xs:inline">اتصل</span>
            {phoneDisplay ? (
              <span className="hidden sm:inline tabular-nums opacity-90">
                {phoneDisplay}
              </span>
            ) : null}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={() => {
              trackClick(projectSlug, "header_whatsapp");
              trackMetaContact(projectSlug, "whatsapp_header");
            }}
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-md bg-[#25D366] text-white px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle size={16} strokeWidth={2.2} aria-hidden />
            <span>واتساب</span>
          </a>
        </div>
      </div>
    </header>
  );
}
