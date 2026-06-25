"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthError,
  type ConversationDetail,
  type ConversationSummary,
  getConversation,
  listConversations,
  qualifyLead,
} from "@/lib/api";
import { cleanAgentText } from "@/lib/text";
import { AgentPicker, useAgentPicker } from "@/components/dashboard/agent-picker";

export default function ConversationsPage() {
  const router = useRouter();
  const picker = useAgentPicker();
  const [conversations, setConversations] = useState<
    ConversationSummary[] | null
  >(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qualifying, setQualifying] = useState(false);
  const [qualifyMsg, setQualifyMsg] = useState<string | null>(null);

  const agentId = picker.agentId;

  async function qualify(c: ConversationSummary) {
    setQualifying(true);
    setQualifyMsg(null);
    try {
      const lead = await qualifyLead(c.agent_id, c.id);
      setQualifyMsg(
        lead.status === "unqualified"
          ? "Reviewed — not a sales lead."
          : `Saved as a ${lead.status} lead (score ${lead.score}).`,
      );
    } catch (e) {
      setQualifyMsg(e instanceof Error ? e.message : "Couldn't qualify.");
    } finally {
      setQualifying(false);
    }
  }

  useEffect(() => {
    if (!agentId) return;
    setConversations(null);
    setOpenId(null);
    setDetail(null);
    listConversations(agentId)
      .then((p) => setConversations(p.items))
      .catch((e) => {
        if (e instanceof AuthError) router.replace("/login");
        else setError(e.message);
      });
  }, [agentId, router]);

  async function toggle(c: ConversationSummary) {
    if (openId === c.id) {
      setOpenId(null);
      return;
    }
    setOpenId(c.id);
    setDetail(null);
    setQualifyMsg(null);
    try {
      setDetail(await getConversation(c.agent_id, c.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load conversation.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>
      <p className="mt-1 text-sm text-muted">
        Every chat your agents have had with visitors.
      </p>

      <div className="mt-6">
        <AgentPicker picker={picker} />
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {picker.agents !== null && picker.agents.length === 0 ? (
        <Empty>Create an agent first.</Empty>
      ) : conversations === null ? (
        <p className="mt-8 text-sm text-muted">Loading conversations…</p>
      ) : conversations.length === 0 ? (
        <Empty>No conversations yet for this agent.</Empty>
      ) : (
        <ul className="mt-6 space-y-3">
          {conversations.map((c, i) => (
            <li
              key={c.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
            >
              <button
                onClick={() => toggle(c)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-bg-soft/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Visitor {c.visitor_id.slice(0, 12)}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(c.started_at).toLocaleString()} · {c.channel}
                    {c.language ? ` · ${c.language}` : ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                  {c.message_count} msgs
                </span>
              </button>

              {openId === c.id && (
                <div className="animate-fade-in border-t border-border bg-bg-soft/40 px-5 py-4">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => qualify(c)}
                      disabled={qualifying}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium transition-colors hover:bg-bg-soft disabled:opacity-60"
                    >
                      {qualifying ? "Qualifying…" : "Qualify as lead"}
                    </button>
                    {qualifyMsg && (
                      <span className="text-xs text-muted">{qualifyMsg}</span>
                    )}
                  </div>
                  {detail === null ? (
                    <p className="text-sm text-muted">Loading…</p>
                  ) : (
                    <div className="space-y-2.5">
                      {detail.messages.map((m) => (
                        <div
                          key={m.id}
                          className={
                            m.role === "user"
                              ? "flex justify-end"
                              : "flex justify-start"
                          }
                        >
                          <p
                            className={
                              m.role === "user"
                                ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-3.5 py-2 text-sm text-white"
                                : "max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2 text-sm text-fg/90"
                            }
                          >
                            {cleanAgentText(m.content)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
      {children}
    </p>
  );
}
