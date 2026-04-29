import type { ProjectContent } from "@/types/project";

/**
 * أليڤا — ماونتن ڤيو، المستقبل سيتي.
 */
export const content: ProjectContent = {
  slug: "aliva",
  projectName: "أليڤا",
  developer: "ماونتن ڤيو",
  city: "المستقبل سيتي",
  location:
    "أليڤا تمتد على أكبر قطعة أرض في قلب المستقبل سيتي بالقاهرة الجديدة، على مسافة قصيرة بالسيارة من iCITY ماونتن ڤيو. الجامعة الأمريكية حوالي ٢٠ دقيقة، طريق السويس ١٠ دقائق، MV Hydepark ١٧ دقيقة، Mountain View 1 حوالي ١٩ دقيقة.",
  headline: "أليڤا — مساحة جديدة تعيش فيها قصة مختلفة",
  subheadline:
    "شقق، آي ڤيلا، وتاون هاوس في قلب المستقبل سيتي. مقدم ١٠٠ ألف جنيه وتقسيط حتى ١٠ سنوات.",
  description:
    "وحدة تجمع بين الراحة اليومية وفرصة في منطقة بتنمو كل سنة. تشكيلة من ماونتن ڤيو تناسب العائلات والمستثمرين، بمقدم يبدأ من ١٠٠ ألف جنيه.",
  cover: "/projects/aliva/cover.png",
  galleryImages: ["/projects/aliva/gallery-1.png"],
  units: [
    {
      type: "شقة ٣ غرف",
      image: "/projects/aliva/apartment.png",
      rooms: "٣",
      area: "١٢٥م",
      price: "يبدأ من ١٠٫٥ مليون جنيه",
      payment: "مقدم ١٠٠ ألف وتقسيط حتى ١٠ سنوات",
    },
    {
      type: "آي ڤيلا",
      image: "/projects/aliva/i-villa.png",
      rooms: "٤ غرف على طابقين",
      area: "٢٠٥م + حديقة",
      price: "يبدأ من ١٨٫٩ مليون جنيه",
      payment: "مقدم ١٠٠ ألف وتقسيط حتى ١٠ سنوات",
    },
    {
      type: "تاون هاوس",
      image: "/projects/aliva/townhouse.png",
      rooms: "٣ غرف",
      area: "٢١٠م + حديقة",
      price: "يبدأ من ٢٩٫٧ مليون جنيه",
      payment: "مقدم ١٠٠ ألف وتقسيط حتى ١٠ سنوات",
    },
  ],
  amenities: [
    "كلوب هاوس متكامل",
    "مساحات خضراء وبحيرات",
    "تراك جري ودراجات",
    "مدرسة دولية ومنطقة تجارية",
    "بوابات أمنية ٢٤/٧",
  ],
  heroImage: "/projects/aliva/cover.png",
  heroVideo: "/hero-video.webm",
  heroVideoMobile: "/hero-video-mobile.webm",
  heroVideoMp4: "/hero-video.mp4",
  heroVideoMobileMp4: "/hero-video-mobile.mp4",
  startingPrice: "١٠٫٥ مليون جنيه",
  downPayment: "١٠٠ ألف جنيه",
  installmentYears: 10,
  deliveryDate: "2030",
  propertyTypes: ["شقق", "آي ڤيلا", "تاون هاوس"],
  highlights: [
    { icon: "location", label: "محور حركة", value: "ربط سريع بشرايين القاهرة الجديدة" },
    { icon: "home", label: "تشكيلة وحدات", value: "من الشقة العائلية حتى آي ڤيلا والتاون" },
    { icon: "building", label: "خبرة مطور", value: "ماونتن ڤيو — سجل تنفيذ معروف" },
    { icon: "calendar", label: "أفق التسليم", value: "٢٠٣٠ وفق مراحل المشروع" },
    { icon: "wallet", label: "بوابة الدخول", value: "مقدم ١٠٠ ألف جنيه للحجز" },
    { icon: "chart", label: "مرونة السداد", value: "تقسيط حتى ١٠ سنوات" },
  ],
  whyPoints: [
    {
      title: "المدينة اللي وراك مش بس الوحدة اللي قدامك",
      description:
        "المستقبل سيتي بتتوسع بخدمات وطرق وفرص شغل قريبة. أليڤا تخليك جزء من المشهد ده من بدري.",
    },
    {
      title: "مساحات للعائلة، وأسلوب للي بيفضّل الخصوصية",
      description:
        "شقة ٣ غرف للي عايز توازن بين الميزانية والراحة، آي ڤيلا وتاون هاوس لمن يدور على طابقين وحديقة.",
    },
    {
      title: "تخطيط واضح بدل مفاجآت",
      description:
        "جداول دفع مفهومة ومقدم حجز معقول، مع فريق مبيعات يشرحلك المرحلة والوحدة المناسبة.",
    },
  ],
  nearbyPlaces: [
    { name: "الجامعة الأمريكية بالقاهرة (AUC)", distance: "حوالي ٢٠ دقيقة بالسيارة" },
    { name: "طريق السويس", distance: "حوالي ١٠ دقائق بالسيارة" },
    { name: "MV Hydepark", distance: "حوالي ١٧ دقيقة بالسيارة" },
    { name: "Mountain View 1", distance: "حوالي ١٩ دقيقة بالسيارة" },
  ],
  faqs: [
    {
      question: "إيه اللي يميّز أليڤا عن مشاريع تانية في نفس المنطقة؟",
      answer:
        "تشكيلة وحدات متنوعة (شقة / آي ڤيلا / تاون) من ماونتن ڤيو، موقع داخل حركة المستقبل سيتي، وخطط دفع مفصّلة بوضوح.",
    },
    {
      question: "أقدر أقسّط على كام سنة فعلاً؟",
      answer:
        "التقسيط يصل حتى ١٠ سنوات حسب نوع الوحدة والعرض المتاح وقت الحجز. التفاصيل النهائية تُثبَّت مع مستشار المبيعات.",
    },
  ],
  seoTitle: "أليڤا ماونتن ڤيو | شقق وآي ڤيلا وتاون هاوس في المستقبل سيتي",
  seoDescription:
    "اكتشف أليڤا من ماونتن ڤيو: شقق وآي ڤيلا وتاون هاوس في المستقبل سيتي، مقدم ١٠٠ ألف جنيه وتقسيط حتى ١٠ سنوات. احجز استشارتك الآن.",
  ogImage: "/projects/aliva/cover.png",
  phoneNumber: "201223147238",
  whatsappNumber: "201118884994",
  whatsappInquiryMessage: "السلام عليكم، مهتم بمشروع أليڤا (ماونتن ڤيو) في المستقبل سيتي وأرغب في التفاصيل.",
  ctaText: "اتصل بنا",
  leadFormCtaText: "سجّل اهتمامك",
  offerBadge: "مقدم ١٠٠ ألف جنيه — تقسيط حتى ١٠ سنوات",
  brochureUrl: "/projects/aliva/brochure.pdf",
};
