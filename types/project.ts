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

export interface ProjectContent {
  slug: string
  projectName: string
  developer: string
  location: string
  headline: string
  subheadline: string
  description: string
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
}
