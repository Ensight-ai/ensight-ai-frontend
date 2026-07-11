"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type AdminPayment, AuthError, getAdminPayments } from "@/lib/api";

const PER_PAGE = 50;

const statusStyle: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  abandoned: "bg-slate-100 text-slate-600",
  reversed: "bg-amber-100 text-amber-700",
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminPayment[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(null);
    getAdminPayments(page, PER_PAGE)
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else
          setError(e instanceof Error ? e.message : "Couldn't load payments.");
      });
  }, [page, router]);

  const money = (p: AdminPayment) =>
    (p.currency === "NGN" ? "₦" : p.currency + " ") + p.amount.toLocaleString();

  const to = Math.min(page * PER_PAGE, total);
  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
      <p className="mt-1 text-sm text-muted">
        Transactions from Paystack — who paid, how much, and when.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody>
            {items === null ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr
                  key={p.reference}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3">{p.email ?? "—"}</td>
                  <td className="px-4 py-3 font-medium tabular-nums">
                    {money(p)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        statusStyle[p.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">
                    {p.channel ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.paid_at
                      ? new Date(p.paid_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {p.reference}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>
          {from}–{to} of {total}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-border px-3 py-1.5 font-medium transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={to >= total}
            className="rounded-lg border border-border px-3 py-1.5 font-medium transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
