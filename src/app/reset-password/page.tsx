"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api";
import { AuthLayout } from "@/components/auth/auth-layout";
import { toast } from "@/components/toaster";

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}

function ResetInner() {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    if (!token) {
      toast.error("This reset link is missing its token.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      setDone(res.message);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Couldn't reset your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Enter a new password for your account."
    >
      {done ? (
        <div>
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {done}
          </div>
          <Link
            href="/login"
            className="mt-6 block rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              New password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Confirm password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft disabled:opacity-60"
          >
            {loading ? "Saving…" : "Reset password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
