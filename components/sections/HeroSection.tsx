"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle, MessageSquare, Phone, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ProjectContent } from "@/types/project";

interface HeroSectionProps {
  project: ProjectContent;
  /** Override for tel: link (from admin page_settings). */
  contactPhone?: string;
}

const HEADER_HEIGHT = 56; // h-14 = 3.5rem

function isMobileOrSafari(): boolean {
  if (typeof window === "undefined") return false;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const ua = navigator.userAgent;
  const safari = /^((?!chrome|android).)*safari/i.test(ua) || /iPhone|iPad|iPod/i.test(ua);
  return narrow || !!safari;
}

export function HeroSection({ project, contactPhone }: HeroSectionProps) {
  const phone = contactPhone ?? project.whatsappNumber;
  const callUrl = `tel:+${phone.replace(/\D/g, "")}`;
  const hasVideo = !!project.heroVideo;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  // Prefer MP4 on mobile/Safari (iOS doesn't support WebM) so the right source loads immediately.
  useEffect(() => {
    if (!hasVideo || !isMobileOrSafari()) return;
    const video = videoRef.current;
    if (!video) return;
    const mp4 =
      typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
        ? project.heroVideoMobileMp4 ?? project.heroVideoMp4
        : project.heroVideoMp4;
    if (mp4) {
      video.src = mp4;
      video.load();
    }
  }, [hasVideo, project.heroVideoMobileMp4, project.heroVideoMp4]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    video.setAttribute("webkit-playsinline", "true");

    const tryPlay = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    tryPlay();

    const onPlaying = () => setNeedsTapToPlay(false);
    video.addEventListener("playing", onPlaying);

    const events: (keyof HTMLMediaElementEventMap)[] = [
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "canplaythrough",
    ];
    const handlers = events.map((ev) => {
      const fn = () => tryPlay();
      video.addEventListener(ev, fn);
      return () => video.removeEventListener(ev, fn);
    });

    const onVisible = () => tryPlay();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);

    // Show tap overlay on mobile/Safari so user can start playback with a direct gesture.
    if (isMobileOrSafari()) {
      const check = () => {
        if (video.paused) setNeedsTapToPlay(true);
      };
      video.addEventListener("canplay", check);
      check();
      return () => {
        video.removeEventListener("playing", onPlaying);
        handlers.forEach((c) => c());
        document.removeEventListener("visibilitychange", onVisible);
        window.removeEventListener("pageshow", onVisible);
        video.removeEventListener("canplay", check);
      };
    }

    return () => {
      video.removeEventListener("playing", onPlaying);
      handlers.forEach((c) => c());
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
    };
  }, [hasVideo]);

  const handleTapToPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
    setNeedsTapToPlay(false);
  };

  if (hasVideo) {
    return (
      <section
        className="relative min-h-[55vh] pt-6 pb-16 md:pt-10 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ marginTop: -HEADER_HEIGHT, paddingTop: HEADER_HEIGHT + 24 }}
      >
        {/* Full-bleed video behind header and hero */}
        <div className="absolute inset-0 z-0">
          {/* fetchPriority is valid for LCP but not in React's VideoHTMLAttributes; suppresses TS error */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            // @ts-expect-error - fetchpriority is valid on video for LCP; React types are incomplete
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            aria-label={project.projectName}
          >
            {project.heroVideoMobile && (
              <source src={project.heroVideoMobile} type="video/webm" media="(max-width: 768px)" />
            )}
            <source src={project.heroVideo} type="video/webm" />
            {project.heroVideoMobileMp4 && (
              <source src={project.heroVideoMobileMp4} type="video/mp4" media="(max-width: 768px)" />
            )}
            {project.heroVideoMp4 && <source src={project.heroVideoMp4} type="video/mp4" />}
          </video>
          {/* Tap-to-play overlay for mobile (autoplay often blocked); play() runs on direct user gesture */}
          {needsTapToPlay && (
            <button
              type="button"
              onClick={handleTapToPlay}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTapToPlay();
              }}
              className="absolute inset-0 z-1 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40 active:bg-black/50"
              aria-label="تشغيل الفيديو"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg">
                <Play size={28} className="mr-0.5 shrink-0 fill-current" aria-hidden />
              </span>
            </button>
          )}
          {/* Gradient so text on the right (RTL) is readable; light overlay on the right */}
          <div
            className="absolute inset-0 z-2 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(250,250,249,0.4) 0%, rgba(250,250,249,0.2) 25%, transparent 45%)",
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
              <Badge variant="gold" className="mb-4 text-white">
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
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={callUrl} className="inline-flex items-center gap-2">
                <Button size="lg" className="gap-2">
                  {project.slug === "mountainview" ? (
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
                  {project.ctaText}
                </Button>
              </a>
              <a href="#lead-form" className="inline-flex items-center gap-2">
                <Button variant="secondary" size="lg" className="gap-2">
                  {project.slug === "mountainview" ? (
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
                  سجل الآن
                </Button>
              </a>
            </div>
          </motion.div>
          <div className="order-1 md:order-2 hidden md:block" aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="order-2 md:order-1"
        >
          {project.offerBadge && (
            <Badge variant="gold" className="mb-4">
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
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={callUrl} className="inline-flex items-center gap-2">
              <Button size="lg" className="gap-2">
                {project.slug === "mountainview" ? (
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
                {project.ctaText}
              </Button>
            </a>
            <a href="#lead-form" className="inline-flex items-center gap-2">
              <Button variant="secondary" size="lg" className="gap-2">
                {project.slug === "mountainview" ? (
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
                سجل الآن
              </Button>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="order-1 md:order-2 relative aspect-4/3 rounded-2xl overflow-hidden shadow-xl bg-navy/5"
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
