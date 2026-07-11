import { ChartIcon, SparkIcon, TargetIcon } from "./icons";

const pillars = [
  {
    icon: TargetIcon,
    title: "Win more customers",
    body: "Answer every visitor instantly, capture your best leads, and book the meeting before they leave — so the traffic you already have turns into revenue.",
  },
  {
    icon: SparkIcon,
    title: "Do more with less",
    body: "Voice, follow-ups, and marketing content handled automatically, 24/7 — like adding a whole front-office team without the payroll.",
  },
  {
    icon: ChartIcon,
    title: "Unlock what's next",
    body: "See what your customers really want, and turn your business activity into insights — and even financing — to fuel your next stage of growth.",
  },
];

export function GrowthBand() {
  return (
    <section className="border-y border-border/60 bg-bg-soft/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            We don&apos;t just give you a chatbot.
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">We grow your business.</span>
          </h2>
          <p className="mt-4 text-muted">
            EnsightLabs is a growth engine that works every hour of every day —
            turning conversations into customers, meetings, content, and
            momentum.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-fade-up min-w-0 rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-accent">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
