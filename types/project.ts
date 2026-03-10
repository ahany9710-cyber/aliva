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
  whatsappNumber: string
  ctaText: string
  offerBadge?: string
}
