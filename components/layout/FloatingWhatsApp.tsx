"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

interface FloatingWhatsAppProps {
  /** E.164 digits (e.g. "201118884994"). */
  phoneNumber: string;
  /** Optional pre-filled message. */
  message?: string;
  /** Visible label next to the icon on desktop only. */
  label?: string;
}

/**
 * Always-visible WhatsApp bubble pinned to the bottom-left.
 * Sits above the sticky mobile CTA on small screens (bottom offset).
 */
export function FloatingWhatsApp({
  phoneNumber,
  message,
  label = "كلمنا واتساب",
}: FloatingWhatsAppProps) {
  const url = buildWhatsAppUrl(phoneNumber, message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-[9998] inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:bg-[#20bd5a] transition-all px-3 py-3 md:px-5 md:py-3.5 font-semibold"
    >
      <MessageCircle size={22} strokeWidth={2.2} aria-hidden />
      <span className="hidden md:inline-block text-sm">{label}</span>
    </a>
  );
}
