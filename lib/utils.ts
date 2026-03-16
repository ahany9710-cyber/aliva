import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price for display (e.g. "1,250,000 EGP").
 */
export function formatPrice(amount: number, currency = "EGP"): string {
  return new Intl.NumberFormat("en-EG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ` ${currency}`
}

/**
 * Normalize Next.js search param (string | string[] | undefined) to string | undefined.
 */
export function getSearchParam(
  value: string | string[] | undefined
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Build WhatsApp link with optional pre-filled message.
 */
export function buildWhatsAppUrl(
  phone: string,
  message?: string
): string {
  const digits = phone.replace(/\D/g, "")
  const hasCountryCode = /^(20|966|971|973|974)/.test(digits)
  const number = hasCountryCode ? digits : `20${digits}`
  const base = `https://wa.me/${number}`
  if (message?.trim()) {
    return `${base}?text=${encodeURIComponent(message.trim())}`
  }
  return base
}

const WHATSAPP_MESSAGES: Record<
  "inquiry" | "pricing" | "booking",
  (projectName: string) => string
> = {
  inquiry: (projectName) => `مرحباً، أريد الاستفسار عن مشروع ${projectName}`,
  pricing: (projectName) =>
    `مرحباً، أريد معرفة تفاصيل الأسعار والتقسيط لمشروع ${projectName}`,
  booking: (projectName) =>
    `مرحباً، أريد الحجز أو الاستفسار عن مشروع ${projectName}`,
}

/**
 * Build WhatsApp URL for a project with intent-based pre-filled message.
 */
export function buildProjectWhatsAppUrl(
  project: { whatsappNumber: string; projectName: string },
  intent: "inquiry" | "pricing" | "booking"
): string {
  const message = WHATSAPP_MESSAGES[intent](project.projectName);
  return buildWhatsAppUrl(project.whatsappNumber, message);
}
