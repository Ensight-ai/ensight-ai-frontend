import Link from "next/link";
import { ArrowIcon, SparkIcon } from "./icons";
import { WidgetPreview } from "./widget-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white text-fg">
      <div className="absolute inset-y-0 right-0 hidden w-[40%] bg-gradient-to-br from-[#0a1e45] via-brand to-[#123d8f] lg:block" />
      <div className="absolute right-0 top-0 hidden h-full w-[40%] bg-[radial-gradient(circle_at_45%_35%,rgba(125,211,252,0.35),transparent_34%)] lg:block" />
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_right,black,transparent_62%)]" />
      <div className="absolute -left-48 top-[-16rem] h-[36rem] w-[36rem] rounded-full bg-brand/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-32">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-medium text-brand">
            <SparkIcon className="h-3.5 w-3.5 text-brand-accent" />
            The AI operating system for your business
          </span>

          <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
            Your business,
            <br /> <span className="bg-gradient-to-r from-brand via-blue-500 to-sky-500 bg-clip-text text-transparent">on autopilot.</span>
          </h1>

          <p className="mt-8 max-w-xl text-[17px] leading-8 text-muted">
            Turn every visitor into momentum. EnsightLabs
            answers every question, captures your best leads, books meetings,
            writes your marketing, and helps you access financing with one AI
            agent trained on your business.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_32px_rgba(37,99,235,0.45)] transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
            >
              Get started
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-medium text-fg shadow-sm transition-colors hover:border-brand/30 hover:bg-bg-soft hover:text-brand"
            >
              See how it works
            </a>
          </div>

          <p className="mt-6 text-xs text-muted">
            No card to sign up <span className="mx-2 text-blue-400">✦</span> Cancel anytime <span className="mx-2 text-blue-400">✦</span> Live in minutes
          </p>
        </div>

        <div className="relative flex min-h-[440px] items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0a1e45] via-brand to-[#123d8f] p-6 lg:overflow-visible lg:rounded-none lg:bg-none lg:p-0 lg:justify-end">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(125,211,252,0.28),transparent_35%)] lg:hidden" />
          <div className="absolute right-8 top-4 hidden rounded-2xl border border-blue-300/20 bg-blue-400/10 px-4 py-3 text-xs text-blue-100 shadow-2xl backdrop-blur-md sm:block">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> Agent online
          </div>
          <div className="absolute bottom-8 left-2 z-20 hidden w-48 rounded-2xl border border-white/10 bg-[#0b1d3a]/90 p-4 shadow-2xl backdrop-blur-md sm:block">
            <p className="text-[10px] uppercase tracking-[0.16em] text-blue-200/60">Today&apos;s growth</p>
            <p className="mt-2 text-2xl font-semibold text-white">+38.6%</p>
            <div className="mt-3 flex h-8 items-end gap-1.5">
              {[30, 42, 34, 58, 48, 70, 88].map((h, i) => <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand to-sky-300" style={{ height: `${h}%` }} />)}
            </div>
          </div>
          <div className="relative z-10 rounded-[2rem] border border-blue-200/20 bg-white/10 p-2 shadow-[0_0_80px_rgba(37,99,235,0.4)] backdrop-blur-sm">
            <div className="animate-float rounded-[1.5rem] bg-surface p-1">
            <WidgetPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
