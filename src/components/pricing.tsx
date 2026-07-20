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
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple pricing that grows with you
        </h2>
        <p className="mt-4 text-muted">
          Start at ₦8,500/month. Upgrade when you need voice, booking, more
          agents, or financial access.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.highlighted
                ? "relative rounded-2xl border border-brand bg-surface p-7 shadow-2xl shadow-brand/20"
                : "relative rounded-2xl border border-border bg-surface p-7 shadow-sm shadow-slate-200/60"
            }
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
                Most popular
              </span>
            )}

            <h3 className="text-lg font-semibold">{plan.name}</h3>
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
