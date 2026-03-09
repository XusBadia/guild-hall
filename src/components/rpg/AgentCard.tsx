import type { GuildAgent } from "../../data/agents";
import { STAT_KEYS } from "../../data/agents";

interface AgentCardProps {
  agent: GuildAgent;
  onClick: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return { dot: "#34d399", label: "ACTIVE", glow: "rgba(52, 211, 153, 0.25)" };
    case "blocked":
      return { dot: "#ef4444", label: "BLOCKED", glow: "rgba(239, 68, 68, 0.25)" };
    default:
      return { dot: "#94a3b8", label: "IDLE", glow: "rgba(148, 163, 184, 0.18)" };
  }
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const status = getStatusColor(agent.status);
  const xpPercent = Math.round((agent.rpgXp / agent.rpgXpToNext) * 100);
  const topStats = STAT_KEYS.map((key) => ({ key, value: agent.rpgStats[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <button type="button" className="agent-illustration-card animate-card-enter" onClick={onClick}>
      <div className="agent-illustration-hero" style={{ boxShadow: `inset 0 -60px 80px rgba(6,8,15,.85), 0 0 26px ${status.glow}` }}>
        <img src={agent.illustration} alt={agent.name} className="agent-illustration-image" />
        <div className="agent-illustration-overlay" />

        <div className="agent-card-topline">
          <span className="agent-card-emoji">{agent.rpgEmoji}</span>
          <span className="agent-card-level">LV {agent.rpgLevel}</span>
        </div>

        <div className="agent-card-status" style={{ color: status.dot, borderColor: `${status.dot}40`, background: `${status.dot}18` }}>
          <span className={`h-2 w-2 rounded-full ${agent.status === "active" ? "status-dot-active" : ""}`} style={{ background: status.dot }} />
          {status.label}
        </div>

        <div className="agent-card-copy">
          <p className="agent-card-kicker">{agent.role}</p>
          <h3 className="agent-card-name">{agent.name}</h3>
          <p className="agent-card-class">{agent.rpgClass}</p>
        </div>
      </div>

      <div className="agent-card-body">
        <div className="agent-card-xp-row">
          <span>XP progress</span>
          <strong>{agent.rpgXp}/{agent.rpgXpToNext}</strong>
        </div>
        <div className="xp-bar-track rounded-sm">
          <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
        </div>

        <div className="agent-card-statchips">
          {topStats.map((stat) => (
            <span key={stat.key} className="agent-card-statchip">
              {stat.key.slice(0, 3).toUpperCase()} {stat.value}
            </span>
          ))}
        </div>

        <p className="agent-card-lore">{agent.lore}</p>

        <div className="agent-card-footer">
          <div>
            <span className="agent-card-footer-label">Assigned room</span>
            <strong>{agent.rpgZone}</strong>
          </div>
          <div>
            <span className="agent-card-footer-label">Quest streak</span>
            <strong>🔥 {agent.rpgStreak}</strong>
          </div>
          <div>
            <span className="agent-card-footer-label">Completed</span>
            <strong>{agent.rpgTasksCompleted}</strong>
          </div>
        </div>
      </div>
    </button>
  );
}
