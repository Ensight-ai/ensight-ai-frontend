"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthError, type Plan, startCheckout } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { CheckIcon } from "@/components/icons";

const plans: {
  id: Plan;
  name: string;
  price: string;
  usd: string;
  blurb: string;
  features: string[];
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₦8,000",
    usd: "≈ $6/mo",
    blurb: "Launch your first AI agent.",
    features: [
      "1 chat agent",
      "Train on your documents",
      "Lead spotting & scoring",
      "Conversation history",
    ],
  },
  {
    id: "beta",
    name: "Beta",
    price: "₦22,000",
    usd: "≈ $16/mo",
    blurb: "Voice, booking and content.",
    features: [
      "Up to 3 agents",
      "Voice agents",
      "Meeting booking",
      "AI content drafts",
      "Exports",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₦34,500",
    usd: "≈ $25/mo",
    blurb: "The full suite + financing.",
    features: [
      "Up to 10 agents",
      "Chat + voice on one agent",
      "Financial access assistant",
      "Advanced analytics",
      "Priority support",
    ],
  },
];

const order: Record<Plan, number> = { starter: 0, beta: 1, pro: 2 };

export default function BillingPage() {
  const router = useRouter();
  const currentPlan = (getUser()?.plan ?? "starter") as Plan;
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(plan: Plan) {
    setLoadingPlan(plan);
    setError(null);
    try {
      const { authorization_url } = await startCheckout(plan);
      window.location.href = authorization_url; // hand off to Paystack
    } catch (e) {
      if (e instanceof AuthError) router.replace("/login");
      else setError(e instanceof Error ? e.message : "Couldn't start checkout.");
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-1 text-sm text-muted">
        You&apos;re on the{" "}
        <span className="font-medium capitalize text-fg">{currentPlan}</span>{" "}
        plan. Upgrade any time — billed monthly via Paystack.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const isCurrent = plan.id === currentPlan;
          const isDowngrade = order[plan.id] < order[currentPlan];
          return (
            <div
              key={plan.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`animate-fade-up rounded-2xl border p-6 shadow-sm ${
                isCurrent ? "border-brand bg-surface" : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{plan.name}</h2>
                {isCurrent && (
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {plan.price}
                <span className="text-sm font-normal text-muted">/mo</span>
              </p>
              <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                {plan.usd}
              </span>
              <p className="mt-1 text-sm text-muted">{plan.blurb}</p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                    <span className="text-fg/90">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => subscribe(plan.id)}
                disabled={isCurrent || loadingPlan !== null}
                className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                  isCurrent
                    ? "cursor-default border border-border text-muted"
                    : "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-soft"
                }`}
              >
                {isCurrent
                  ? "Current plan"
                  : loadingPlan === plan.id
                    ? "Redirecting…"
                    : isDowngrade
                      ? `Switch to ${plan.name}`
                      : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted">
        Payments are processed securely by Paystack. Your plan updates as soon
        as payment is confirmed.
      </p>
    </div>
  );
}
