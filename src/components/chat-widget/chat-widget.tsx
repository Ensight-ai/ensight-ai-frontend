"use client";

import { useEffect, useRef, useState } from "react";
import {
  AuthError,
  startWidgetSession,
  widgetChat,
  type WidgetSession,
} from "@/lib/api";

interface Message {
  role: "user" | "bot";
  text: string;
}

const GREETING = "Hi! 👋 How can we help you today?";

function visitorKey(publicKey: string) {
  return `ensight_visitor_${publicKey}`;
}

export function ChatWidget({
  publicKey,
  name = "Assistant",
  color = "#2563eb",
  position = "bottom-right",
}: {
  publicKey: string;
  name?: string;
  color?: string;
  position?: "bottom-left" | "bottom-right";
}) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<WidgetSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, sending, open]);

  // Start (or reuse) a session, returning a valid token.
  async function ensureSession(): Promise<WidgetSession> {
    if (session) return session;
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(visitorKey(publicKey))
        : null;
    const s = await startWidgetSession(publicKey, stored);
    if (typeof window !== "undefined") {
      localStorage.setItem(visitorKey(publicKey), s.visitor_id);
    }
    setSession(s);
    return s;
  }

  async function send() {
    const question = input.trim();
    if (!question || sending) return;
    setInput("");
    setError(null);
    setMessages((m) => [...m, { role: "user", text: question }]);
    setSending(true);

    try {
      let s = await ensureSession();
      let result;
      try {
        result = await widgetChat(s.access_token, question);
      } catch (e) {
        // Session likely expired — start a fresh one once and retry.
        if (e instanceof AuthError) {
          setSession(null);
          s = await ensureSession();
          result = await widgetChat(s.access_token, question);
        } else {
          throw e;
        }
      }
      setMessages((m) => [...m, { role: "bot", text: result.answer }]);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again.",
      );
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const side = position === "bottom-left" ? "left-5" : "right-5";

  return (
    <div className={`fixed bottom-5 z-50 ${side} flex flex-col items-end`}>
      {open && (
        <div className="mb-3 flex h-[30rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* header */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300" />
              <p className="text-sm font-semibold">{name}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/80 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800"
                  }
                  style={m.role === "user" ? { backgroundColor: color } : undefined}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-400">
                  …
                </p>
              </div>
            )}
            {error && <p className="text-center text-xs text-red-600">{error}</p>}
          </div>

          {/* input */}
          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message…"
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white disabled:opacity-50"
              style={{ backgroundColor: color }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="m3 11 18-8-8 18-2-7-8-3Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* launcher bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-3.8-.8L3 21l1.8-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
          )}
        </svg>
      </button>
    </div>
  );
}
