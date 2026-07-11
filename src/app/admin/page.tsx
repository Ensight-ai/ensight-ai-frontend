"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type AdminMetrics, AuthError, getAdminMetrics } from "@/lib/api";
import { StatCard, StatCardSkeleton } from "@/components/admin/stat-card";

const naira = (n: number | null | undefined) =>
  n == null ? "—" : "₦" + n.toLocaleString();
const num = (n: number | null | undefined) =>
  n == null ? "—" : n.toLocaleString();

const PLAN_ORDER = ["inactive", "starter", "beta", "pro"];

export default function AdminOverviewPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminMetrics()
      .then(setData)
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e instanceof Error ? e.message : "Couldn't load metrics.");
      });
  }, [router]);

  const stats = data
    ? [
        { label: "Signups", value: num(data.total_signups) },
        { label: "Paying users", value: num(data.paid_users) },
        { label: "Active (30d)", value: num(data.active_users_30d) },
        { label: "Agents", value: num(data.total_agents) },
        { label: "Est. MRR", value: naira(data.estimated_mrr), accent: true },
        {
          label: "Collected (Paystack)",
          value: naira(data.revenue_collected),
          accent: true,
        },
        { label: "Conversations", value: num(data.total_conversations) },
        { label: "Leads", value: num(data.total_leads) },
        { label: "Bookings", value: num(data.total_bookings) },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-muted">
        Live business metrics across EnsightLabs.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {data
          ? stats.map((s, i) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                accent={s.accent}
                delay={i * 40}
              />
            ))
          : Array.from({ length: 9 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
      </div>

      {data && (
        <>
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="font-semibold">Plan breakdown</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {PLAN_ORDER.map((p) => (
                <span
                  key={p}
                  className="rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm"
                >
                  <span className="capitalize text-muted">{p}</span>{" "}
                  <span className="font-semibold tabular-nums">
                    {data.plan_breakdown[p] ?? 0}
                  </span>
                </span>
              ))}
            </div>
            {data.total_transactions != null && (
              <p className="mt-4 text-xs text-muted">
                {num(data.total_transactions)} successful Paystack transactions
                to date.
              </p>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent signups</h2>
              <Link
                href="/admin/users"
                className="text-sm font-medium text-brand hover:underline"
              >
                Manage users →
              </Link>
            </div>
            {data.recent_users.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No signups yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {data.recent_users.slice(0, 6).map((u, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span className="truncate">{u.email}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-xs text-muted">
                        {u.agents} agents
                      </span>
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium capitalize text-brand">
                        {u.plan}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
