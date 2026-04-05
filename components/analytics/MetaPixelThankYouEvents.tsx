"use client";

import { useEffect } from "react";
import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";

/**
 * After a successful lead form, fire `Lead` + `CompleteRegistration` for MV/Aliva.
 * Waits for `fbq` from the shared next/script bootstrap on this page (or lander).
 */
export function MetaPixelThankYouEvents({
  projectSlug,
}: {
  projectSlug: string | null;
}) {
  useEffect(() => {
    if (!projectSlug || !isMountainViewLandingSlug(projectSlug)) {
      return;
    }

    const storageKey = `meta_pixel_thankyou_${projectSlug}`;
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 240;

    const id = window.setInterval(() => {
      attempts += 1;
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead");
        window.fbq("track", "CompleteRegistration");
        sessionStorage.setItem(storageKey, "1");
        window.clearInterval(id);
      } else if (attempts >= maxAttempts) {
        window.clearInterval(id);
      }
    }, 50);

    return () => window.clearInterval(id);
  }, [projectSlug]);

  return null;
}
