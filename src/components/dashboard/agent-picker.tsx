"use client";

import { useEffect, useState } from "react";
import { type Agent, listAgents } from "@/lib/api";

export interface AgentPickerState {
  agents: Agent[] | null;
  agentId: string;
  setAgentId: (id: string) => void;
}

/** Loads the user's agents and tracks the selected one (defaults to first). */
export function useAgentPicker(): AgentPickerState {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [agentId, setAgentId] = useState("");

  useEffect(() => {
    listAgents()
      .then((p) => {
        setAgents(p.items);
        setAgentId((cur) => cur || p.items[0]?.id || "");
      })
      .catch(() => setAgents([]));
  }, []);

  return { agents, agentId, setAgentId };
}

export function AgentPicker({ picker }: { picker: AgentPickerState }) {
  if (picker.agents === null) {
    return <p className="text-sm text-muted">Loading agents…</p>;
  }
  if (picker.agents.length === 0) return null;

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Agent</span>
      <select
        value={picker.agentId}
        onChange={(e) => picker.setAgentId(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        {picker.agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
    </label>
  );
}
