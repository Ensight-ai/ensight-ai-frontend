"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Site-owner embed for the public widget. Do not render it on the widget
 * route itself, otherwise the public widget would load itself again.
 */
export function EnsightWidgetEmbed() {
  const pathname = usePathname();

  if (pathname.startsWith("/w/")) return null;

  return (
    <Script
      src="https://www.ensightlabs.xyz/widget.js"
      data-agent-key="pk_LyMhessCTP5o36Z6CWw7zNKaD_p0Qvy"
      data-color="#2563eb"
      data-name="Ensightlabs assistant"
      data-position="bottom-right"
      data-capability="both"
      data-greeting="Hi!, this is ensight labs AI assistant, how can we help you today ?☺️☺️"
      strategy="afterInteractive"
    />
  );
}
