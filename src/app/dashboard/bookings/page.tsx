"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthError, type Booking, listBookings } from "@/lib/api";
import { AgentPicker, useAgentPicker } from "@/components/dashboard/agent-picker";

export default function BookingsPage() {
  const router = useRouter();
  const picker = useAgentPicker();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const agentId = picker.agentId;

  useEffect(() => {
    if (!agentId) return;
    setBookings(null);
    listBookings(agentId)
      .then((p) => setBookings(p.items))
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e.message);
      });
  }, [agentId, router]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
      <p className="mt-1 text-sm text-muted">
        Meetings your agents booked on your calendar.
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
        <Empty>Create an agent first.</Empty>
      ) : bookings === null ? (
        <p className="mt-8 text-sm text-muted">Loading bookings…</p>
      ) : bookings.length === 0 ? (
        <Empty>No meetings booked yet for this agent.</Empty>
      ) : (
        <ul className="mt-6 space-y-3">
          {bookings.map((b, i) => (
            <li
              key={b.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {b.visitor_name || b.visitor_email}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {new Date(b.start_time).toLocaleString()} –{" "}
                    {new Date(b.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-sm text-muted">
                <span>{b.visitor_email}</span>
                {b.visitor_phone && <span>{b.visitor_phone}</span>}
                {b.meet_link && (
                  <a
                    href={b.meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-brand hover:underline"
                  >
                    Join Meet ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
      {children}
    </p>
  );
}
