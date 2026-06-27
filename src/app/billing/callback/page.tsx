"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyPayment } from "@/lib/api";
import { updateStoredPlan } from "@/lib/auth";
import { Logo } from "@/components/logo";

export default function BillingCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}

function CallbackInner() {
  const params = useSearchParams();
  const [state, setState] = useState<"checking" | "success" | "failed">(
    "checking",
  );
  const [plan, setPlan] = useState<string | null>(null);
  const done = useRef(false);

  // Paystack appends ?reference= and ?trxref= to the callback URL.
  const reference = params.get("reference") || params.get("trxref");

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    if (!reference) {
      setState("failed");
      return;
    }
    verifyPayment(reference)
      .then((res) => {
        if (res.status === "success") {
          if (res.plan) {
            updateStoredPlan(res.plan);
            setPlan(res.plan);
          }
          setState("success");
        } else {
          setState("failed");
        }
      })
      .catch(() => setState("failed"));
  }, [reference]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo className="h-10 w-10" />

      {state === "checking" && (
        <>
          <span className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
          <p className="mt-4 text-sm text-muted">Confirming your payment…</p>
        </>
      )}

      {state === "success" && (
        <>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            You&apos;re on {plan ? `the ${plan} plan` : "your new plan"} 🎉
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your subscription is active. Thanks for upgrading!
          </p>
          <Link
            href="/dashboard"
            className="mt-8 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft"
          >
            Go to dashboard
          </Link>
        </>
      )}

      {state === "failed" && (
        <>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Payment not confirmed
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            We couldn&apos;t confirm this payment. If you were charged, your plan
            will update shortly — otherwise please try again.
          </p>
          <Link
            href="/dashboard/billing"
            className="mt-8 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-bg-soft"
          >
            Back to billing
          </Link>
        </>
      )}
    </div>
  );
}
