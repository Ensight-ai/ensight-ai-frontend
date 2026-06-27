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
            Chat &amp; voice AI, trained on your content
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">AI agents</span> that know
            <br className="hidden sm:block" /> your business by heart.
          </h1>

          <p className="mt-6 max-w-md text-lg text-muted">
            Build a custom chat or voice agent, train it on your own documents,
            and embed it on any website in minutes. It answers every visitor,
            spots your best sales leads, books meetings, drafts your marketing
            copy — and even helps you access financing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-soft"
            >
              Build your agent
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
            No credit card required · Free Starter plan
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
