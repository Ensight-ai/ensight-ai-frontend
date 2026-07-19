"use client";

import { useEffect, useState } from "react";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

let counter = 0;
const listeners = new Set<(item: ToastItem) => void>();

function emit(message: string, variant: ToastVariant) {
  if (!message) return;
  const item = { id: ++counter, message, variant };
  listeners.forEach((notify) => notify(item));
}

/**
 * Fire a toast from anywhere — components or plain functions. Mirrors the
 * ergonomics of libraries like sonner without the dependency:
 *   toast.success("Saved");  toast.error("Something went wrong");
 */
export const toast = {
  success: (message: string) => emit(message, "success"),
  error: (message: string) => emit(message, "error"),
  info: (message: string) => emit(message, "info"),
};

const AUTO_DISMISS_MS = 4500;

function Icon({ variant }: { variant: ToastVariant }) {
  const base = "h-5 w-5 shrink-0";
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (variant === "success")
    return (
      <svg {...props} className={`${base} text-emerald-500`}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </svg>
    );
  if (variant === "error")
    return (
      <svg {...props} className={`${base} text-red-500`}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" />
      </svg>
    );
  return (
    <svg {...props} className={`${base} text-brand`}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

/**
 * Renders the live toast stack. Mount once, near the end of the root layout's
 * <body>. Toasts auto-dismiss; click to dismiss early.
 */
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const add = (item: ToastItem) => {
      setItems((prev) => [...prev, item]);
      setTimeout(
        () => setItems((prev) => prev.filter((t) => t.id !== item.id)),
        AUTO_DISMISS_MS,
      );
    };
    listeners.add(add);
    return () => {
      listeners.delete(add);
    };
  }, []);

  function dismiss(id: number) {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          onClick={() => dismiss(t.id)}
          className="animate-fade-up pointer-events-auto flex w-full max-w-sm cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg shadow-lg"
        >
          <Icon variant={t.variant} />
          <span className="min-w-0 flex-1 break-words pt-px">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
