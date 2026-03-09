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
  const statusColor = agent.status === "active" ? "#34d399" : agent.status === "blocked" ? "#ef4444" : "#64748b";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="group relative flex flex-col items-center gap-0.5 cursor-pointer transition-transform hover:scale-110"
      title={`${agent.name} (${agent.rpgClass || "Agent"}) — ${agent.status}`}
    >
      {/* Status indicator */}
      <div
        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full z-10"
        style={{
          backgroundColor: statusColor,
          border: "1.5px solid var(--gh-bg-deep)",
          boxShadow: `0 0 4px ${statusColor}`,
        }}
      />
      {/* Sprite */}
      <div
        className="w-10 h-10 sprite-container rounded-sm overflow-hidden"
        style={{
          border: "1.5px solid var(--gh-border-gold-dim)",
          background: "rgba(0,0,0,0.4)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        {agent.spriteSheet ? (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${agent.spriteSheet})`,
              backgroundSize: "400% 400%",
              backgroundPosition: "0% 0%",
              imageRendering: "pixelated",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            {agent.rpgEmoji || "🤖"}
          </div>
        )}
      </div>
      {/* Name */}
      <span
        className="font-pixel text-[6px] leading-none group-hover:text-white transition-colors"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        {agent.name}
      </span>
      {/* Level */}
      <span className="font-rpg text-[10px] leading-none" style={{ color: "#fbbf24" }}>
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
      className="relative rounded-sm cursor-pointer transition-all duration-200 overflow-hidden"
      style={{
        border: isSelected ? "2px solid #fbbf24" : "2px solid rgba(200, 168, 78, 0.2)",
        backgroundColor: zone.color,
        gridColumn: `${zone.gridX + 1} / span ${zone.width}`,
        gridRow: `${zone.gridY + 1} / span ${zone.height}`,
        boxShadow: isSelected
          ? "0 0 16px rgba(251, 191, 36, 0.2), inset 0 0 20px rgba(0,0,0,0.3)"
          : "inset 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Pixel pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      <div className="relative p-3">
        {/* Zone header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.2))" }}>
            {zone.icon}
          </span>
          <h3
            className="font-pixel text-[7px] tracking-wide uppercase"
            style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zone.nameEs}
          </h3>
        </div>

        {/* Agents in zone */}
        <div className="flex flex-wrap gap-3">
          {agents.map((agent) => (
            <AgentSprite
              key={agent._id}
              agent={agent}
              onClick={() => onSelectAgent?.(agent._id)}
            />
          ))}
          {agents.length === 0 && (
            <span className="font-rpg text-sm italic" style={{ color: "rgba(255,255,255,0.2)" }}>
              — Empty —
            </span>
          )}
        </div>
      </div>

      {/* Selected zone tooltip */}
      {isSelected && (
        <div
          className="absolute bottom-0 left-0 right-0 p-2 font-rpg text-sm"
          style={{
            background: "rgba(0,0,0,0.85)",
            color: "rgba(255,255,255,0.7)",
            borderTop: "1px solid rgba(200, 168, 78, 0.3)",
          }}
        >
          {zone.description}
        </div>
      )}
    </div>
  );
}

export default function GuildMap({ agents, onSelectAgent }: GuildMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

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
        map["dormitories"]?.push(agent);
      }
    }
    return map;
  }, [agents]);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalLevel = agents.reduce((sum, a) => sum + (a.rpgLevel || 1), 0);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-pixel text-[9px] md:text-[10px]" style={{ color: "var(--gh-gold)" }}>
            🗺 GUILD MAP
          </h2>
          <span className="font-rpg text-sm" style={{ color: "var(--gh-text-faint)" }}>
            {activeCount}/{agents.length} active
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-rpg text-sm" style={{ color: "var(--gh-text-faint)" }}>
            ⚔ Guild Lv. {Math.floor(totalLevel / agents.length)}
          </span>
          <div className="flex items-center gap-3 font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" /> Active
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" /> Blocked
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-500" /> Idle
            </div>
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
