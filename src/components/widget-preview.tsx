import { ChatIcon, SparkIcon } from "./icons";

const messages = [
  { from: "bot", text: "Hi! I'm Ada, your assistant. Ask me anything about our pricing or docs." },
  { from: "user", text: "Do you offer a refund policy?" },
  {
    from: "bot",
    text: "Yes — every plan includes a 30-day money-back guarantee, no questions asked. Want the full policy link?",
  },
];

export function WidgetPreview() {
  return (
    <div className="relative w-full max-w-sm">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/20 blur-3xl" />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
        {/* header */}
        <div className="flex items-center gap-3 bg-brand px-4 py-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <ChatIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Ada — Support</p>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Online now
            </p>
          </div>
        </div>

        {/* messages */}
        <div className="space-y-3 bg-bg-soft px-4 py-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <p
                className={
                  m.from === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-sm text-white"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2 text-sm text-fg/90"
                }
              >
                {m.text}
              </p>
            </div>
          ))}
          <div className="flex items-center gap-1.5 pl-1">
            <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-[10px] text-muted">
              <SparkIcon className="h-3 w-3 text-brand-accent" />
              Trained on your docs
            </span>
          </div>
        </div>

        {/* input */}
        <div className="flex items-center gap-2 border-t border-border bg-surface px-4 py-3">
          <div className="flex-1 rounded-full border border-border bg-bg-soft px-4 py-2 text-sm text-muted">
            Type your message…
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="m3 11 18-8-8 18-2-7-8-3Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
