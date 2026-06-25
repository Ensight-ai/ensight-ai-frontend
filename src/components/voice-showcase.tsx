import Link from "next/link";
import { ArrowIcon, CheckIcon, VoiceIcon } from "./icons";
import { VoicePreview } from "./voice-preview";

const points = [
  "Natural speech in, lifelike spoken answers out",
  "Detects and replies in the visitor's language",
  "Grounded in the same documents as your chat agent",
];

export function VoiceShowcase() {
  return (
    <section className="border-y border-border/60 bg-bg">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
        <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
          <div className="animate-float">
            <VoicePreview />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs text-brand">
            <VoiceIcon className="h-3.5 w-3.5" />
            Voice agents
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Let visitors just <span className="text-gradient">talk</span> to you.
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Add a voice to your agent and visitors can ask questions out loud —
            hands-free, on any device. They speak, your agent listens, and
            answers back in a natural voice.
          </p>

          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                <span className="text-fg/90">{p}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-soft"
          >
            Add a voice agent
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
