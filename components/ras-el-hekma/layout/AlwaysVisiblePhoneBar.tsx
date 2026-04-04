"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { telHref, formatPhoneDisplay } from "@/lib/phone-display";
import { trackClick } from "@/lib/analytics";

interface AlwaysVisiblePhoneBarProps {
  projectSlug: string;
  contactPhone: string;
  whatsappUrl: string;
}

export function AlwaysVisiblePhoneBar({
  projectSlug,
  contactPhone,
  whatsappUrl,
}: AlwaysVisiblePhoneBarProps) {
  const display = formatPhoneDisplay(contactPhone);

  return (
    <motion.div
      className="fixed bottom-0 inset-x-0 z-50 bg-[#0A4D68]/95 backdrop-blur-sm border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.2)] md:hidden pb-[env(safe-area-inset-bottom,0px)]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
    >
      <div className="flex">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(projectSlug, "cta_whatsapp")}
          className="flex-1 inline-flex flex-col items-center justify-center gap-0.5 py-3 text-white hover:bg-[#25D366]/20 active:bg-[#25D366]/30 transition-colors focus-visible:outline-none"
          aria-label="تواصل عبر واتساب"
        >
          <MessageCircle size={20} className="shrink-0 text-[#25D366]" aria-hidden strokeWidth={2} />
          <span className="text-[11px] font-medium tracking-wide text-white/90">واتساب</span>
        </a>
        <div className="w-px bg-white/15 self-stretch my-2" aria-hidden />
        <a
          href={telHref(contactPhone)}
          onClick={() => trackClick(projectSlug, "cta_call")}
          className="flex-1 inline-flex flex-col items-center justify-center gap-0.5 py-3 text-white hover:bg-[#1BA8C8]/20 active:bg-[#1BA8C8]/30 transition-colors focus-visible:outline-none"
          aria-label={`اتصل بنا — ${display}`}
        >
          <Phone size={20} className="shrink-0 text-[#1BA8C8]" aria-hidden strokeWidth={2} />
          <span className="text-[11px] font-medium tracking-wide text-white/90">اتصل بنا</span>
        </a>
      </div>
    </motion.div>
  );
}
