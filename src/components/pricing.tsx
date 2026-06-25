import Link from "next/link";
import { CheckIcon } from "./icons";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    tagline: "Everything you need to launch your first chat agent.",
    features: [
      "1 chat agent",
      "Train on your documents",
      "Embeddable widget",
      "Conversation history",
      "Basic analytics",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Beta",
    price: "$29",
    period: "/mo",
    tagline: "Add a voice to your agents and scale your knowledge.",
    features: [
      "Chat or voice agents",
      "Larger knowledge base",
      "Multilingual replies",
      "Full analytics dashboard",
      "Conversation exports",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    tagline: "Chat and voice together, with room to grow.",
    features: [
      "Chat + voice on one agent",
      "Multiple agents",
      "Priority indexing",
      "Advanced analytics",
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
          Start free. Upgrade when you need voice, more agents, or deeper
          insight.
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
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  <span className="text-fg/90">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
