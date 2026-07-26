import Link from "next/link";
import { CheckIcon } from "./icons";

const plans = [
  {
    name: "Starter",
    price: "₦8,500",
    period: "/mo",
    usd: "≈ $6 USD / month",
    tagline: "Everything to launch your first AI agent.",
    features: [
      "1 chat agent",
      "Train on your documents",
      "Embeddable chat widget",
      "Multilingual replies",
      "Lead spotting & scoring",
      "Conversation history",
      "Basic analytics",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Beta",
    price: "₦22,500",
    period: "/mo",
    usd: "≈ $16 USD / month",
    tagline: "Add voice, meeting booking, and content.",
    features: [
      "Everything in Starter, plus:",
      "Up to 3 agents",
      "Voice agents",
      "Meeting booking (Google Meet)",
      "AI marketing content drafts",
      "Lead filters & exports",
      "Full analytics dashboard",
      "Email support",
    ],
    cta: "Start with Beta",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₦35,000",
    period: "/mo",
    usd: "≈ $25 USD / month",
    tagline: "The full suite, including financial access.",
    features: [
      "Everything in Beta, plus:",
      "Up to 6 agents",
      "Chat + voice on one agent",
      "Financial access assistant",
      "Advanced analytics",
      "Priority knowledge indexing",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Pick your power level
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple pricing that grows with you
        </h2>
        <p className="mt-4 text-muted">
          Start at ₦8,500/month. Upgrade when you need voice, booking, more
          agents, or financial access.
        </p>
      </div>

      <div className="mt-16 grid items-center gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.highlighted
                ? "relative overflow-hidden rounded-3xl border border-blue-400/60 bg-gradient-to-b from-brand/25 to-surface p-8 shadow-[0_0_70px_rgba(37,99,235,0.2)] lg:-translate-y-5"
                : "relative rounded-3xl border border-border bg-surface p-8 shadow-xl shadow-blue-950/[0.06]"
            }
          >
            <div className="flex min-h-7 items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              {plan.highlighted && (
                <span className="shrink-0 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white shadow-md shadow-brand/20">
                  Most popular
                </span>
              )}
            </div>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">
                {plan.price}
              </span>
              <span className="text-sm text-muted">{plan.period}</span>
            </p>
            <span className="mt-2 inline-block rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
              {plan.usd}
            </span>
            <p className="mt-3 text-sm text-muted">{plan.tagline}</p>

            <Link
              href="/signup"
              className={
                plan.highlighted
                  ? "mt-6 block rounded-full bg-brand px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-brand-soft"
                  : "mt-6 block rounded-full border border-border px-5 py-2.5 text-center text-sm font-medium transition-colors hover:bg-bg-soft"
              }
            >
              {plan.cta}
            </Link>

            <ul className="mt-7 space-y-3">
              {plan.features.map((f) =>
                f.endsWith("plus:") ? (
                  <li
                    key={f}
                    className="pt-1 text-xs font-medium uppercase tracking-wide text-muted"
                  >
                    {f}
                  </li>
                ) : (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                    <span className="text-fg/90">{f}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
