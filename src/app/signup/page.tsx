import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create your EnsightLabs account and put an AI agent that grows your business on your website.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="No credit card needed to sign up."
    >
      <GoogleButton label="Sign up with Google" />

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        or sign up with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <AuthForm mode="signup" />

      <p className="mt-4 text-center text-xs text-muted">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="font-medium text-brand hover:underline">
          Terms of Service
        </Link>
        .
      </p>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
