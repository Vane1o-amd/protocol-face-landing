"use client";

import { useEffect } from "react";
import Script from "next/script";
import { consentGranted, subscribe } from "@/lib/consent";
import { ensureFbp, captureFbclid } from "@/lib/meta-cookies";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function initPixel(): void {
  if (typeof window === "undefined" || !PIXEL_ID) return;
  if (!window.fbq) return;
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

export function trackLead(eventId?: string): void {
  if (!consentGranted() || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "Lead", {}, { eventID: eventId });
}

export default function MetaPixel() {
  useEffect(() => {
    ensureFbp();
    captureFbclid();
    if (consentGranted()) initPixel();
    const unsub = subscribe((value) => {
      if (value === "granted") initPixel();
    });
    return unsub;
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`,
      }}
    />
  );
}