"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-owner embed for the public marketing pages.
 *
 * The script appends its iframe directly to document.body, so this component
 * also removes that iframe when navigation leaves the marketing site. Product
 * screens must never sit beneath the public demo widget.
 */
export function EnsightWidgetEmbed() {
  const pathname = usePathname();
  const showWidget = ["/", "/about", "/privacy", "/terms"].includes(pathname);

  useEffect(() => {
    const iframeSelector = 'iframe[data-ensight-widget="true"]';
    const scriptId = "ensight-site-widget";

    function removeWidget() {
      document.querySelector(iframeSelector)?.remove();
      document.getElementById(scriptId)?.remove();
    }

    if (!showWidget) {
      removeWidget();
      return;
    }

    if (document.querySelector(iframeSelector)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "/widget.js?v=4";
    script.dataset.agentKey = "pk_LyMhessCTP5o36Z6CWw7zNKaD_p0Qvyj";
    script.dataset.color = "#2563eb";
    script.dataset.name = "Ensightlabs assistant";
    script.dataset.position = "bottom-right";
    script.dataset.capability = "both";
    script.dataset.greeting =
      "Hi!, this is ensight labs AI assistant, how can we help you today ?☺️☺️";
    document.body.appendChild(script);

    return removeWidget;
  }, [showWidget]);

  return null;
}
