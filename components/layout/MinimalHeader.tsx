"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { buildProjectWhatsAppUrl, buildWhatsAppUrl } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";
import { trackMetaContact } from "@/lib/meta-contact";
import { isAlivaLandingSlug } from "@/lib/aliva-landing";
import { formatPhoneDisplay, telHref } from "@/lib/phone-display";

interface MinimalHeaderProps {
  projectSlug: string;
  projectName?: string;
  whatsappNumber: string;
  /** Display / tel: number (defaults to whatsappNumber when omitted). */
  callPhone?: string;
  /** Label for the register-interest control (e.g. project.leadFormCtaText). */
  registerInterestLabel?: string;
  /** Optional custom pre-filled message for the WhatsApp link. When set, overrides the default inquiry message. */
  whatsappInquiryMessage?: string;
  logoSrc?: string;
  logoAlt?: string;
  /** When true, use a translucent bar so hero video blends through (over hero). */
  overHero?: boolean;
  /** Mountain View–style header: phone + register interest instead of WhatsApp-only. */
  mvStyle?: boolean;
}

export function MinimalHeader({
  projectSlug,
  projectName,
  whatsappNumber,
  callPhone,
  registerInterestLabel = "سجّل اهتمامك",
  whatsappInquiryMessage,
  logoSrc,
  logoAlt,
  overHero,
  mvStyle = false,
}: MinimalHeaderProps) {
  const mvLanding = isAlivaLandingSlug(projectSlug);
  const whatsappUrl = whatsappInquiryMessage
    ? buildWhatsAppUrl(whatsappNumber, whatsappInquiryMessage)
    : projectName
      ? buildProjectWhatsAppUrl({ whatsappNumber, projectName }, "inquiry")
      : buildWhatsAppUrl(whatsappNumber);

  const phoneForTel = callPhone ?? whatsappNumber;
  const tel = telHref(phoneForTel);
  const phoneDisplay = formatPhoneDisplay(phoneForTel);

  const onHero = overHero && mvStyle;
  const barOnHero = onHero
    ? "border-b border-white/20 bg-navy/20 backdrop-blur-md supports-[backdrop-filter]:bg-navy/15"
    : overHero
      ? "border-b border-white/20 bg-white/60 backdrop-blur-md supports-[backdrop-filter]:bg-white/50"
      : "border-b border-navy/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80";

  if (mvStyle) {
    return (
      <header className={`sticky top-0 z-40 w-full ${barOnHero}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          {logoSrc ? (
            <span className="relative inline-block h-8 w-auto shrink-0">
              <Image
                src={logoSrc}
                alt={logoAlt ?? projectName ?? "Logo"}
                width={140}
                height={36}
                className={
                  onHero
                    ? "h-8 w-auto object-contain brightness-0 invert"
                    : "h-8 w-auto object-contain object-left"
                }
              />
            </span>
          ) : (
            <Link
              href="/"
              className={
                onHero ? "font-semibold text-white text-lg shrink-0" : "font-semibold text-navy text-lg shrink-0"
              }
            >
              Beitlee
            </Link>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 ms-auto">
            {phoneDisplay ? (
              <a
                href={tel}
                aria-label={phoneDisplay ? `Call ${phoneDisplay}` : "Call us"}
                className={
                  onHero
                    ? "inline-flex min-h-[40px] items-center justify-center gap-2 rounded border border-white/50 bg-white/5 px-3.5 py-2 text-sm font-semibold tracking-wide text-white shadow-sm backdrop-blur-[2px] transition-colors hover:border-white hover:bg-white/15"
                    : "inline-flex min-h-[40px] items-center justify-center gap-2 rounded border border-navy/25 bg-white px-3.5 py-2 text-sm font-semibold tracking-wide text-navy shadow-sm transition-colors hover:border-navy/50 hover:bg-navy/5"
                }
                onClick={() => {
                  trackClick(projectSlug, "header_phone");
                  trackMetaContact(projectSlug, "phone_header");
                }}
              >
                <Phone size={18} strokeWidth={2} className="shrink-0 opacity-95" aria-hidden />
                <span className="leading-none">Call us</span>
              </a>
            ) : null}
            <a
              href="#lead-form"
              className={
                onHero
                  ? "inline-flex min-h-[40px] items-center justify-center border border-white px-3.5 py-2 text-sm font-semibold tracking-wide text-white transition-colors rounded hover:bg-white/10"
                  : "inline-flex min-h-[40px] items-center justify-center border border-navy px-3.5 py-2 text-sm font-semibold tracking-wide text-navy transition-colors rounded hover:bg-navy hover:text-white"
              }
              onClick={() => trackClick(projectSlug, "header_register_interest")}
            >
              {registerInterestLabel}
            </a>
          </div>
        </div>
      </header>
    );
  }

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
          onClick={() => {
            trackClick(projectSlug, "header_whatsapp");
            trackMetaContact(projectSlug, "whatsapp_header");
          }}
          className="inline-flex items-center gap-2 rounded bg-[#25D366] text-white px-4 py-2 text-base font-medium hover:bg-[#20bd5a] transition-colors"
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
