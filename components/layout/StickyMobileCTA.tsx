"use client";

import { MessageCircle, Phone } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";
import { trackMetaContact } from "@/lib/meta-contact";
import { telHref } from "@/lib/phone-display";

interface StickyMobileCTAProps {
  whatsappNumber: string;
  /** Number for tel: (defaults to whatsappNumber when omitted). */
  callPhone?: string;
  /** Optional pre-filled message for the WhatsApp link. */
  whatsappMessage?: string;
  /** Used only for analytics labelling. */
  projectSlug?: string;
  /** Label of the call button (e.g. "اتصل بنا"). */
  callLabel?: string;
}

export function StickyMobileCTA({
  whatsappNumber,
  callPhone,
  whatsappMessage,
  projectSlug = "site",
  callLabel = "اتصل بنا",
}: StickyMobileCTAProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, whatsappMessage);
  const callUrl = telHref(callPhone ?? whatsappNumber);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] p-3 bg-background/95 backdrop-blur border-t border-navy/10 md:hidden">
      <div className="max-w-lg mx-auto flex gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackClick(projectSlug, "cta_whatsapp");
            trackMetaContact(projectSlug, "whatsapp_sticky");
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white py-3 px-4 font-semibold text-sm hover:bg-[#20bd5a] transition-colors min-h-[48px]"
        >
          <MessageCircle size={18} aria-hidden />
          واتساب
        </a>
        <a
          href={callUrl}
          onClick={() => {
            trackClick(projectSlug, "cta_call");
            trackMetaContact(projectSlug, "phone_sticky");
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-navy text-white py-3 px-4 font-semibold text-sm shadow-md hover:bg-navy/90 transition-colors min-h-[48px]"
        >
          <Phone size={18} aria-hidden />
          {callLabel}
        </a>
      </div>
    </div>
  );
}
