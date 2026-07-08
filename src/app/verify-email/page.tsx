"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/api";
import { Logo } from "@/components/logo";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}

function VerifyInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"checking" | "ok" | "error">("checking");
  const [message, setMessage] = useState("");
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (!token) {
      setState("error");
      setMessage("This verification link is missing its token.");
      return;
    }
    verifyEmail(token)
      .then((res) => {
        setState("ok");
        setMessage(res.message);
      })
      .catch((e) => {
        setState("error");
        setMessage(
          e instanceof Error ? e.message : "Verification failed. Try again.",
        );
      });
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo className="h-10 w-10" />

      {state === "checking" && (
        <>
          <span className="mt-6 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
          <p className="mt-4 text-sm text-muted">Confirming your email…</p>
        </>
      )}

      {state === "ok" && (
        <>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Email confirmed ✅
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">{message}</p>
          <Link
            href="/login"
            className="mt-8 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft"
          >
            Sign in
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Verification failed
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">{message}</p>
          <p className="mt-6 text-sm text-muted">
            Need a new link?{" "}
            <Link href="/signup" className="font-medium text-brand hover:underline">
              Sign up again
            </Link>{" "}
            or{" "}
            <Link href="/login" className="font-medium text-brand hover:underline">
              sign in
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}
