import {
  ChartIcon,
  ChatIcon,
  DocIcon,
  EmbedIcon,
  GlobeIcon,
  VoiceIcon,
} from "./icons";

const features = [
  {
    icon: ChatIcon,
    title: "Chat agents",
    body: "Drop a polished chat widget on your site that answers questions 24/7 using your own knowledge base.",
  },
  {
    icon: VoiceIcon,
    title: "Voice agents",
    body: "Let visitors talk to your agent out loud — speech in, natural spoken answers back, fully hands-free.",
  },
  {
    icon: DocIcon,
    title: "Train on your docs",
    body: "Upload PDFs, docs and pages. EnsightLabs indexes them so answers stay grounded in your real content.",
  },
  {
    icon: EmbedIcon,
    title: "Embed anywhere",
    body: "Pick a color and position, copy one snippet, and your agent is live on any website — no code required.",
  },
  {
    icon: ChartIcon,
    title: "Built-in analytics",
    body: "Track visitors, conversations and the exact questions people ask, with daily trends at a glance.",
  },
  {
    icon: GlobeIcon,
    title: "Speaks every language",
    body: "Your agent detects each visitor's language and replies in it automatically — no extra setup.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to answer, convert, and grow
        </h2>
        <p className="mt-4 text-muted">
          EnsightLabs is more than a chatbot. It answers your visitors, turns
          them into leads and booked meetings, writes your content, and helps
          you access financing — one platform, your whole front office.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-surface p-6 shadow-sm shadow-slate-200/50 transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-accent transition-colors group-hover:bg-brand/25">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
