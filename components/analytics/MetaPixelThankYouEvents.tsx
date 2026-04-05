"use client";

import { useEffect, useRef } from "react";
import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";
import { META_PIXEL_ID } from "@/lib/meta-fbq";

function injectPixelWithThankYouConversions(): void {
  const script = document.createElement("script");
  script.textContent = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
fbq('track', 'Lead');
fbq('track', 'CompleteRegistration');
  `.trim();
  document.body.appendChild(script);
}

/**
 * After a successful lead form, fire `Lead` + `CompleteRegistration` for MV/Aliva.
 * If the user landed here without visiting a lander first, loads the pixel once then fires.
 */
export function MetaPixelThankYouEvents({
  projectSlug,
}: {
  projectSlug: string | null;
}) {
  const ran = useRef(false);

  useEffect(() => {
    if (!projectSlug || !isMountainViewLandingSlug(projectSlug) || ran.current) {
      return;
    }

    const storageKey = `meta_pixel_thankyou_${projectSlug}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(storageKey)) {
      return;
    }
    ran.current = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "1");
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead");
      window.fbq("track", "CompleteRegistration");
      return;
    }

    injectPixelWithThankYouConversions();
  }, [projectSlug]);

  return null;
}
