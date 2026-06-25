"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getMe } from "@/lib/api";
import { saveSession, type UserProfile } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const done = useRef(false);

  useEffect(() => {
    // Surface an error Google/Supabase may have appended to the URL.
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get("error_description") ?? params.get("error");
    if (urlError) {
      setError(urlError);
      return;
    }

    async function finish(session: Session) {
      if (done.current) return;
      done.current = true;

      const token = session.access_token;
      // Prefer the backend profile (it knows the plan); fall back to the
      // Supabase user if the backend is unreachable.
      let profile: UserProfile;
      try {
        profile = await getMe(token);
      } catch {
        profile = {
          id: session.user.id,
          email: session.user.email ?? "",
          plan: "starter",
        };
      }
      saveSession(token, session.refresh_token ?? null, profile);
      router.replace("/");
    }

    // The SDK exchanges the OAuth code automatically (detectSessionInUrl).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) finish(session);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish(data.session);
    });

    // If nothing resolves in a few seconds, the link was likely invalid.
    const timeout = setTimeout(() => {
      if (!done.current) setError("Sign-in could not be completed. Please try again.");
    }, 8000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      {error ? (
        <>
          <h1 className="text-xl font-semibold">Sign-in failed</h1>
          <p className="mt-2 max-w-sm text-sm text-muted">{error}</p>
          <a
            href="/login"
            className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-soft"
          >
            Back to sign in
          </a>
        </>
      ) : (
        <>
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-brand" />
          <p className="mt-4 text-sm text-muted">Signing you in…</p>
        </>
      )}
    </div>
  );
}
