"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Play, Sparkles } from "lucide-react";
import type { ProjectContent } from "@/types/project";
import { formatPhoneDisplay, telHref } from "@/lib/phone-display";
import { revealStagger, revealStaggerReduced } from "@/lib/motion";
import { trackClick } from "@/lib/analytics";

const HERO_LOGO_SRC = "/raselhekmalogo.png";
/** Place file at public/modon-ras-hekma.mp4 */
const HERO_VIDEO_SRC = "/modon-ras-hekma.mp4";

interface FullscreenHeroProps {
  project: ProjectContent;
  contactPhone: string;
  whatsappUrl: string;
}

function splitHeadline(headline: string): { main: string; tag?: string } {
  const parts = headline.split(" — ");
  if (parts.length >= 2) {
    return { main: parts[0]!, tag: parts.slice(1).join(" — ") };
  }
  return { main: headline };
}

export function FullscreenHero({ project, contactPhone, whatsappUrl }: FullscreenHeroProps) {
  const reducedMotion = useReducedMotion();
  const stagger = reducedMotion ? revealStaggerReduced : revealStagger;
  const { main, tag } = splitHeadline(project.headline);
  const italicLine = tag ?? project.subheadline;
  const display = formatPhoneDisplay(contactPhone);

  const showVideo = !reducedMotion;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    video.setAttribute("webkit-playsinline", "true");

    const tryPlay = () => {
      if (video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    const onPlaying = () => {
      setNeedsTap(false);
      const el = videoRef.current;
      if (el?.poster) el.poster = "";
    };
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
  }, [showVideo]);

  const handleTapPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
    setNeedsTap(false);
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex flex-col justify-end md:justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {showVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={project.heroImage}
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={project.projectName}
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
            {needsTap && (
              <button
                type="button"
                onClick={handleTapPlay}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleTapPlay();
                }}
                className="absolute inset-0 z-1 flex items-center justify-center bg-black/30"
                aria-label="تشغيل الفيديو"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#0A4D68] shadow-xl">
                  <Play size={30} className="ms-1 shrink-0 fill-current" aria-hidden />
                </span>
              </button>
            )}
          </>
        ) : (
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={project.heroImage}
              alt=""
              role="presentation"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={82}
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-28 md:pb-14 pt-24 md:pt-16">
        <motion.div
          className="max-w-3xl"
          variants={stagger.container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={stagger.item}
            className="flex items-center gap-2 text-[#1BA8C8] mb-3"
          >
            <Sparkles className="shrink-0" size={22} strokeWidth={1.75} aria-hidden />
            <span className="text-sm sm:text-base font-semibold tracking-wider uppercase text-white/90">
              البحر المتوسط · مصر
            </span>
          </motion.div>
          <motion.h1 variants={stagger.item} className="m-0 w-full flex flex-col items-stretch">
            <span className="sr-only">{main}</span>
            <div className="relative h-20 w-64 sm:h-28 sm:w-80 md:h-36 md:w-96 max-w-[min(92vw,28rem)] self-start">
              <Image
                src={HERO_LOGO_SRC}
                alt=""
                fill
                sizes="(max-width: 640px) 16rem, (max-width: 1024px) 20rem, 28rem"
                className="object-contain object-right drop-shadow-md"
                priority
              />
            </div>
          </motion.h1>
          <motion.p
            variants={stagger.item}
            className="mt-4 text-lg sm:text-xl text-white/85 italic leading-snug"
          >
            {italicLine}
          </motion.p>

          <motion.div variants={stagger.item} className="mt-8 flex flex-row flex-wrap items-center gap-3">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(project.slug, "cta_whatsapp")}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 min-h-11 px-6 text-sm font-semibold text-white bg-[#25D366] rounded-full hover:bg-[#20bd5a] active:bg-[#20bd5a] transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              <MessageCircle size={17} aria-hidden strokeWidth={2} />
              واتساب
            </motion.a>
            <motion.a
              href={telHref(contactPhone)}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 min-h-11 px-6 text-sm font-semibold text-white border border-white/60 bg-white/10 rounded-full hover:bg-white/20 active:bg-white/20 transition-colors backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              <Phone size={16} aria-hidden />
              اتصل الآن
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
