import {
  CalendarIcon,
  CheckIcon,
  PenIcon,
  SparkIcon,
  TargetIcon,
} from "./icons";

// --- Lead spotter mockup ---------------------------------------------------

const leads = [
  { initials: "MK", name: "Maria K.", intent: "Pricing for 20-seat team", score: 92, status: "Hot" },
  { initials: "JD", name: "James D.", intent: "Asked about integrations", score: 74, status: "Warm" },
  { initials: "AO", name: "Aisha O.", intent: "Comparing plans", score: 48, status: "Cold" },
];

const statusStyles: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

function LeadsMockup() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Leads</p>
        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
          Hot first
        </span>
      </div>
      <ul className="space-y-2">
        {leads.map((l) => (
          <li
            key={l.name}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg-soft px-3 py-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
              {l.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{l.name}</p>
              <p className="truncate text-xs text-muted">{l.intent}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums">{l.score}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[l.status]}`}
            >
              {l.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Writing helper mockup -------------------------------------------------

function DraftMockup() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
          Product description
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Draft
        </span>
      </div>
      <p className="text-sm font-semibold">Meet the AcmePro Standing Desk</p>
      <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
        <p>
          Built for focus, our AcmePro desk adjusts from sitting to standing in
          seconds — so your best work never has to wait.
        </p>
        <p className="text-fg/80">
          Whisper-quiet motor · 120 kg capacity · 5-year warranty.
        </p>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
        <SparkIcon className="h-3 w-3 text-brand-accent" />
        Grounded in your documents
      </div>
    </div>
  );
}

// --- Meeting booking mockup ------------------------------------------------

function BookingMockup() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckIcon className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold">Meeting booked</p>
      </div>
      <div className="rounded-lg border border-border bg-bg-soft px-3 py-2.5">
        <p className="text-sm font-medium">Intro call · 30 min</p>
        <p className="mt-0.5 text-xs text-muted">Tue, Jul 1 · 2:00 PM</p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-brand">
          <CalendarIcon className="h-3.5 w-3.5" />
          meet.google.com/abc-defg-hij
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Added to your calendar · invite emailed to the visitor
      </p>
    </div>
  );
}

// --- Section ---------------------------------------------------------------

const cards = [
  {
    icon: TargetIcon,
    title: "Spot your best sales leads",
    body: "Every visitor chat is read and scored automatically. ensightLabs tells you who's ready to buy — with their intent and any contact details they shared — so you follow up with the right people first.",
    points: ["Hot / warm / cold scoring", "Filter to just the good ones", "Only real details, never invented"],
    mockup: <LeadsMockup />,
  },
  {
    icon: CalendarIcon,
    title: "Book meetings automatically",
    body: "When a visitor wants to talk to a person, the agent collects their details, checks your Google Calendar for open times, and books a Google Meet — then emails the invite.",
    points: ["Checks your real availability", "Creates a Google Meet link", "Invites land on both calendars"],
    mockup: <BookingMockup />,
  },
  {
    icon: PenIcon,
    title: "Draft your marketing copy",
    body: "Need a product description, email, or post? Describe it and ensightLabs writes a first draft using what it already knows about your business — ready for you to tweak and copy out.",
    points: ["Blog posts, emails, captions & more", "Grounded in your own documents", "Edit, approve, and reuse"],
    mockup: <DraftMockup />,
  },
];

export function OutcomesShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Every conversation does more
        </h2>
        <p className="mt-4 text-muted">
          Your agent doesn&apos;t just answer questions — it turns those chats
          into qualified leads, booked meetings, and ready-to-use marketing
          content, from the same knowledge base.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-border bg-surface/50 p-6 shadow-sm shadow-slate-200/50 sm:p-8"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-accent">
              <c.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-xl font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>

            <ul className="mt-5 space-y-2">
              {c.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm">
                  <CheckIcon className="h-4 w-4 shrink-0 text-brand-accent" />
                  <span className="text-fg/90">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">{c.mockup}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
