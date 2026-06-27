"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { clearSession } from "@/lib/auth";

export default function LogoutPage() {
  useEffect(() => {
    clearSession();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo className="h-10 w-10 animate-scale-in" />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        You&apos;ve been signed out
      </h1>
      <p className="mt-2 text-sm text-muted">
        Thanks for using ensightLabs. See you again soon.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft"
        >
          Sign back in
        </Link>
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-bg-soft"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
