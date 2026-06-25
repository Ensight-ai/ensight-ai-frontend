"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthError,
  disconnectGoogle,
  getGoogleConnectUrl,
  getGoogleStatus,
  type GoogleStatus,
} from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function SettingsPage() {
  // useSearchParams must sit under a Suspense boundary.
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <SettingsInner />
    </Suspense>
  );
}

function SettingsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<GoogleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Banner reflecting the ?google=connected|error the OAuth callback appends.
  const callbackResult = params.get("google");
  const user = getUser();

  function load() {
    setLoading(true);
    getGoogleStatus()
      .then(setStatus)
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [router]);

  async function connect() {
    setBusy(true);
    setError(null);
    try {
      const { authorize_url } = await getGoogleConnectUrl();
      window.location.href = authorize_url; // hand off to Google's consent screen
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't start connection.");
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setError(null);
    try {
      await disconnectGoogle();
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't disconnect.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Connect the tools your agents use.
      </p>

      {callbackResult === "connected" && (
        <p className="mt-6 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
          Google Calendar connected.
        </p>
      )}
      {callbackResult === "error" && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          Couldn&apos;t connect Google Calendar. Please try again.
        </p>
      )}

      {/* Account */}
      <section className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="font-semibold">Account</h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <div className="text-sm">
            <p className="text-muted">Signed in as</p>
            <p className="font-medium">{user?.email ?? "—"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium capitalize text-brand">
              {user?.plan ?? "starter"} plan
            </span>
            <a
              href="/logout"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-bg-soft"
            >
              Sign out
            </a>
          </div>
        </div>
      </section>

      {/* Google Calendar */}
      <section className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Google Calendar</h2>
            <p className="mt-1 max-w-md text-sm text-muted">
              Let your agents check your availability and book Google Meet
              meetings with visitors, on your calendar.
            </p>
          </div>
          <GoogleGlyph />
        </div>

        <div className="mt-5 border-t border-border pt-5">
          {loading ? (
            <span className="text-sm text-muted">Checking connection…</span>
          ) : status?.connected ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Connected
                </span>
                {status.email && (
                  <span className="ml-2 text-muted">as {status.email}</span>
                )}
                {status.calendar_timezone && (
                  <span className="ml-2 text-muted">
                    · {status.calendar_timezone}
                  </span>
                )}
              </div>
              <button
                onClick={disconnect}
                disabled={busy}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-bg-soft disabled:opacity-60"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={busy}
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft disabled:opacity-60"
            >
              {busy ? "Redirecting…" : "Connect Google Calendar"}
            </button>
          )}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </section>

      <p className="mt-4 text-xs text-muted">
        Once connected, enable booking per agent on the{" "}
        <a href="/dashboard/agents" className="text-brand hover:underline">
          Agents
        </a>{" "}
        page.
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
