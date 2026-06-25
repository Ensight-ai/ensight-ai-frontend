"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type AgentAnalytics, AuthError, getAnalytics } from "@/lib/api";
import { AgentPicker, useAgentPicker } from "@/components/dashboard/agent-picker";

export default function AnalyticsPage() {
  const router = useRouter();
  const picker = useAgentPicker();
  const [data, setData] = useState<AgentAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const agentId = picker.agentId;

  useEffect(() => {
    if (!agentId) return;
    setData(null);
    getAnalytics(agentId)
      .then(setData)
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e.message);
      });
  }, [agentId, router]);

  const stats = data
    ? [
        { label: "Unique visitors", value: data.unique_visitors },
        { label: "Conversations", value: data.total_conversations },
        { label: "Questions asked", value: data.questions_asked },
        {
          label: "Avg msgs / chat",
          value: data.avg_messages_per_conversation.toFixed(1),
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-sm text-muted">
        How visitors are engaging with each agent.
      </p>

      <div className="mt-6">
        <AgentPicker picker={picker} />
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {picker.agents !== null && picker.agents.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
          Create an agent first.
        </p>
      ) : data === null ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                <p className="text-3xl font-semibold tabular-nums">{s.value}</p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 animate-fade-up rounded-2xl border border-border bg-surface p-6 shadow-sm" style={{ animationDelay: "260ms" }}>
            <h2 className="font-semibold">Recent questions</h2>
            {data.recent_questions.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No questions yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {data.recent_questions.map((q, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm text-fg/90"
                  >
                    {q}
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
