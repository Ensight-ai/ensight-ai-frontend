import Link from "next/link";
import { ArrowIcon } from "./icons";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand/20 via-surface to-bg-soft px-6 py-16 text-center sm:px-12">
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Give your visitors an answer, not a contact form.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Spin up your first ensightLabs agent today — free, no credit card, live in
          minutes.
        </p>
        <Link
          href="/signup"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-soft"
        >
          Build your agent
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
