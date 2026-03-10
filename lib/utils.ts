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
 * Build WhatsApp link with optional pre-filled message.
 */
export function buildWhatsAppUrl(
  phone: string,
  message?: string
): string {
  const normalized = phone.replace(/\D/g, "")
  const number = normalized.startsWith("20") ? normalized : `20${normalized}`
  const base = `https://wa.me/${number}`
  if (message?.trim()) {
    return `${base}?text=${encodeURIComponent(message.trim())}`
  }
  return base
}
