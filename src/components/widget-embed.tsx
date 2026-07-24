"use client";

import { useEffect, useRef, useState } from "react";

const CLOSED_SIZE = 96;

export function WidgetEmbed({
  src,
  allow = "microphone; clipboard-write",
  title = "EnsightLabs assistant",
  position = "bottom-right",
}: {
  src: string;
  allow?: string;
  title?: string;
  position?: "bottom-left" | "bottom-right";
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.type !== "ensight-widget-resize" ||
        typeof event.data.open !== "boolean"
      ) {
        return;
      }
      setOpen(event.data.open);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      allow={allow}
      style={{
        position: "fixed",
        bottom: 0,
        ...(position === "bottom-left" ? { left: 0 } : { right: 0 }),
        width: open ? "min(420px, 100vw)" : CLOSED_SIZE,
        height: open ? "min(600px, 100dvh)" : CLOSED_SIZE,
        border: 0,
        background: "transparent",
        zIndex: 2147483647,
        transition: "width 150ms ease, height 150ms ease",
      }}
    />
  );
}
