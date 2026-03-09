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
  const averageLevel = (agents.reduce((sum, a) => sum + a.rpgLevel, 0) / agents.length).toFixed(1);

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4 md:p-6 rpg-bg-pattern">
      <section className="agents-hero-panel rpg-panel-gold">
        <div>
          <div className="agents-hero-kicker">⚔ Guild roster</div>
          <h2 className="agents-hero-title">Party roster with full illustrations.</h2>
          <p className="agents-hero-copy">
            Agents keep their large illustration cards here, while the Map uses only the animated 4×4 RPG sprite sheets.
          </p>
        </div>

        <div className="agents-hero-metrics">
          <div className="agents-hero-metric">
            <strong>{activeCount}</strong>
            <span>active</span>
          </div>
          <div className="agents-hero-metric">
            <strong>{idleCount}</strong>
            <span>idle</span>
          </div>
          <div className="agents-hero-metric">
            <strong>{averageLevel}</strong>
            <span>avg lv</span>
          </div>
          <div className="agents-hero-metric">
            <strong>{totalTasks}</strong>
            <span>quests done</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent._id} agent={agent} onClick={() => setSelectedAgent(agent)} />
        ))}
      </div>

      {selectedAgent && <AgentDetail agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
    </div>
  );
}
