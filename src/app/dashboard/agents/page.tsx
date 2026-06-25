"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Agent,
  type AgentCreate,
  AuthError,
  createAgent,
  listAgents,
  updateAgent,
  uploadDocument,
} from "@/lib/api";
import { PlusIcon, UploadIcon } from "@/components/icons";

const DURATIONS = [15, 30, 45, 60];

export default function AgentsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [embedFor, setEmbedFor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    listAgents()
      .then((page) => setAgents(page.items))
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e.message);
      });
  }, [router]);

  async function patch(
    agent: Agent,
    changes: Partial<Pick<Agent, "booking_enabled" | "meeting_duration_minutes">>,
  ) {
    setSavingId(agent.id);
    setError(null);
    setAgents((prev) =>
      prev?.map((a) => (a.id === agent.id ? { ...a, ...changes } : a)) ?? prev,
    );
    try {
      await updateAgent(agent.id, changes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save changes.");
      setAgents((prev) =>
        prev?.map((a) => (a.id === agent.id ? agent : a)) ?? prev,
      );
    } finally {
      setSavingId(null);
    }
  }

  async function handleUpload(agent: Agent, file: File) {
    setUploadStatus((s) => ({ ...s, [agent.id]: `Uploading ${file.name}…` }));
    try {
      const { chunks_indexed } = await uploadDocument(agent.id, file);
      setUploadStatus((s) => ({
        ...s,
        [agent.id]: `Trained on ${file.name} (${chunks_indexed} chunks).`,
      }));
    } catch (e) {
      setUploadStatus((s) => ({
        ...s,
        [agent.id]: e instanceof Error ? e.message : "Upload failed.",
      }));
    }
  }

  function widgetUrl(agent: Agent) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const q = new URLSearchParams({
      color: agent.background_color,
      name: agent.name,
      position: agent.position,
    });
    return `${origin}/w/${agent.public_key}?${q.toString()}`;
  }

  function embedSnippet(agent: Agent) {
    const sidePin = agent.position === "bottom-left" ? "left:0" : "right:0";
    return `<iframe src="${widgetUrl(agent)}" style="position:fixed;bottom:0;${sidePin};width:420px;height:600px;border:0;background:transparent;z-index:2147483647" allow="clipboard-write"></iframe>`;
  }

  async function copyEmbed(agent: Agent) {
    await navigator.clipboard.writeText(embedSnippet(agent));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
          <p className="mt-1 text-sm text-muted">
            Create agents, train them on your docs, and turn on booking.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft"
        >
          <PlusIcon className="h-4 w-4" />
          New agent
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {agents === null ? (
        <p className="mt-8 text-sm text-muted">Loading agents…</p>
      ) : agents.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-muted">
            No agents yet. Create your first one to get started.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-soft"
          >
            <PlusIcon className="h-4 w-4" />
            New agent
          </button>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {agents.map((agent, i) => (
            <li
              key={agent.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-up rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-9 w-9 shrink-0 rounded-lg"
                    style={{ backgroundColor: agent.background_color }}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{agent.name}</p>
                    <p className="text-xs capitalize text-muted">
                      {agent.capability} · {agent.position.replace("-", " ")}
                    </p>
                  </div>
                </div>
                <Toggle
                  on={agent.booking_enabled}
                  busy={savingId === agent.id}
                  onChange={(on) => patch(agent, { booking_enabled: on })}
                />
              </div>

              {agent.booking_enabled && (
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <label className="text-sm text-muted">Meeting length</label>
                  <select
                    value={agent.meeting_duration_minutes}
                    disabled={savingId === agent.id}
                    onChange={(e) =>
                      patch(agent, {
                        meeting_duration_minutes: Number(e.target.value),
                      })
                    }
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d} minutes
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Train */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
                <UploadButton
                  onFile={(file) => handleUpload(agent, file)}
                />
                {uploadStatus[agent.id] && (
                  <span className="text-xs text-muted">
                    {uploadStatus[agent.id]}
                  </span>
                )}
              </div>

              {/* Preview + embed */}
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-sm">
                <a
                  href={widgetUrl(agent)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-brand hover:underline"
                >
                  Preview ↗
                </a>
                <button
                  onClick={() =>
                    setEmbedFor(embedFor === agent.id ? null : agent.id)
                  }
                  className="text-muted transition-colors hover:text-fg"
                >
                  {embedFor === agent.id ? "Hide embed code" : "Embed code"}
                </button>
              </div>

              {embedFor === agent.id && (
                <div className="mt-3 animate-fade-in">
                  <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-200">
                    {embedSnippet(agent)}
                  </pre>
                  <button
                    onClick={() => copyEmbed(agent)}
                    className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-bg-soft"
                  >
                    {copied ? "Copied!" : "Copy code"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showCreate && (
        <CreateAgentModal
          onClose={() => setShowCreate(false)}
          onCreated={(agent) => {
            setAgents((prev) => [agent, ...(prev ?? [])]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function UploadButton({ onFile }: { onFile: (file: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-bg-soft"
      >
        <UploadIcon className="h-4 w-4" />
        Upload document
      </button>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.docx,.txt"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </>
  );
}

function Toggle({
  on,
  busy,
  onChange,
}: {
  on: boolean;
  busy: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={() => onChange(!on)}
      title="Booking"
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
        on ? "bg-brand" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function CreateAgentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (agent: Agent) => void;
}) {
  const [form, setForm] = useState<AgentCreate>({
    name: "",
    capability: "chat",
    background_color: "#2563eb",
    position: "bottom-right",
    booking_enabled: false,
    meeting_duration_minutes: 30,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const agent = await createAgent(form);
      onCreated(agent);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't create agent.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md animate-scale-in rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold">New agent</h2>

        <label className="mt-5 block text-sm">
          <span className="mb-1.5 block font-medium">Name</span>
          <input
            autoFocus
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Support Assistant"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="mb-1.5 block font-medium">Capability</span>
            <select
              value={form.capability}
              onChange={(e) =>
                setForm({
                  ...form,
                  capability: e.target.value as AgentCreate["capability"],
                })
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="chat">Chat</option>
              <option value="voice">Voice</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-medium">Position</span>
            <select
              value={form.position}
              onChange={(e) =>
                setForm({
                  ...form,
                  position: e.target.value as AgentCreate["position"],
                })
              }
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
            </select>
          </label>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm">
          <span className="font-medium">Widget color</span>
          <input
            type="color"
            value={form.background_color}
            onChange={(e) =>
              setForm({ ...form, background_color: e.target.value })
            }
            className="h-9 w-14 cursor-pointer rounded border border-border bg-surface"
          />
          <span className="text-muted">{form.background_color}</span>
        </label>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-bg-soft"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create agent"}
          </button>
        </div>
      </form>
    </div>
  );
}
