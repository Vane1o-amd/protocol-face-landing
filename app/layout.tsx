import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono, Caveat } from "next/font/google";
import { MotionConfig } from "motion/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MetaPixel from "@/components/MetaPixel";
import ConsentBanner from "@/components/ConsentBanner";
import ScrollProgress from "@/components/ScrollProgress";
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

// TODO: replace placeholder domain once user confirms final domain
export const metadata: Metadata = {
  metadataBase: new URL("https://protocolface.com"),
  title: "Protocol Face — персональная диагностика и сопровождение",
  description:
    "Личный протокол лица: измени лицо за 60 дней — первые изменения уже через неделю.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Protocol Face — персональная диагностика и сопровождение",
    description:
      "Личный протокол лица: измени лицо за 60 дней — первые изменения уже через неделю.",
    type: "website",
    locale: "ru_RU",
    siteName: "Protocol Face",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protocol Face — персональная диагностика и сопровождение",
    description:
      "Личный протокол лица: измени лицо за 60 дней — первые изменения уже через неделю.",
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
        <MotionConfig reducedMotion="user">
          <ScrollProgress />
          {children}
          <MetaPixel />
          <ConsentBanner />
          <Analytics />
          <SpeedInsights />
        </MotionConfig>
      </body>
    </html>
  );
}