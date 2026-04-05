"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashWindowProps {
  children: ReactNode;
  /** Optional: skip splash (e.g. when returning to page). */
  skipSplash?: boolean;
}

const STORAGE_KEY = "beitlee-aliva-splash-seen";

/**
 * Splash that feels like a house window opening: wooden frame, panes that
 * swing open (casement style), then the real page is revealed.
 */
export function SplashWindow({ children, skipSplash = false }: SplashWindowProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || skipSplash) {
      setShowSplash(false);
      return;
    }
    const seen =
      typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      setShowSplash(false);
      return;
    }
    setShowSplash(true);
  }, [mounted, skipSplash]);

  const handleOpenComplete = () => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, "1");
      }
      setShowSplash(false);
    }, 500);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            className="fixed inset-0 z-100 flex items-center justify-center bg-stone-900/95 p-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Room / interior feel */}
            <motion.div
              className="absolute inset-0 bg-linear-to-b from-stone-800 to-stone-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            />

            {/* House window: frame + opening panes (3D perspective for swing) */}
            <motion.div
              className="relative flex h-full w-full max-w-3xl max-h-[80vh] items-center justify-center"
              style={{ perspective: 1000, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              {/* Wooden window frame (outer) */}
              <div
                className="absolute inset-0 rounded-lg border-10 border-amber-900/90 shadow-2xl"
                style={{
                  boxShadow:
                    "inset 0 0 0 2px rgba(120,53,15,0.4), 0 25px 50px -12px rgba(0,0,0,0.5)",
                }}
              >
                <div className="absolute inset-2 rounded-md border-2 border-amber-800/80 bg-amber-950/30" />
              </div>

              {/* View through the window (the "outside" we reveal) */}
              <div className="absolute inset-[26px] overflow-hidden rounded-sm bg-background">
                <div className="absolute inset-0 bg-linear-to-b from-background to-(--navy)/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-xl font-bold text-navy md:text-2xl"
                  >
                    Mountain View Aliva
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                    className="text-sm text-muted"
                  >
                    عيش بين الجبل والمدينة
                  </motion.span>
                </div>
              </div>

              {/* Center vertical divider (fixed part of the frame) */}
              <div
                className="absolute left-1/2 top-[18px] bottom-[18px] w-1 -translate-x-1/2 rounded-full bg-amber-900/90"
                style={{ zIndex: 5 }}
              />

              {/* Left casement pane — swings open toward the left */}
              <motion.div
                className="absolute left-[18px] top-[18px] bottom-[18px] w-[calc(50%-22px)] origin-right overflow-hidden rounded-l-sm"
                style={{
                  perspective: "1200px",
                  zIndex: 4,
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -92 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  delay: 0.3,
                }}
                onAnimationComplete={handleOpenComplete}
              >
                <div className="h-full w-full bg-amber-950/50 backdrop-blur-sm" />
              </motion.div>

              {/* Right casement pane — swings open toward the right */}
              <motion.div
                className="absolute right-[18px] top-[18px] bottom-[18px] w-[calc(50%-22px)] origin-left overflow-hidden rounded-r-sm"
                style={{
                  perspective: "1200px",
                  zIndex: 4,
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 92 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  delay: 0.3,
                }}
              >
                <div className="h-full w-full bg-amber-950/50 backdrop-blur-sm" />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
