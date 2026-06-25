"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthError,
  type Lead,
  type LeadStatus,
  listLeads,
} from "@/lib/api";

const STATUS_FILTERS: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Hot", value: "hot" },
  { label: "Warm", value: "warm" },
  { label: "Cold", value: "cold" },
];

const statusStyles: Record<LeadStatus, string> = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-amber-100 text-amber-700",
  cold: "bg-slate-100 text-slate-600",
  unqualified: "bg-slate-100 text-slate-500",
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [minScore, setMinScore] = useState(0);

  const load = useCallback(() => {
    setLeads(null);
    listLeads({
      status: status === "all" ? undefined : status,
      min_score: minScore || undefined,
    })
      .then((page) => setLeads(page.items))
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e.message);
      });
  }, [router, status, minScore]);

  useEffect(load, [load]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
      <p className="mt-1 text-sm text-muted">
        Sales-ready visitors your agents spotted, best first.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={
                status === f.value
                  ? "rounded-full bg-brand px-3 py-1 text-xs font-medium text-white"
                  : "rounded-full px-3 py-1 text-xs font-medium text-muted hover:text-fg"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Min score
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            {[0, 50, 70, 90].map((s) => (
              <option key={s} value={s}>
                {s === 0 ? "Any" : `${s}+`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {leads === null ? (
        <p className="mt-8 text-sm text-muted">Loading leads…</p>
      ) : leads.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
          No leads match these filters yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads.map((lead, i) => (
            <li
              key={lead.id}
              style={{ animationDelay: `${i * 45}ms` }}
              className="animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    {lead.name || lead.email || "Anonymous visitor"}
                    {lead.flagged && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        Review
                      </span>
                    )}
                  </p>
                  {lead.intent && (
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {lead.intent}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold tabular-nums">
                    {lead.score}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                </div>
              </div>

              {(lead.email || lead.phone || lead.company) && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-sm text-muted">
                  {lead.email && <span>{lead.email}</span>}
                  {lead.phone && <span>{lead.phone}</span>}
                  {lead.company && <span>{lead.company}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
