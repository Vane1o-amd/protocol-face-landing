"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

const CLARITY_ID = "yi904c33gp";

export default function Clarity({ nonce }: { nonce?: string }) {
  if (useConsent() !== "granted") return null;

  return (
    <Script
      id="ms-clarity"
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
      }}
    />
  );
}