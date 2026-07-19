"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, resendVerification, signup } from "@/lib/api";
import { isPaidPlan, saveSession, type Plan } from "@/lib/auth";
import { toast } from "@/components/toaster";

type Mode = "login" | "signup";

// Paid users go to the dashboard; anyone without an active plan must choose &
// pay for one first (hard paywall).
function destinationFor(plan: Plan): string {
  return isPaidPlan(plan) ? "/dashboard" : "/choose-plan";
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  const isSignup = mode === "signup";

  async function handleResend() {
    setResending(true);
    try {
      await resendVerification(email);
      setResent(true);
    } catch {
      /* generic response; ignore */
    } finally {
      setResending(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);

    if (isSignup) {
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirm) {
        toast.error("Passwords don't match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignup) {
        const res = await signup(email, password);
        if (res.access_token) {
          saveSession(res.access_token, res.refresh_token, res.user);
          router.push(destinationFor(res.user.plan));
        } else {
          // Email confirmation required before a session is issued.
          setNotice(res.message || "Account created — please sign in.");
          setLoading(false);
        }
      } else {
        const res = await login(email, password);
        saveSession(res.access_token, res.refresh_token, res.user);
        router.push(destinationFor(res.user.plan));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? "At least 8 characters" : "Your password"}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-16 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted hover:text-fg"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {isSignup && (
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
            Confirm password
          </label>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      )}

      {notice && (
        <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-brand">
          <p>{notice}</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resent}
            className="mt-2 font-medium underline underline-offset-2 disabled:no-underline disabled:opacity-70"
          >
            {resent
              ? "Verification email re-sent"
              : resending
                ? "Sending…"
                : "Didn't get it? Resend email"}
          </button>
        </div>
      )}

      {!notice && (
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft disabled:opacity-60"
        >
          {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
        </button>
      )}
    </form>
  );
}
