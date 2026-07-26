"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthError, listAgents, listContent, listLeads } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { ArrowIcon, BotIcon, MessageIcon, PenIcon, TargetIcon } from "@/components/icons";

interface Counts {
  agents: number;
  leads: number;
  drafts: number;
}

const cards = [
  {
    href: "/dashboard/leads",
    title: "Leads",
    blurb: "Visitors your agents flagged as sales-ready.",
    key: "leads" as const,
    icon: TargetIcon,
    color: "text-violet-600 bg-violet-50",
  },
  {
    href: "/dashboard/content",
    title: "Content drafts",
    blurb: "Marketing copy your agents drafted for you.",
    key: "drafts" as const,
    icon: PenIcon,
    color: "text-amber-600 bg-amber-50",
  },
  {
    href: "/dashboard/agents",
    title: "Agents",
    blurb: "Create agents and turn on meeting booking.",
    key: "agents" as const,
    icon: BotIcon,
    color: "text-brand bg-brand/10",
  },
];

export default function OverviewPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Counts | null>(null);
  const firstName = getUser()?.email?.split("@")[0] ?? null;

  useEffect(() => {
    Promise.all([listAgents(), listLeads(), listContent()])
      .then(([a, l, c]) =>
        setCounts({ agents: a.total, leads: l.total, drafts: c.total }),
      )
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
      });
  }, [router]);

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-brand px-6 py-7 text-white shadow-xl shadow-brand/15 sm:px-8 sm:py-8">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Your workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-2 text-sm leading-6 text-blue-100">
            Here&apos;s a quick look at what your AI agents have been up to.
          </p>
        </div>
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[28px] border-white/10" />
        <div className="absolute -bottom-28 right-20 h-52 w-52 rounded-full border-[22px] border-white/10" />
      </section>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            style={{ animationDelay: `${i * 70}ms` }}
            className="group animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}><c.icon className="h-5 w-5" /></span>
              <ArrowIcon className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
            </div>
            <p className="mt-5 text-3xl font-semibold tabular-nums">
              {counts ? counts[c.key] : <span className="inline-block h-8 w-10 animate-pulse rounded bg-slate-200" />}
            </p>
            <p className="mt-1 font-medium">{c.title}</p>
            <p className="mt-1 text-sm leading-5 text-muted">{c.blurb}</p>
          </Link>
        ))}
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="animate-fade-up rounded-2xl border border-border bg-surface p-6 shadow-sm" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand"><MessageIcon className="h-5 w-5" /></span><h2 className="font-semibold">Getting started</h2></div>
        <p className="mt-2 text-sm text-muted">Set up your workspace in a few simple steps.</p>
        <ol className="mt-3 space-y-1.5 text-sm text-muted">
          <li>1. Create an agent and upload documents to train it.</li>
          <li>2. Connect Google Calendar in Settings to enable booking.</li>
          <li>3. Grab the embed code and add the widget to your site.</li>
        </ol>
        <Link
          href="/dashboard/agents"
          className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft"
        >
          Create your first agent
        </Link>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Need a hand?</p>
        <h2 className="mt-2 text-lg font-semibold">Build a better AI experience</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Train your agents with your best content and let them handle conversations around the clock.</p>
        <Link href="/dashboard/agents" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-soft">Explore agents <ArrowIcon className="h-4 w-4" /></Link>
      </div>
      </div>
    </div>
  );
}
