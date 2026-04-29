"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";
import { LeadForm } from "@/components/sections/LeadForm";
import { buildWhatsAppUrl } from "@/lib/utils";
import { telHref } from "@/lib/phone-display";
import type { ProjectContent } from "@/types/project";

interface LeadPopupProps {
  projects: ProjectContent[];
  phoneNumber: string;
  whatsappNumber: string;
  /**
   * CSS selector of the element that, when scrolled into view, triggers the popup.
   * Defaults to "#compare" (the Compare section).
   */
  triggerSelector?: string;
  /** Fallback delay in ms when IntersectionObserver isn't available. */
  fallbackDelayMs?: number;
}

const STORAGE_KEY = "mv_popup_seen";
const PROGRESS_DURATION_S = 10;

const noopSubscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

/** True after hydration on the client; false during SSR. SSR-safe, no setState-in-effect. */
function useIsClient(): boolean {
  return useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
}

/**
 * Consultation popup that opens once per session when the user scrolls to
 * the Compare section. Has a thin red progress bar (animated), call + WhatsApp
 * buttons, and the shared lead form. Renders a centered modal on desktop and
 * a bottom sheet on mobile.
 */
export function LeadPopup({
  projects,
  phoneNumber,
  whatsappNumber,
  triggerSelector = "#compare",
  fallbackDelayMs = 30_000,
}: LeadPopupProps) {
  const pathname = usePathname();
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<Element | null>(null);

  // Trigger logic: IntersectionObserver on the trigger element,
  // fallback to a single setTimeout if IO is unavailable.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip on thank-you page so the user doesn't get pestered after submitting.
    if (pathname === "/thank-you") return;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // sessionStorage may be unavailable (private browsing, etc.) — fail open.
    }
    if (alreadySeen) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;
    let observer: IntersectionObserver | null = null;

    const trigger = () => {
      setOpen((prev) => {
        if (prev) return prev;
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // ignore
        }
        return true;
      });
    };

    const target =
      typeof document !== "undefined"
        ? (document.querySelector(triggerSelector) as Element | null)
        : null;

    if (target && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
              trigger();
              observer?.disconnect();
              break;
            }
          }
        },
        { threshold: [0, 0.3, 0.6, 1] }
      );
      observer.observe(target);
    } else {
      // Fallback: single delayed trigger.
      timeout = setTimeout(trigger, fallbackDelayMs);
    }

    return () => {
      observer?.disconnect();
      if (timeout) clearTimeout(timeout);
    };
  }, [pathname, triggerSelector, fallbackDelayMs]);

  // Body scroll lock + focus management while open.
  useEffect(() => {
    if (!open) return;
    if (typeof document === "undefined") return;

    lastFocusedRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Defer focus until after the dialog has mounted.
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      const last = lastFocusedRef.current;
      if (last instanceof HTMLElement) last.focus();
    };
  }, [open]);

  if (!isClient) return null;
  if (pathname === "/thank-you") return null;

  const tel = telHref(phoneNumber);
  const wa = buildWhatsAppUrl(
    whatsappNumber,
    "السلام عليكم، شفت الإعلان وعايز استشارة مجانية بخصوص مشاريع ماونتن ڤيو."
  );

  const handleClose = () => setOpen(false);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="lead-popup-backdrop"
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          role="dialog"
          aria-modal
          aria-labelledby="lead-popup-title"
        >
          <motion.div
            key="lead-popup-card"
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, y: "20%", scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce ? { opacity: 0 } : { opacity: 0, y: "20%", scale: 0.96 }
            }
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md max-h-[min(88dvh,calc(100vh-72px))] overflow-y-auto overflow-x-hidden bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl ring-1 ring-navy/10 [-webkit-overflow-scrolling:touch]"
          >
            {/* Red progress bar */}
            <div
              className="sticky top-0 z-10 h-[3px] w-full overflow-hidden bg-red-100"
              aria-hidden
            >
              {reduce ? (
                <span className="block h-full w-full bg-red-600" />
              ) : (
                <motion.span
                  className="block h-full w-full origin-right bg-red-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: PROGRESS_DURATION_S,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              )}
            </div>

            {/* Close */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              aria-label="إغلاق"
              className="absolute top-3 left-3 z-20 inline-flex h-10 w-10 min-w-[40px] min-h-[40px] items-center justify-center rounded-full bg-white text-navy shadow-md border border-navy/10 hover:bg-navy hover:text-white transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2"
            >
              <X size={20} strokeWidth={2.4} />
            </button>

            <div className="px-5 sm:px-6 pt-7 pb-6">
              <p className="text-[0.7rem] sm:text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                عرض لفترة حصرية — خصم حصري
              </p>
              <h2
                id="lead-popup-title"
                className="mt-2 text-xl sm:text-2xl font-extrabold text-navy leading-tight"
              >
                استشارة مجانية مع مستشار ماونتن ڤيو
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">
                ثبّت سعرك واحصل على خصم الإطلاق.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href={tel}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy text-white py-3 px-3 font-semibold hover:bg-navy/90 transition-colors min-h-[48px]"
                  onClick={handleClose}
                >
                  <Phone size={18} aria-hidden /> اتصل الآن
                </a>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white py-3 px-3 font-semibold hover:bg-[#20bd5a] transition-colors min-h-[48px]"
                  onClick={handleClose}
                >
                  <MessageCircle size={18} aria-hidden /> واتساب
                </a>
              </div>

              <div className="my-5 flex items-center gap-3 text-muted text-[0.65rem] sm:text-xs uppercase tracking-widest">
                <span className="h-px flex-1 bg-navy/12" />
                أو سجّل بياناتك ونتواصل معك
                <span className="h-px flex-1 bg-navy/12" />
              </div>

              <LeadForm
                projects={projects}
                source="popup"
                submitLabel="احجز استشارتي المجانية"
                compact
                onSuccess={handleClose}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
