"use client";

import { useEffect, useRef, useState } from "react";
import {
  AuthError,
  startWidgetSession,
  widgetChat,
  widgetVoice,
  type WidgetSession,
} from "@/lib/api";
import { cleanAgentText } from "@/lib/text";

type Capability = "chat" | "voice" | "both";

interface Message {
  role: "user" | "bot";
  text: string;
  audio?: string; // data URL for a spoken bot answer
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
  capability = "chat",
}: {
  publicKey: string;
  name?: string;
  color?: string;
  position?: "bottom-left" | "bottom-right";
  capability?: Capability;
}) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<WidgetSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const canChat = capability === "chat" || capability === "both";
  const canVoice = capability === "voice" || capability === "both";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, sending, open]);

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

  // Run an action that needs a session, transparently retrying once if the
  // token expired.
  async function withSession<T>(
    fn: (token: string) => Promise<T>,
  ): Promise<T> {
    let s = await ensureSession();
    try {
      return await fn(s.access_token);
    } catch (e) {
      if (e instanceof AuthError) {
        setSession(null);
        s = await startWidgetSession(
          publicKey,
          localStorage.getItem(visitorKey(publicKey)),
        );
        setSession(s);
        return fn(s.access_token);
      }
      throw e;
    }
  }

  function playAudio(dataUrl: string) {
    try {
      new Audio(dataUrl).play().catch(() => {});
    } catch {
      /* ignore autoplay errors */
    }
  }

  async function sendText() {
    const question = input.trim();
    if (!question || sending) return;
    setInput("");
    setError(null);
    setMessages((m) => [...m, { role: "user", text: question }]);
    setSending(true);
    try {
      const result = await withSession((t) => widgetChat(t, question));
      setMessages((m) => [...m, { role: "bot", text: cleanAgentText(result.answer) }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        void handleVoice(blob);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone access is needed for voice. Please allow it.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function handleVoice(blob: Blob) {
    setSending(true);
    setError(null);
    try {
      const result = await withSession((t) => widgetVoice(t, blob));
      if (result.transcript) {
        setMessages((m) => [...m, { role: "user", text: result.transcript }]);
      }
      const audio = `data:${result.audio_mime};base64,${result.audio_base64}`;
      setMessages((m) => [
        ...m,
        { role: "bot", text: cleanAgentText(result.answer), audio: result.audio_base64 ? audio : undefined },
      ]);
      if (result.audio_base64) playAudio(audio);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't process the audio.");
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText();
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
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800"
                  }
                  style={m.role === "user" ? { backgroundColor: color } : undefined}
                >
                  <span>{m.text}</span>
                  {m.audio && (
                    <button
                      onClick={() => playAudio(m.audio!)}
                      className="ml-2 align-middle text-slate-400 hover:text-slate-600"
                      aria-label="Play answer"
                    >
                      <svg viewBox="0 0 24 24" className="inline h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-400">…</p>
              </div>
            )}
            {error && <p className="text-center text-xs text-red-600">{error}</p>}
          </div>

          {/* input */}
          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">
            {canChat && (
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your message…"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-300"
              />
            )}
            {!canChat && canVoice && (
              <span className="flex-1 px-2 text-sm text-slate-500">
                {recording ? "Listening… tap to send" : "Tap the mic to talk"}
              </span>
            )}

            {canVoice && (
              <button
                onClick={recording ? stopRecording : startRecording}
                disabled={sending}
                aria-label={recording ? "Stop recording" : "Start recording"}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-white disabled:opacity-50 ${recording ? "animate-pulse" : ""}`}
                style={{ backgroundColor: recording ? "#dc2626" : color }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {recording ? (
                    <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
                  ) : (
                    <>
                      <rect x="9" y="3" width="6" height="11" rx="3" />
                      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                    </>
                  )}
                </svg>
              </button>
            )}

            {canChat && (
              <button
                onClick={sendText}
                disabled={sending || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white disabled:opacity-50"
                style={{ backgroundColor: color }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="m3 11 18-8-8 18-2-7-8-3Z" />
                </svg>
              </button>
            )}
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
          ) : canVoice && !canChat ? (
            <>
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </>
          ) : (
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-3.8-.8L3 21l1.8-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
          )}
        </svg>
      </button>
    </div>
  );
}
