"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { consentGranted, subscribe } from "@/lib/consent";

const CLARITY_ID = "yh42educ4z";

export default function Clarity() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (consentGranted()) setEnabled(true);
    const unsub = subscribe((value) => {
      if (value === "granted") setEnabled(true);
    });
    return unsub;
  }, []);

  if (!enabled) return null;

  return (
    <Script
      id="ms-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
      }}
    />
  );
}