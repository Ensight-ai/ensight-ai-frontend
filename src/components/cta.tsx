import Link from "next/link";
import { ArrowIcon } from "./icons";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-20 text-center text-white shadow-2xl shadow-brand/20 sm:px-12">
        <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to turn visitors into customers?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-blue-100">
          Set up your AI growth platform today — no card to sign up, live in
          minutes.
        </p>
        <Link
          href="/signup"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand shadow-lg transition-colors hover:bg-blue-50"
        >
          Get started
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
