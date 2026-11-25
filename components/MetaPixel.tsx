"use client";

import { useEffect } from "react";
import Script from "next/script";
import { consentGranted, useConsent } from "@/lib/consent";
import { ensureFbp, captureFbclid } from "@/lib/meta-cookies";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead(eventId?: string): void {
  if (!consentGranted() || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "Lead", {}, { eventID: eventId });
}

// fbevents.js and the _fbp cookie wait for consent: nothing from Meta before an answer or after a decline.
export default function MetaPixel({ nonce }: { nonce?: string }) {
  const enabled = useConsent() === "granted";

  useEffect(() => {
    if (!enabled) return;
    ensureFbp();
    captureFbclid();
  }, [enabled]);

  if (!PIXEL_ID || !enabled) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(PIXEL_ID)});fbq('track','PageView');`,
      }}
    />
  );
}