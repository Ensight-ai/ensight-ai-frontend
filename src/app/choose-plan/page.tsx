"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthError, type Plan, startCheckout } from "@/lib/api";
import { clearSession, getToken, getUser, isPaidPlan } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { CheckIcon } from "@/components/icons";
import { toast } from "@/components/toaster";

const plans: {
  id: Plan;
  name: string;
  price: string;
  usd: string;
  blurb: string;
  features: string[];
  highlighted?: boolean;
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
    highlighted: true,
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

export default function ChoosePlanPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    // Already subscribed? Skip straight to the dashboard.
    if (isPaidPlan(getUser()?.plan)) {
      router.replace("/dashboard");
      return;
    }
    setReady(true);
  }, [router]);

  async function subscribe(plan: Plan) {
    setLoadingPlan(plan);
    try {
      const { authorization_url } = await startCheckout(plan);
      window.location.href = authorization_url;
    } catch (e) {
      if (e instanceof AuthError) router.replace("/login");
      else
        toast.error(
          e instanceof Error ? e.message : "Couldn't start checkout.",
        );
      setLoadingPlan(null);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-semibold tracking-tight">EnsightLabs</span>
        </Link>
        <button
          onClick={() => {
            clearSession();
            router.replace("/login");
          }}
          className="text-sm text-muted transition-colors hover:text-fg"
        >
          Sign out
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Choose a plan to get started
          </h1>
          <p className="mt-3 text-muted">
            Your account is ready — pick a plan to activate your AI agents.
            Billed monthly, cancel anytime.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              style={{ animationDelay: `${i * 70}ms` }}
              className={`animate-fade-up min-w-0 rounded-2xl border p-6 shadow-sm ${
                plan.highlighted
                  ? "border-brand bg-surface shadow-brand/10"
                  : "border-border bg-surface"
              }`}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-block rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              )}
              <h2 className="font-semibold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-semibold tabular-nums">
                {plan.price}
                <span className="text-sm font-normal text-muted">/mo</span>
              </p>
              <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                {plan.usd}
              </span>
              <p className="mt-2 text-sm text-muted">{plan.blurb}</p>

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
                disabled={loadingPlan !== null}
                className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                  plan.highlighted
                    ? "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-soft"
                    : "border border-border hover:bg-bg-soft"
                }`}
              >
                {loadingPlan === plan.id
                  ? "Redirecting…"
                  : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Secure payment via Paystack. Your plan activates as soon as payment is
          confirmed.
        </p>
      </main>
    </div>
  );
}
