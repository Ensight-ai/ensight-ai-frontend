import Link from "next/link";
import { ArrowIcon, BankIcon, CheckIcon } from "./icons";

const points = [
  "Built from your real ensightLabs activity — no paperwork from scratch",
  "Financing options matched to your business",
  "A lender-ready application summary in one click",
];

function ReadinessMockup() {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/20 blur-3xl" />
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xl shadow-slate-300/50">
        <p className="text-sm text-muted">Loan-readiness score</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="text-4xl font-semibold tabular-nums">
            82<span className="text-lg text-muted">/100</span>
          </p>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
            Strong
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-[82%] rounded-full bg-brand" />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-bg-soft/50 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Working-capital line of credit</p>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
              High fit
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">Typical amount: $5k–$25k</p>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
          <CheckIcon className="h-3.5 w-3.5 text-brand-accent" />
          Assessed from your conversations, leads &amp; bookings
        </p>
      </div>
    </div>
  );
}

export function FinancingShowcase() {
  return (
    <section className="border-y border-border/60 bg-bg">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs text-brand">
            <BankIcon className="h-3.5 w-3.5" />
            Financial access
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Get your business <span className="text-gradient">funded</span>, not
            just found.
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Many small businesses can&apos;t get a loan because they lack formal
            records. But ensightLabs already knows your business — so it turns that
            activity into a loan-readiness profile and a lender-ready
            application, even without a long credit history.
          </p>

          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                <span className="text-fg/90">{p}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-soft"
          >
            Check your readiness
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="animate-float">
            <ReadinessMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
