"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { fadeInUp, noMotion } from "@/lib/motion";
import { buildWhatsAppUrl } from "@/lib/utils";
import { telHref } from "@/lib/phone-display";

interface FinalCTASectionProps {
  phoneNumber: string;
  whatsappNumber: string;
  /** Optional pre-filled message for the WhatsApp link. */
  whatsappMessage?: string;
  title?: string;
  subtitle?: string;
}

export function FinalCTASection({
  phoneNumber,
  whatsappNumber,
  whatsappMessage,
  title = "محتاج مساعدة في الاختيار؟",
  subtitle = "اتصل أو ابعت واتساب — مستشار مبيعات ماونتن ڤيو يساعدك من غير التزام.",
}: FinalCTASectionProps) {
  const reducedMotion = useReducedMotion();
  const v = reducedMotion ? noMotion : fadeInUp;
  const tel = telHref(phoneNumber);
  const wa = buildWhatsAppUrl(whatsappNumber, whatsappMessage);

  return (
    <SectionWrapper className="py-10 md:py-12">
      <motion.div
        initial={v.initial}
        whileInView={v.animate}
        viewport={v.viewport}
        className="max-w-2xl mx-auto text-center p-8 md:p-10 rounded-xl bg-navy text-white"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        <p className="text-white/85 mb-8 text-base md:text-lg">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={tel} className="inline-flex">
            <Button
              size="lg"
              className="gap-2 bg-white text-navy hover:bg-white/90 shadow-md"
            >
              <Phone size={18} aria-hidden />
              اتصل الآن
            </Button>
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              size="lg"
              className="gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-md"
            >
              <MessageCircle size={18} aria-hidden />
              واتساب
            </Button>
          </a>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
