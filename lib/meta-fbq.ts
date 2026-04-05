import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Aliva dataset ID in Events Manager. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2207624319777165";

/** Meta `Contact` on tel / WhatsApp taps — Mountain View & Aliva landers only. */
export function trackMetaContact(
  projectSlug: string,
  contentName: string
): void {
  if (typeof window === "undefined" || !isMountainViewLandingSlug(projectSlug)) {
    return;
  }
  window.fbq?.("track", "Contact", { content_name: contentName });
}
