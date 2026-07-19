"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Agent,
  AuthError,
  type ContentDraft,
  type ContentType,
  deleteContent,
  generateContent,
  listAgents,
  listContent,
  updateContent,
} from "@/lib/api";
import { toast } from "@/components/toaster";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "blog_post", label: "Blog post" },
  { value: "product_description", label: "Product description" },
  { value: "email", label: "Email" },
  { value: "social_caption", label: "Social caption" },
  { value: "faq_answer", label: "FAQ answer" },
];

const typeLabel = (t: ContentType) =>
  CONTENT_TYPES.find((c) => c.value === t)?.label ?? t;

export default function ContentPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [drafts, setDrafts] = useState<ContentDraft[] | null>(null);

  // Form state
  const [agentId, setAgentId] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog_post");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listAgents(), listContent()])
      .then(([a, c]) => {
        setAgents(a.items);
        setAgentId(a.items[0]?.id ?? "");
        setDrafts(c.items);
      })
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else toast.error(e.message);
      });
  }, [router]);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId || !topic.trim()) return;
    setGenerating(true);
    try {
      const draft = await generateContent({
        agent_id: agentId,
        content_type: contentType,
        topic: topic.trim(),
      });
      setDrafts((prev) => [draft, ...(prev ?? [])]);
      setTopic("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't generate draft.");
    } finally {
      setGenerating(false);
    }
  }

  async function toggleApprove(d: ContentDraft) {
    const next = d.status === "approved" ? "draft" : "approved";
    setDrafts((prev) =>
      prev?.map((x) => (x.id === d.id ? { ...x, status: next } : x)) ?? prev,
    );
    try {
      await updateContent(d.id, { status: next });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update draft.");
      setDrafts((prev) => prev?.map((x) => (x.id === d.id ? d : x)) ?? prev);
    }
  }

  async function remove(d: ContentDraft) {
    setDrafts((prev) => prev?.filter((x) => x.id !== d.id) ?? prev);
    try {
      await deleteContent(d.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete draft.");
      setDrafts((prev) => (prev ? [d, ...prev] : prev));
    }
  }

  async function copyBody(d: ContentDraft) {
    await navigator.clipboard.writeText(d.body);
    setCopiedId(d.id);
    setTimeout(() => setCopiedId((id) => (id === d.id ? null : id)), 1500);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
      <p className="mt-1 text-sm text-muted">
        Draft marketing copy grounded in your agents&apos; knowledge.
      </p>

      {/* Generate form */}
      <form
        onSubmit={onGenerate}
        className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm"
      >
        {agents.length === 0 ? (
          <p className="text-sm text-muted">
            Create an agent first to generate content.
          </p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1.5 block font-medium">Agent</span>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block font-medium">Type</span>
                <select
                  value={contentType}
                  onChange={(e) =>
                    setContentType(e.target.value as ContentType)
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-3 block text-sm">
              <span className="mb-1.5 block font-medium">Topic</span>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Our new summer pricing"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <button
              type="submit"
              disabled={generating || !topic.trim()}
              className="mt-4 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft disabled:opacity-60"
            >
              {generating ? "Generating…" : "Generate draft"}
            </button>
          </>
        )}
      </form>

      {/* Drafts */}
      {drafts === null ? (
        <p className="mt-8 text-sm text-muted">Loading drafts…</p>
      ) : drafts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
          No drafts yet. Generate your first one above.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {drafts.map((d, i) => (
            <li
              key={d.id}
              style={{ animationDelay: `${i * 45}ms` }}
              className="animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                  {typeLabel(d.content_type)}
                </span>
                {d.grounded && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                    Grounded
                  </span>
                )}
                {d.status === "approved" && (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    Approved
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold">{d.topic}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg/80">
                {d.body}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-sm">
                <button
                  onClick={() => toggleApprove(d)}
                  className="font-medium text-brand hover:underline"
                >
                  {d.status === "approved" ? "Unapprove" : "Approve"}
                </button>
                <button
                  onClick={() => copyBody(d)}
                  className="text-muted transition-colors hover:text-fg"
                >
                  {copiedId === d.id ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => remove(d)}
                  className="text-muted transition-colors hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
