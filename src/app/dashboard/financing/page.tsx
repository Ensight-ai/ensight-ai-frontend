"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  assessFinancing,
  AuthError,
  type BusinessSnapshot,
  type FinancingIntake,
  type FinancingResult,
  getBusinessSnapshot,
} from "@/lib/api";

const likelihoodStyles: Record<string, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export default function FinancingPage() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<BusinessSnapshot | null>(null);
  const [result, setResult] = useState<FinancingResult | null>(null);
  const [assessing, setAssessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState<FinancingIntake>({
    monthly_revenue: undefined,
    currency: "USD",
    time_in_business_months: undefined,
    employees: undefined,
    amount_sought: undefined,
    purpose: "",
    country: "",
  });

  useEffect(() => {
    getBusinessSnapshot()
      .then(setSnapshot)
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e.message);
      });
  }, [router]);

  function num(v: string): number | undefined {
    return v === "" ? undefined : Number(v);
  }

  async function assess(e: React.FormEvent) {
    e.preventDefault();
    setAssessing(true);
    setError(null);
    try {
      setResult(await assessFinancing(form));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't run the assessment.");
    } finally {
      setAssessing(false);
    }
  }

  async function copySummary() {
    if (!result) return;
    await navigator.clipboard.writeText(result.assessment.application_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const stats = snapshot
    ? [
        { label: "Conversations", value: snapshot.conversations },
        { label: "Qualified leads", value: snapshot.qualified_leads },
        { label: "Meetings booked", value: snapshot.meetings_booked },
        { label: "Unique visitors", value: snapshot.unique_visitors },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Financial access</h1>
      <p className="mt-1 text-sm text-muted">
        EnsightLabs already knows your business. Turn that activity into a
        loan-readiness assessment and a lender-ready application — no paperwork
        from scratch.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Snapshot */}
      <h2 className="mt-8 text-sm font-semibold text-muted">
        What EnsightLabs already sees
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-4">
        {(snapshot ? stats : [0, 1, 2, 3]).map((s, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 50}ms` }}
            className="animate-fade-up rounded-2xl border border-border bg-surface p-4 shadow-sm"
          >
            {snapshot ? (
              <>
                <p className="text-2xl font-semibold tabular-nums">
                  {(s as { value: number }).value}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {(s as { label: string }).label}
                </p>
              </>
            ) : (
              <div className="h-10 animate-pulse rounded bg-slate-200" />
            )}
          </div>
        ))}
      </div>

      {/* Intake */}
      <form
        onSubmit={assess}
        className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm"
      >
        <h2 className="font-semibold">A few details we can&apos;t infer</h2>
        <p className="mt-1 text-sm text-muted">
          All optional — we&apos;ll note anything missing as a gap.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Monthly revenue">
            <input
              type="number"
              min={0}
              placeholder="e.g. 5000"
              onChange={(e) =>
                setForm({ ...form, monthly_revenue: num(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Currency">
            <input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Time in business (months)">
            <input
              type="number"
              min={0}
              placeholder="e.g. 18"
              onChange={(e) =>
                setForm({
                  ...form,
                  time_in_business_months: num(e.target.value),
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Employees">
            <input
              type="number"
              min={0}
              placeholder="e.g. 3"
              onChange={(e) =>
                setForm({ ...form, employees: num(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Financing sought">
            <input
              type="number"
              min={0}
              placeholder="e.g. 10000"
              onChange={(e) =>
                setForm({ ...form, amount_sought: num(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Country">
            <input
              placeholder="e.g. Nigeria"
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="What's the funding for?" className="mt-4">
          <input
            placeholder="e.g. Buy more livestock feed inventory"
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className={inputCls}
          />
        </Field>

        <button
          type="submit"
          disabled={assessing}
          className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft disabled:opacity-60"
        >
          {assessing ? "Assessing…" : "Assess loan readiness"}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-8 animate-fade-up space-y-5">
          {/* Score */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Loan-readiness score</p>
                <p className="text-4xl font-semibold tabular-nums">
                  {result.assessment.readiness_score}
                  <span className="text-lg text-muted">/100</span>
                </p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium capitalize text-brand">
                {result.assessment.tier}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${result.assessment.readiness_score}%` }}
              />
            </div>
          </div>

          {/* Strengths + gaps */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Panel title="Strengths" items={result.assessment.strengths} tone="good" />
            <Panel title="Gaps to close" items={result.assessment.gaps} tone="warn" />
          </div>

          {/* Products */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-semibold">Recommended financing options</h2>
            <ul className="mt-4 space-y-3">
              {result.assessment.recommended_products.map((p, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-border bg-bg-soft/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{p.name}</p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${likelihoodStyles[p.likelihood]}`}
                    >
                      {p.likelihood} fit
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{p.description}</p>
                  <p className="mt-1.5 text-sm text-fg/80">{p.why_fit}</p>
                  {p.typical_amount && (
                    <p className="mt-1 text-xs text-muted">
                      Typical amount: {p.typical_amount}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Application summary */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Lender-ready summary</h2>
              <button
                onClick={copySummary}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-bg-soft"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg/85">
              {result.assessment.application_summary}
            </p>
          </div>

          {/* Next steps */}
          {result.assessment.next_steps.length > 0 && (
            <Panel
              title="Next steps"
              items={result.assessment.next_steps}
              tone="neutral"
            />
          )}
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}

function Panel({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "warn" | "neutral";
}) {
  const dot =
    tone === "good"
      ? "bg-green-500"
      : tone === "warn"
        ? "bg-amber-500"
        : "bg-brand";
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span className="text-fg/85">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
