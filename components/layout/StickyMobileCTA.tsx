"use client";

import { MessageCircle, Phone } from "lucide-react";
import { buildProjectWhatsAppUrl, buildWhatsAppUrl } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";

interface StickyMobileCTAProps {
  projectSlug: string;
  whatsappNumber: string;
  ctaText: string;
  projectName?: string;
}

export function StickyMobileCTA({
  projectSlug,
  whatsappNumber,
  ctaText,
  projectName,
}: StickyMobileCTAProps) {
  const whatsappUrl = projectName
    ? buildProjectWhatsAppUrl({ whatsappNumber, projectName }, "inquiry")
    : buildWhatsAppUrl(whatsappNumber);
  const callUrl = `tel:+${whatsappNumber.replace(/\D/g, "")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] p-4 bg-background/95 backdrop-blur border-t border-navy/10 md:hidden">
      <div className="max-w-lg mx-auto flex gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(projectSlug, "cta_whatsapp")}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-3 px-4 font-medium text-sm hover:bg-[#20bd5a] transition-colors"
        >
          <MessageCircle size={18} aria-hidden />
          WhatsApp
        </a>
        <a
          href={callUrl}
          onClick={() => trackClick(projectSlug, "cta_call")}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-white py-3 px-4 font-medium text-sm shadow-md hover:opacity-90 transition-opacity"
        >
          <Phone size={18} aria-hidden />
          {ctaText}
        </a>
      </div>
    </div>
  );
}
