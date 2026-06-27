import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "EnsightLabs builds AI agents that don't just answer your website visitors — they qualify leads, book meetings, draft content, and help you access financing.",
};

const values = [
  {
    title: "Answers should lead to action",
    body: "A visitor with a question is a customer in the making. Our agents capture that moment — collecting details, booking the meeting, closing the loop — instead of handing it to a form.",
  },
  {
    title: "Grounded, not made up",
    body: "Every answer is trained on your own documents and checked against them. We'd rather an agent say 'let me connect you' than invent something.",
  },
  {
    title: "Access for the underserved",
    body: "The same activity that runs your agent can prove your business is real. We turn it into a loan-readiness profile, so good businesses without formal records can still reach finance.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="absolute left-1/2 top-[-8rem] -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

          <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-28">
            <span className="inline-block rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
              About us
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              We turn website visitors into{" "}
              <span className="text-gradient">customers</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              EnsightLabs gives any business — or coach — a custom AI agent that
              knows their business by heart. It answers visitors, spots the best
              sales leads, books meetings, drafts marketing copy, and even helps
              the business access financing — all from one platform.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-8">
          <div className="prose-none space-y-6 text-fg/85">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">
              Why we exist
            </h2>
            <p>
              Most websites do a poor job the moment a real conversation starts.
              A visitor asks a question at midnight, doesn&apos;t find the
              answer, fills out a form, and waits — and by morning they&apos;ve
              already messaged someone else. The traffic was never the problem;
              the conversation dying on the page was.
            </p>
            <p>
              We built EnsightLabs to close that gap. You train an agent on your
              own content, drop it on your site in minutes, and it carries the
              conversation all the way to an outcome — a qualified lead, a booked
              meeting, a draft you can ship. And because the agent quietly learns
              what your audience actually needs, every chat makes your business
              smarter.
            </p>
            <p>
              For many small businesses, that same activity unlocks something
              bigger: proof. Lenders ask for records that early businesses
              don&apos;t have. EnsightLabs turns real customer demand into a
              loan-readiness profile and a lender-ready application — so the
              businesses doing the work can actually get funded.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-14">
          <div className="grid gap-5 sm:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-24 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Get started today
          </h2>
          <p className="mt-3 text-muted">
            No card to sign up. Live on your site in minutes.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-soft"
          >
            Get started
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
