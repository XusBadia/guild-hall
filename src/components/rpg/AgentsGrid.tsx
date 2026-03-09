import { useState } from "react";
import type { GuildAgent } from "../../data/agents";
import AgentCard from "./AgentCard";
import AgentDetail from "./AgentDetail";

interface AgentsGridProps {
  agents: GuildAgent[];
}

export default function AgentsGrid({ agents }: AgentsGridProps) {
  const [selectedAgent, setSelectedAgent] = useState<GuildAgent | null>(null);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const idleCount = agents.filter((a) => a.status === "idle").length;
  const totalTasks = agents.reduce((sum, a) => sum + a.rpgTasksCompleted, 0);

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto p-4 md:p-6 rpg-bg-pattern rpg-grid-bg">

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-pixel text-[9px] md:text-[10px]" style={{ color: "var(--gh-gold)" }}>
            ⚔ GUILD ROSTER
          </h2>
          <div
            className="font-rpg text-sm px-2 py-0.5 rounded-sm"
            style={{
              background: "rgba(52, 211, 153, 0.1)",
              color: "var(--gh-emerald)",
              border: "1px solid var(--gh-emerald-dim)",
            }}
          >
            {activeCount} active
          </div>
          <div
            className="font-rpg text-sm px-2 py-0.5 rounded-sm"
            style={{
              background: "rgba(148, 163, 184, 0.05)",
              color: "var(--gh-text-faint)",
              border: "1px solid var(--gh-border)",
            }}
          >
            {idleCount} idle
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="font-rpg text-sm" style={{ color: "var(--gh-text-faint)" }}>
            ⚔ {totalTasks} total quests
          </span>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard
            key={agent._id}
            agent={agent}
            onClick={() => setSelectedAgent(agent)}
          />
        ))}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetail
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
