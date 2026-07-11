import Link from "next/link";
import { ArrowIcon, SparkIcon } from "./icons";
import { WidgetPreview } from "./widget-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="absolute left-1/2 top-[-10rem] -z-10 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
            <SparkIcon className="h-3.5 w-3.5 text-brand-accent" />
            More than a chatbot — your AI growth platform
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">AI</span> that answers, converts
            <br className="hidden sm:block" /> and grows your business.
          </h1>

          <p className="mt-6 max-w-md text-lg text-muted">
            Turn the visitors you already have into customers. EnsightLabs
            answers every question, captures your best leads, books meetings,
            writes your marketing, and even helps you access financing — powered
            by a custom AI agent trained on your business, live in minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-soft"
            >
              Get started
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
            >
              See how it works
            </a>
          </div>

          <p className="mt-5 text-xs text-muted">
            No card to sign up · Cancel anytime
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="animate-float">
            <WidgetPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
