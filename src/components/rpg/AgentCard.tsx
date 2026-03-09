import type { GuildAgent } from "../../data/agents";
import { STAT_LABELS, STAT_KEYS } from "../../data/agents";

interface AgentCardProps {
  agent: GuildAgent;
  onClick: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "active": return { dot: "#34d399", label: "ACTIVE", glow: "rgba(52, 211, 153, 0.4)" };
    case "blocked": return { dot: "#ef4444", label: "BLOCKED", glow: "rgba(239, 68, 68, 0.4)" };
    default: return { dot: "#94a3b8", label: "IDLE", glow: "rgba(148, 163, 184, 0.3)" };
  }
}

function getStatColor(value: number): string {
  if (value >= 9) return "#fbbf24";
  if (value >= 7) return "#34d399";
  if (value >= 5) return "#60a5fa";
  return "#94a3b8";
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const status = getStatusColor(agent.status);
  const xpPercent = Math.round((agent.rpgXp / agent.rpgXpToNext) * 100);

  return (
    <div
      className="agent-card animate-card-enter rpg-panel-gold relative overflow-hidden group"
      onClick={onClick}
    >
      {/* Top ornamental border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${status.glow}, transparent)`,
        }}
      />

      {/* Card Content */}
      <div className="p-3 flex flex-col gap-2.5">

        {/* Row 1: Sprite + Name/Class */}
        <div className="flex items-start gap-3">
          {/* Sprite Frame */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-sm overflow-hidden sprite-container"
              style={{
                border: "2px solid var(--gh-border-gold-dim)",
                background: "var(--gh-bg-deep)",
                boxShadow: "inset 0 0 8px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${agent.spriteSheet})`,
                  backgroundSize: "400% 400%",
                  backgroundPosition: "0% 0%",
                  imageRendering: "pixelated",
                }}
              />
            </div>
            {/* Level badge */}
            <div
              className="absolute -bottom-1 -right-1 font-pixel text-[7px] px-1.5 py-0.5 rounded-sm"
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
                color: "#fde68a",
                border: "1px solid #d97706",
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {agent.rpgLevel}
            </div>
          </div>

          {/* Name + Class + Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base">{agent.rpgEmoji}</span>
              <h3
                className="font-pixel text-[9px] leading-tight truncate"
                style={{ color: "var(--gh-gold)" }}
              >
                {agent.name}
              </h3>
            </div>

            <div
              className="font-rpg text-sm mt-0.5 truncate"
              style={{ color: "var(--gh-text-dim)" }}
            >
              {agent.rpgClass}
            </div>

            {/* Status dot */}
            <div className="flex items-center gap-1.5 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${agent.status === "active" ? "status-dot-active" : ""}`}
                style={{ backgroundColor: status.dot, color: status.dot }}
              />
              <span
                className="font-rpg text-xs uppercase tracking-wider"
                style={{ color: status.dot }}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: XP Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-rpg text-xs" style={{ color: "var(--gh-text-dim)" }}>
              XP
            </span>
            <span className="font-rpg text-xs" style={{ color: "var(--gh-emerald)" }}>
              {agent.rpgXp}/{agent.rpgXpToNext}
            </span>
          </div>
          <div className="xp-bar-track rounded-sm">
            <div
              className="xp-bar-fill"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Row 3: Mini stat bars (shown on hover) */}
        <div className="stat-reveal overflow-hidden">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
            {STAT_KEYS.map((key) => {
              const val = agent.rpgStats[key];
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="font-rpg text-[11px] w-6 text-right"
                    style={{ color: "var(--gh-text-faint)" }}
                  >
                    {STAT_LABELS[key]}
                  </span>
                  <div className="stat-bar-track flex-1 rounded-sm">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${val * 10}%`,
                        backgroundColor: getStatColor(val),
                      }}
                    />
                  </div>
                  <span
                    className="font-rpg text-[11px] w-3 text-center"
                    style={{ color: getStatColor(val) }}
                  >
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 4: Footer stats */}
        <div className="flex items-center justify-between pt-1" style={{ borderTop: "1px solid var(--gh-border)" }}>
          <div className="flex items-center gap-1">
            <span className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>⚔</span>
            <span className="font-rpg text-xs" style={{ color: "var(--gh-text-dim)" }}>
              {agent.rpgTasksCompleted}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>🔥</span>
            <span className="font-rpg text-xs" style={{ color: "var(--gh-amber)" }}>
              {agent.rpgStreak}
            </span>
          </div>
          <div
            className="font-rpg text-[11px] px-1.5 py-0.5 rounded-sm"
            style={{
              background: "var(--gh-bg-deep)",
              color: "var(--gh-text-dim)",
              border: "1px solid var(--gh-border)",
            }}
          >
            {agent.rpgZone}
          </div>
        </div>
      </div>

    </div>
  );
}
