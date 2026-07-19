"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type AdminUserDetail,
  AuthError,
  deleteUser,
  getAdminUsers,
  setUserPlan,
} from "@/lib/api";
import type { Plan } from "@/lib/auth";
import { toast } from "@/components/toaster";

const PLANS: Plan[] = ["inactive", "starter", "beta", "pro"];
const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserDetail[] | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // debounced/applied search
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    setUsers(null);
    getAdminUsers({ search: query || undefined, limit: PAGE_SIZE, offset })
      .then((page) => {
        setUsers(page.items);
        setTotal(page.total);
      })
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e instanceof Error ? e.message : "Couldn't load users.");
      });
  }, [query, offset, router]);

  useEffect(load, [load]);

  async function changePlan(u: AdminUserDetail, plan: Plan) {
    setBusyId(u.id);
    setUsers((prev) =>
      prev?.map((x) => (x.id === u.id ? { ...x, plan } : x)) ?? prev,
    );
    try {
      await setUserPlan(u.id, plan);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update plan.");
      setUsers((prev) => prev?.map((x) => (x.id === u.id ? u : x)) ?? prev);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(u: AdminUserDetail) {
    if (
      !window.confirm(
        `Delete ${u.email}? This removes their account, agents, and data. This can't be undone.`,
      )
    )
      return;
    setBusyId(u.id);
    try {
      await deleteUser(u.id);
      setUsers((prev) => prev?.filter((x) => x.id !== u.id) ?? prev);
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete user.");
    } finally {
      setBusyId(null);
    }
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    setQuery(search.trim());
  }

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted">
            Manage accounts, change plans, and remove users.
          </p>
        </div>
        <form onSubmit={applySearch} className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email…"
            className="w-56 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="submit"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-bg-soft"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Agents</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users === null ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.plan}
                      disabled={busyId === u.id}
                      onChange={(e) => changePlan(u, e.target.value as Plan)}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm capitalize outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
                    >
                      {PLANS.map((p) => (
                        <option key={p} value={p} className="capitalize">
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{u.agents}</td>
                  <td className="px-4 py-3 text-muted">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(u)}
                      disabled={busyId === u.id}
                      className="text-sm text-muted transition-colors hover:text-red-600 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>
          {from}–{to} of {total}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
            disabled={offset === 0}
            className="rounded-lg border border-border px-3 py-1.5 font-medium transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
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
