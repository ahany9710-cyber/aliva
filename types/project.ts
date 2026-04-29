/**
 * Content model for a single real estate project landing page.
 * All fields are used by the landing page template and SEO.
 */

export interface ProjectHighlight {
  icon: string
  label: string
  value: string
}

export interface ProjectWhyPoint {
  title: string
  description: string
}

export interface ProjectNearbyPlace {
  name: string
  distance: string
}

export interface ProjectFAQ {
  question: string
  answer: string
}

/** A buyable unit type within a project (apartment / villa / townhouse, …). */
export interface ProjectUnit {
  /** Short label shown on the unit card (e.g. "شقة ٣ غرف"). */
  type: string
  /** Image used on the unit card. Must live under /public. */
  image: string
  rooms?: string
  area?: string
  /** Display string for price (Arabic numerals OK). */
  price: string
  /** Display string for down payment / installment line. */
  payment?: string
}

export interface ProjectContent {
  slug: string
  projectName: string
  developer: string
  /** Short city/area label used in compare cards & breadcrumbs (e.g. "المستقبل سيتي"). */
  city?: string
  /** Long-form location description shown in the location section. */
  location: string
  headline: string
  subheadline: string
  description: string
  /** Card / showcase cover image. Prefer over heroImage for new projects. */
  cover?: string
  /** Optional small gallery images shown under the showcase section. */
  galleryImages?: string[]
  /** Optional buyable unit types for the unit-cards strip. */
  units?: ProjectUnit[]
  /** Optional amenities chips (e.g. "نادي", "تراك جري"). */
  amenities?: string[]
  /** Legacy: hero image — kept for backwards compatibility. */
  heroImage: string
  /** Optional image for About / secondary sections. Omit when the hero already uses heroImage/video so the same art is not shown twice. */
  aboutImage?: string
  /** Optional hero video URL (e.g. /hero-video.mp4). When set, the hero shows video instead of the image. */
  heroVideo?: string
  /** Optional smaller hero video for mobile (e.g. /hero-video-mobile.webm). When set, used on viewport <= 768px. */
  heroVideoMobile?: string
  /** Optional MP4 fallback for Safari (e.g. /hero-video.mp4). Safari does not support WebM; use this so video plays in production. */
  heroVideoMp4?: string
  /** Optional MP4 fallback for Safari on mobile (e.g. /hero-video-mobile.mp4). */
  heroVideoMobileMp4?: string
  startingPrice: string
  downPayment: string
  installmentYears: number
  deliveryDate: string
  propertyTypes: string[]
  highlights: ProjectHighlight[]
  whyPoints: ProjectWhyPoint[]
  nearbyPlaces: ProjectNearbyPlace[]
  faqs: ProjectFAQ[]
  seoTitle: string
  seoDescription: string
  ogImage?: string
  /** When set, `tel:` links use this number; otherwise they use whatsappNumber. */
  phoneNumber?: string
  whatsappNumber: string
  /** Optional custom pre-filled message for header/inquiry WhatsApp link. When set, used instead of the default inquiry message. */
  whatsappInquiryMessage?: string
  ctaText: string
  /** Optional CTA text for the lead form submit button. When set, used instead of ctaText in the form. */
  leadFormCtaText?: string
  offerBadge?: string
  /** Optional path to the project's brochure PDF (under /public). Renders the "حمّل البروشور" button when set. */
  brochureUrl?: string
}
