"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { MessageSquare, Phone, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ProjectContent } from "@/types/project";
import { isAlivaLandingSlug } from "@/lib/aliva-landing";
import { trackMetaContact } from "@/lib/meta-contact";

interface HeroSectionProps {
  project: ProjectContent;
  contactPhone?: string;
}

const HEADER_HEIGHT = 64;

function HeroCTAs({
  callUrl,
  ctaText,
  leadFormCtaText,
  slug,
  variant,
}: {
  callUrl: string;
  ctaText: string;
  leadFormCtaText: string;
  slug: string;
  variant: "video" | "image";
}) {
  const mountainviewLogo = isAlivaLandingSlug(slug);
  const onVideo = variant === "video";

  return (
    <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={callUrl}
          className="inline-flex items-center gap-2"
          onClick={() => trackMetaContact(slug, "phone_hero")}
        >
          {onVideo ? (
            <Button
              size="lg"
              className="gap-2 border border-white text-white bg-transparent shadow-none hover:bg-white/10 hover:text-white"
            >
              {mountainviewLogo ? (
                <Image
                  src="/mountainview-emblem-white.webp"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0 object-contain"
                  aria-hidden
                />
              ) : (
                <Phone size={18} aria-hidden />
              )}
              {ctaText}
            </Button>
          ) : (
            <Button variant="mv-outline" size="lg" className="gap-2 shadow-none">
              {mountainviewLogo ? (
                <Image
                  src="/mountainview-emblem-gold.webp"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0 object-contain"
                  aria-hidden
                />
              ) : (
                <Phone size={18} aria-hidden />
              )}
              {ctaText}
            </Button>
          )}
        </a>
        <a href="#lead-form" className="inline-flex items-center gap-2">
          {onVideo ? (
            <Button
              size="lg"
              className="gap-2 border border-white bg-white text-navy shadow-none hover:bg-white/90 hover:text-navy"
            >
              {mountainviewLogo ? (
                <Image
                  src="/mountainview-emblem-gold.webp"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0 object-contain"
                  aria-hidden
                />
              ) : (
                <MessageSquare size={18} aria-hidden />
              )}
              {leadFormCtaText}
            </Button>
          ) : (
            <Button variant="primary" size="lg" className="gap-2">
              {mountainviewLogo ? (
                <Image
                  src="/mountainview-emblem-white.webp"
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0 object-contain"
                  aria-hidden
                />
              ) : (
                <MessageSquare size={18} aria-hidden />
              )}
              {leadFormCtaText}
            </Button>
          )}
        </a>
    </div>
  );
}

export function HeroSection({ project, contactPhone }: HeroSectionProps) {
  const phone = contactPhone ?? project.phoneNumber ?? project.whatsappNumber;
  const callUrl = `tel:+${phone.replace(/\D/g, "")}`;
  const hasVideo = !!project.heroVideo;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  const leadFormCtaText = project.leadFormCtaText ?? "سجّل اهتمامك";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("fetchpriority", "high");

    const tryPlay = () => {
      if (video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    const onPlaying = () => setNeedsTap(false);

    const onCanPlay = () => {
      tryPlay();
      if (video.paused) setNeedsTap(true);
    };

    const onResume = () => tryPlay();

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    document.addEventListener("visibilitychange", onResume);
    window.addEventListener("pageshow", onResume);

    tryPlay();

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      document.removeEventListener("visibilitychange", onResume);
      window.removeEventListener("pageshow", onResume);
    };
  }, [hasVideo]);

  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
    setNeedsTap(false);
  };

  if (hasVideo) {
    return (
      <section
        className="relative min-h-[55vh] pt-6 pb-10 md:pt-10 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ marginTop: -HEADER_HEIGHT, paddingTop: HEADER_HEIGHT + 24 }}
      >
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label={project.projectName}
          >
            {project.heroVideoMobileMp4 && (
              <source src={project.heroVideoMobileMp4} type="video/mp4" media="(max-width: 768px)" />
            )}
            {project.heroVideoMp4 && (
              <source src={project.heroVideoMp4} type="video/mp4" />
            )}
            {project.heroVideoMobile && (
              <source src={project.heroVideoMobile} type="video/webm" media="(max-width: 768px)" />
            )}
            <source src={project.heroVideo} type="video/webm" />
          </video>

          {needsTap && (
            <button
              type="button"
              onClick={handleTap}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTap();
              }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/25"
              aria-label="تشغيل الفيديو"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-navy shadow-xl">
                <Play size={30} className="ml-1 shrink-0 fill-current" aria-hidden />
              </span>
            </button>
          )}

          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.22) 25%, transparent 45%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center min-h-[calc(55vh-5rem)]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="order-2 md:order-1"
          >
            {project.offerBadge && (
              <Badge variant="hot" className="mb-4">
                {project.offerBadge}
              </Badge>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {project.headline}
            </h1>
            {project.subheadline && (
              <p className="mt-3 text-lg text-white/90 leading-relaxed">
                {project.subheadline}
              </p>
            )}
            <HeroCTAs
              callUrl={callUrl}
              ctaText={project.ctaText}
              leadFormCtaText={leadFormCtaText}
              slug={project.slug}
              variant="video"
            />
          </motion.div>
          <div className="order-1 md:order-2 hidden md:block" aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-6 pb-10 md:pt-10 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="order-2 md:order-1"
        >
          {project.offerBadge && (
            <Badge variant="hotLight" className="mb-4">
              {project.offerBadge}
            </Badge>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight">
            {project.headline}
          </h1>
          {project.subheadline && (
            <p className="mt-3 text-lg text-muted leading-relaxed">
              {project.subheadline}
            </p>
          )}
          <HeroCTAs
            callUrl={callUrl}
            ctaText={project.ctaText}
            leadFormCtaText={leadFormCtaText}
            slug={project.slug}
            variant="image"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="order-1 md:order-2 relative aspect-4/3 rounded-lg overflow-hidden shadow-xl bg-navy/5"
        >
          <Image
            src={project.heroImage}
            alt={project.projectName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={82}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
