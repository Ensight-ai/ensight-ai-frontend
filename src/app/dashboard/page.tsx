"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthError, listAgents, listContent, listLeads } from "@/lib/api";
import { getUser } from "@/lib/auth";

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
  },
  {
    href: "/dashboard/content",
    title: "Content drafts",
    blurb: "Marketing copy your agents drafted for you.",
    key: "drafts" as const,
  },
  {
    href: "/dashboard/agents",
    title: "Agents",
    blurb: "Create agents and turn on meeting booking.",
    key: "agents" as const,
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
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Here&apos;s what your agents have been up to.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10"
          >
            <p className="text-3xl font-semibold tabular-nums">
              {counts ? (
                counts[c.key]
              ) : (
                <span className="inline-block h-8 w-10 animate-pulse rounded bg-slate-200" />
              )}
            </p>
            <p className="mt-1 font-medium">{c.title}</p>
            <p className="mt-1 text-sm text-muted">{c.blurb}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 animate-fade-up rounded-2xl border border-dashed border-border bg-surface/50 p-6" style={{ animationDelay: "240ms" }}>
        <h2 className="font-semibold">Getting started</h2>
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
    </div>
  );
}
