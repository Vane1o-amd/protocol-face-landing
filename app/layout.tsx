import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono, Caveat } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MetaPixel from "@/components/MetaPixel";
import Clarity from "@/components/Clarity";
import ConsentBanner from "@/components/ConsentBanner";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollTopButton from "@/components/ScrollTopButton";
import { SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MenFace — персональная диагностика и сопровождение",
  description:
    "Личный протокол лица: измени лицо за 90 дней — первые видимые изменения к 4-й неделе.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "MenFace — персональная диагностика и сопровождение",
    description:
      "Личный протокол лица: измени лицо за 90 дней — первые видимые изменения к 4-й неделе.",
    type: "website",
    locale: "ru_RU",
    siteName: "MenFace",
  },
  twitter: {
    card: "summary_large_image",
    title: "MenFace — персональная диагностика и сопровождение",
    description:
      "Личный протокол лица: измени лицо за 90 дней — первые видимые изменения к 4-й неделе.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${caveat.variable}`}
    >
      <body>
        {/* Without JavaScript: no loading screen, and motion items rendered hidden (opacity:0) are shown. */}
        <noscript>
          <style>{".loading-screen{display:none}[style*=\"opacity:0\"]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <MotionConfig reducedMotion="user">
          <LoadingScreen />
          <ScrollProgress />
          <ConsentBanner />
          {children}
          <Footer />
          <ScrollTopButton />
          <MetaPixel />
          <Clarity />
          <Analytics />
          <SpeedInsights />
        </MotionConfig>
      </body>
    </html>
  );
}