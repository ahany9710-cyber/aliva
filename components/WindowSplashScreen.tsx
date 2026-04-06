"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ANIMATION_DURATION = 2.2;
const EASE = [0.25, 0.1, 0.25, 1] as const; // smooth ease-in-out
const SKIP_BUTTON_DELAY_MS = 500;

export interface WindowSplashScreenProps {
  /** Optional image URL for the shutters. If not provided, a wooden-style placeholder is used. */
  shutterImageSrc?: string;
}

/**
 * Cinematic splash: two shutters cover the viewport; left slides left, right slides right.
 * Runs on every visit (never skipped for return visitors). Respects prefers-reduced-motion and offers a skip button.
 */
export function WindowSplashScreen({ shutterImageSrc }: WindowSplashScreenProps) {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reducedMotion) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    const t = setTimeout(() => setShowSkipButton(true), SKIP_BUTTON_DELAY_MS);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  const dismiss = () => setIsVisible(false);

  const handleShutterComplete = () => {
    setCompletedCount((prev) => {
      if (prev >= 1) dismiss();
      return prev + 1;
    });
  };

  const shutterStyle = shutterImageSrc
    ? {
        backgroundImage: `url(${shutterImageSrc})`,
        backgroundSize: "200% 100%",
        backgroundRepeat: "no-repeat",
      }
    : undefined;

  const leftShutterStyle = shutterImageSrc
    ? { ...shutterStyle, backgroundPosition: "0% 0%" }
    : undefined;

  const rightShutterStyle = shutterImageSrc
    ? { ...shutterStyle, backgroundPosition: "100% 0%" }
    : undefined;

  if (isVisible !== true) return null;

  return (
    <div className="fixed inset-0 z-9999 overflow-hidden" aria-hidden>
      {/* Skip button — visible after delay for users who don't want to wait */}
      {showSkipButton && (
        <button
          type="button"
          onClick={dismiss}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 rounded-xl bg-white/90 text-navy text-base font-medium hover:bg-white shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2"
          aria-label="تخطي"
        >
          تخطي
        </button>
      )}
      {/* Left shutter — slides left off screen */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1/2 will-change-transform"
        style={{
          ...(leftShutterStyle ?? {
            background: `
              linear-gradient(90deg, #5c4033 0%, #6b4e3d 8%, #5c4033 16%, #4a3328 24%),
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 12px,
                rgba(0,0,0,0.15) 12px,
                rgba(0,0,0,0.15) 14px
              ),
              linear-gradient(180deg, #3d2c22 0%, #5c4033 50%, #4a3328 100%)
            `,
            backgroundBlendMode: "multiply",
          }),
        }}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: ANIMATION_DURATION, ease: EASE }}
        onAnimationComplete={handleShutterComplete}
      />

      {/* Right shutter — slides right off screen */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-1/2 will-change-transform"
        style={{
          ...(rightShutterStyle ?? {
            background: `
              linear-gradient(90deg, #4a3328 0%, #5c4033 84%, #6b4e3d 92%, #5c4033 100%),
              repeating-linear-gradient(
                270deg,
                transparent 0px,
                transparent 12px,
                rgba(0,0,0,0.15) 12px,
                rgba(0,0,0,0.15) 14px
              ),
              linear-gradient(180deg, #3d2c22 0%, #5c4033 50%, #4a3328 100%)
            `,
            backgroundBlendMode: "multiply",
          }),
        }}
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: ANIMATION_DURATION, ease: EASE }}
        onAnimationComplete={handleShutterComplete}
      />
    </div>
  );
}
