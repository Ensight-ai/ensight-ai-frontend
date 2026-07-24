"use client";

import { usePathname } from "next/navigation";

const WIDGET_URL =
  "https://www.ensightlabs.xyz/w/pk_vCBlOX_fZiQbJRZsPHf3GEUpHKowGTVG?color=%234a0ed8&name=Nama+agro+agent&position=bottom-right&capability=both";

/**
 * Site-owner embed for the public widget. Do not render it on the widget
 * route itself, otherwise the public iframe would contain another iframe.
 */
export function EnsightWidgetEmbed() {
  const pathname = usePathname();

  if (pathname.startsWith("/w/")) return null;

  return (
    <iframe
      title="EnsightLabs chat widget"
      src={WIDGET_URL}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: "min(420px, 100vw)",
        height: "min(600px, 100vh)",
        border: 0,
        background: "transparent",
        zIndex: 2147483647,
      }}
      allow="microphone; clipboard-write"
      loading="eager"
    />
  );
}
