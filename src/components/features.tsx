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
    <section id="features" className="mx-auto max-w-7xl px-5 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          One system. Six superpowers.
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to answer, convert, and grow
        </h2>
        <p className="mt-4 text-muted">
          EnsightLabs is more than a chatbot. It answers your visitors, turns
          them into leads and booked meetings, writes your content, and helps
          you access financing — one platform, your whole front office.
        </p>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`group relative overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-xl shadow-blue-950/[0.06] transition-all hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-brand/10 ${
              i === 0 || i === 5 ? "lg:col-span-7" : i === 1 || i === 4 ? "lg:col-span-5" : "lg:col-span-6"
            }`}
          >
            <span className="absolute right-5 top-2 text-7xl font-semibold tracking-tighter text-brand/[0.045]">
              0{i + 1}
            </span>
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-3xl transition-colors group-hover:bg-brand/20" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10 text-brand transition-all group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="relative mt-8 text-xl font-semibold">{f.title}</h3>
            <p className="relative mt-3 max-w-lg text-sm leading-7 text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
