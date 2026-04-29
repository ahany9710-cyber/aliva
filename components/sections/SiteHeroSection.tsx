"use client";

import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/utils";
import { telHref } from "@/lib/phone-display";

interface SiteHeroSectionProps {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
  phoneNumber: string;
  whatsappNumber: string;
  whatsappMessage?: string;
}

const HEADER_HEIGHT = 64;

export function SiteHeroSection({
  eyebrow,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  image,
  phoneNumber,
  whatsappNumber,
  whatsappMessage,
}: SiteHeroSectionProps) {
  const reduce = useReducedMotion();
  const tel = telHref(phoneNumber);
  const wa = buildWhatsAppUrl(whatsappNumber, whatsappMessage);

  return (
    <section
      className="relative min-h-[78vh] md:min-h-[85vh] overflow-hidden"
      style={{ marginTop: -HEADER_HEIGHT, paddingTop: HEADER_HEIGHT + 24 }}
      aria-label="ماونتن ڤيو — ٣ مشاريع"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-l from-navy/85 via-navy/70 to-navy/45"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24 text-white">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs sm:text-sm uppercase tracking-[0.18em] text-amber-300 font-semibold mb-4"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.18] max-w-3xl"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-7 flex flex-wrap gap-3"
        >
          <a href={tel} aria-label={primaryCta} className="inline-flex">
            <Button size="lg" className="gap-2 bg-white text-navy hover:bg-white/90">
              <Phone size={18} aria-hidden />
              {primaryCta}
            </Button>
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={secondaryCta}
            className="inline-flex"
          >
            <Button
              size="lg"
              className="gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-md"
            >
              <MessageCircle size={18} aria-hidden />
              {secondaryCta}
            </Button>
          </a>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="mt-5 text-sm text-white/70 max-w-md"
        >
          فريق المبيعات بيرد عادةً في أقل من ٥ دقايق — بدون التزام.
        </motion.p>
      </div>
    </section>
  );
}
