import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GOOGLE_ADS_ID = "AW-18066287198";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "أليڤا ماونتن ڤيو | المستقبل سيتي",
    template: "%s",
  },
  description:
    "شقق وأي ڤيلا وتاون هاوس في المستقبل سيتي — مقدم ١٠٠ ألف جنيه وتقسيط حتى ١٠ سنوات.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <link rel="preload" as="image" href="/shutters.webp" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
