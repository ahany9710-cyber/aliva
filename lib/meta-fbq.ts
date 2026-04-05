import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Aliva dataset ID in Events Manager. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2207624319777165";

/**
 * Inline bootstrap for next/script: safe script insertion, single `fbq('init')` per tab,
 * then PageView (and optional ViewContent). Avoids duplicate init on client-side navigations.
 */
export function getMetaPixelInlineBootstrap(options: {
  viewContent?: boolean;
} = {}): string {
  const viewContent = options.viewContent
    ? "fbq('track', 'ViewContent');"
    : "";
  return `
(function(){
  var PIXEL_ID='${META_PIXEL_ID}';
  var INIT_KEY='__fbq_init_'+PIXEL_ID;
  if(!window.fbq){
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    if(s)s.parentNode.insertBefore(t,s);
    else b.head.appendChild(t);
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  }
  if(!window[INIT_KEY]){
    fbq('init', PIXEL_ID);
    window[INIT_KEY]=1;
  }
  fbq('track', 'PageView');
  ${viewContent}
})();
  `.trim();
}

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
