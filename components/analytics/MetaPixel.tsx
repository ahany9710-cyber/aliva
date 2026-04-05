import Script from "next/script";
import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";
import { getMetaPixelInlineBootstrap, META_PIXEL_ID } from "@/lib/meta-fbq";

interface MetaPixelProps {
  slug: string;
}

/**
 * Meta Pixel for Mountain View / Aliva landers only (`/mountainview`, `/aliva`).
 */
export function MetaPixel({ slug }: MetaPixelProps) {
  if (!isMountainViewLandingSlug(slug)) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: getMetaPixelInlineBootstrap({ viewContent: true }),
        }}
      />
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
