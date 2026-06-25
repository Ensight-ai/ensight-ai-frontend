import { SpeakerIcon, VoiceIcon } from "./icons";

// Heights (in px) for the static equalizer bars; the CSS animation scales them.
const bars = [14, 26, 38, 22, 44, 30, 18, 34, 20, 28];

export function VoicePreview() {
  return (
    <div className="relative w-full max-w-sm">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/20 blur-3xl" />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-slate-300/50">
        {/* header */}
        <div className="flex items-center gap-3 bg-brand px-4 py-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <VoiceIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Ada — Voice</p>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Listening…
            </p>
          </div>
        </div>

        {/* mic + pulse rings */}
        <div className="flex flex-col items-center gap-6 bg-bg-soft px-4 py-8">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span className="ping-ring absolute inset-0 rounded-full bg-brand/30" />
            <span
              className="ping-ring absolute inset-0 rounded-full bg-brand/20"
              style={{ animationDelay: "0.6s" }}
            />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-soft to-brand text-white shadow-lg shadow-brand/40">
              <VoiceIcon className="h-8 w-8" />
            </span>
          </div>

          {/* live waveform */}
          <div className="flex h-12 items-center gap-1.5">
            {bars.map((h, i) => (
              <span
                key={i}
                className="eq-bar w-1.5 rounded-full bg-brand/70"
                style={{ height: `${h}px`, animationDelay: `${i * 0.09}s` }}
              />
            ))}
          </div>
        </div>

        {/* transcript + spoken answer */}
        <div className="space-y-3 border-t border-border bg-surface px-4 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              You said
            </p>
            <p className="mt-1 text-sm text-fg/90">
              “How do I reset my password?”
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-xl bg-bg-soft px-3 py-2.5">
            <SpeakerIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
            <p className="text-sm text-fg/90">
              Head to Settings → Security and tap “Reset password.” I just sent
              you the link too.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
