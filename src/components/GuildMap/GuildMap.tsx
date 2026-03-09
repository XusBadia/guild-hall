import { useState, useMemo } from "react";
import { ZONES, AGENT_ZONES, type Zone } from "./zones";

interface Agent {
  _id: string;
  name: string;
  status: "idle" | "active" | "blocked";
  rpgEmoji?: string;
  rpgZone?: string;
  rpgLevel?: number;
  rpgClass?: string;
  avatar?: string;
  spriteSheet?: string;
}

interface GuildMapProps {
  agents: Agent[];
  onSelectAgent?: (agentId: string) => void;
}

function AgentSprite({ agent, onClick }: { agent: Agent; onClick?: () => void }) {
  const statusColor = agent.status === "active" ? "#4ade80" : agent.status === "blocked" ? "#f87171" : "#94a3b8";

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-0.5 cursor-pointer transition-transform hover:scale-110"
      title={`${agent.name} (${agent.rpgClass || "Agent"}) — ${agent.status}`}
    >
      {/* Status indicator */}
      <div
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-black/50"
        style={{ backgroundColor: statusColor }}
      />
      {/* Sprite / emoji fallback */}
      <div className="w-8 h-8 flex items-center justify-center text-lg rounded bg-black/30 border border-white/10">
        {agent.rpgEmoji || "🤖"}
      </div>
      {/* Name */}
      <span className="text-[9px] font-pixel text-white/80 group-hover:text-white leading-none">
        {agent.name}
      </span>
      {/* Level badge */}
      <span className="text-[8px] text-yellow-400/70 leading-none">
        Lv.{agent.rpgLevel || 1}
      </span>
    </button>
  );
}

function ZoneCard({
  zone,
  agents,
  isSelected,
  onClick,
  onSelectAgent,
}: {
  zone: Zone;
  agents: Agent[];
  isSelected: boolean;
  onClick: () => void;
  onSelectAgent?: (agentId: string) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-lg border-2 p-3 cursor-pointer transition-all duration-200
        ${isSelected ? "border-yellow-400 shadow-lg shadow-yellow-400/20" : "border-white/10 hover:border-white/30"}
      `}
      style={{
        backgroundColor: zone.color,
        gridColumn: `${zone.gridX + 1} / span ${zone.width}`,
        gridRow: `${zone.gridY + 1} / span ${zone.height}`,
      }}
    >
      {/* Zone header */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-lg">{zone.icon}</span>
        <h3 className="text-xs font-bold text-white/90 tracking-wide uppercase">
          {zone.nameEs}
        </h3>
      </div>

      {/* Agents in zone */}
      <div className="flex flex-wrap gap-2">
        {agents.map((agent) => (
          <AgentSprite
            key={agent._id}
            agent={agent}
            onClick={() => {
              onSelectAgent?.(agent._id);
            }}
          />
        ))}
        {agents.length === 0 && (
          <span className="text-[10px] text-white/30 italic">Vacío</span>
        )}
      </div>

      {/* Zone tooltip on hover */}
      {isSelected && (
        <div className="absolute -bottom-1 left-2 right-2 bg-black/90 text-white/80 text-[10px] p-2 rounded border border-white/10 z-10">
          {zone.description}
        </div>
      )}
    </div>
  );
}

export default function GuildMap({ agents, onSelectAgent }: GuildMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Map agents to their zones
  const agentsByZone = useMemo(() => {
    const map: Record<string, Agent[]> = {};
    for (const zone of ZONES) {
      map[zone.id] = [];
    }
    for (const agent of agents) {
      const zoneId = agent.rpgZone
        ? ZONES.find((z) => z.nameEs === agent.rpgZone || z.id === agent.rpgZone)?.id
        : AGENT_ZONES[agent.name];
      if (zoneId && map[zoneId]) {
        map[zoneId].push(agent);
      } else {
        // Default to dormitories
        map["dormitories"]?.push(agent);
      }
    }
    return map;
  }, [agents]);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalLevel = agents.reduce((sum, a) => sum + (a.rpgLevel || 1), 0);

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">
            🗺️ Guild Map
          </h2>
          <span className="text-xs text-white/50">
            {activeCount}/{agents.length} active
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span>⚔️ Guild Lv. {Math.floor(totalLevel / agents.length)}</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" /> Active
            <div className="w-2 h-2 rounded-full bg-red-400" /> Blocked
            <div className="w-2 h-2 rounded-full bg-slate-400" /> Idle
          </div>
        </div>
      </div>

      {/* Map Grid */}
      <div
        className="grid gap-2 flex-1"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
        }}
      >
        {ZONES.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            agents={agentsByZone[zone.id] || []}
            isSelected={selectedZone === zone.id}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            onSelectAgent={onSelectAgent}
          />
        ))}
      </div>
    </div>
  );
}
