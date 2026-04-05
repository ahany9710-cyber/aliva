import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "أليڤا | ماونتن ڤيو — المستقبل سيتي",
    template: "%s",
  },
  description:
    "مشروع أليڤا السكني في المستقبل سيتي — وحدات متنوعة وخطط تقسيط مرنة من ماونتن ڤيو.",
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
      <body className="antialiased min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
