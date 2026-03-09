import { useCallback } from "react";
import type { GuildAgent } from "../../data/agents";
import { STAT_KEYS, STAT_LABELS } from "../../data/agents";
import StatsRadar from "./StatsRadar";

interface AgentDetailProps {
  agent: GuildAgent;
  onClose: () => void;
}

function getStatColor(value: number): string {
  if (value >= 9) return "#fbbf24";
  if (value >= 7) return "#34d399";
  if (value >= 5) return "#60a5fa";
  return "#94a3b8";
}

function getStatusInfo(status: string) {
  switch (status) {
    case "active": return { color: "#34d399", label: "ACTIVE", bg: "rgba(52, 211, 153, 0.1)" };
    case "blocked": return { color: "#ef4444", label: "BLOCKED", bg: "rgba(239, 68, 68, 0.1)" };
    default: return { color: "#94a3b8", label: "IDLE", bg: "rgba(148, 163, 184, 0.1)" };
  }
}

export default function AgentDetail({ agent, onClose }: AgentDetailProps) {
  const statusInfo = getStatusInfo(agent.status);
  const xpPercent = Math.round((agent.rpgXp / agent.rpgXpToNext) * 100);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content w-full max-w-6xl mx-4 rpg-panel-gold animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "2px solid var(--gh-border-gold-dim)" }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{agent.rpgEmoji}</span>
            <div>
              <h2 className="font-pixel text-sm" style={{ color: "var(--gh-gold)" }}>{agent.name}</h2>
              <p className="font-rpg text-lg" style={{ color: "var(--gh-text-dim)" }}>{agent.role}</p>
            </div>
            <div
              className="font-rpg text-base px-3 py-0.5 rounded-sm"
              style={{ background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.color}30` }}
            >
              {statusInfo.label}
            </div>
          </div>
          <button onClick={onClose} className="font-rpg text-2xl hover:text-white transition-colors cursor-pointer" style={{ color: "var(--gh-text-faint)" }}>✕</button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-0">
          <div className="p-5 border-b xl:border-b-0 xl:border-r" style={{ borderColor: "var(--gh-border)" }}>
            <div className="agent-detail-hero">
              <img src={agent.illustration} alt={agent.name} className="agent-detail-hero-image" />
              <div className="agent-detail-hero-overlay" />
              <div className="agent-detail-hero-copy">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="agent-detail-chip">{agent.rpgClass}</span>
                  <span className="agent-detail-chip amber">LV. {agent.rpgLevel}</span>
                  <span className="agent-detail-chip emerald">{agent.rpgTitle}</span>
                </div>
                <p className="agent-detail-lore">{agent.lore}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-5">
              <div className="rpg-panel p-4">
                <h4 className="font-pixel text-[7px] mb-3" style={{ color: "var(--gh-gold)" }}>PROGRESSION</h4>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-[7px]" style={{ color: "var(--gh-text-dim)" }}>EXPERIENCE</span>
                  <span className="font-rpg text-sm" style={{ color: "var(--gh-emerald)" }}>{agent.rpgXp} / {agent.rpgXpToNext}</span>
                </div>
                <div className="xp-bar-track rounded-sm"><div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} /></div>
                <div className="agent-detail-facts mt-4">
                  <div><span>Animal</span><strong>{agent.rpgAnimal}</strong></div>
                  <div><span>Zone</span><strong>{agent.rpgZone}</strong></div>
                  <div><span>Evolution</span><strong>Stage {agent.rpgEvolution + 1}</strong></div>
                  <div><span>Level band</span><strong>{agent.level}</strong></div>
                </div>
              </div>

              <div className="rpg-panel p-4">
                <h4 className="font-pixel text-[7px] mb-3" style={{ color: "var(--gh-gold)" }}>MAP PRESENCE</h4>
                <div className="agent-detail-sprite-row">
                  {(["north", "south", "east", "west"] as const).map((direction) => (
                    <div key={direction} className="agent-detail-sprite-card">
                      <img src={agent.mapSprite[direction]} alt={`${agent.name} ${direction}`} className="agent-detail-sprite-preview" />
                      <span>{direction}</span>
                    </div>
                  ))}
                </div>
                <p className="font-rpg text-base mt-3" style={{ color: "var(--gh-text-dim)" }}>
                  Room system is now wired for directional sprites, spawn positions, and walk paths.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div>
              <h4 className="font-pixel text-[7px] mb-3" style={{ color: "var(--gh-gold)" }}>ATTRIBUTES</h4>
              <div className="flex justify-center mb-3"><StatsRadar stats={agent.rpgStats} size={200} /></div>
            </div>

            <div className="flex flex-col gap-2">
              {STAT_KEYS.map((key) => {
                const val = agent.rpgStats[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-pixel text-[7px] w-8 text-right" style={{ color: "var(--gh-text-faint)" }}>{STAT_LABELS[key]}</span>
                    <div className="stat-bar-track flex-1 rounded-sm h-2">
                      <div className="stat-bar-fill h-full" style={{ width: `${val * 10}%`, backgroundColor: getStatColor(val) }} />
                    </div>
                    <span className="font-rpg text-base w-5 text-center font-bold" style={{ color: getStatColor(val) }}>{val}</span>
                  </div>
                );
              })}
            </div>

            <div className="rpg-panel p-4 mt-1">
              <h4 className="font-pixel text-[7px] mb-3" style={{ color: "var(--gh-gold)" }}>GUILD RECORD</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center"><div className="font-rpg text-2xl font-bold" style={{ color: "var(--gh-emerald)" }}>{agent.rpgTasksCompleted}</div><div className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>Completed</div></div>
                <div className="text-center"><div className="font-rpg text-2xl font-bold" style={{ color: "var(--gh-red)" }}>{agent.rpgTasksFailed}</div><div className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>Failed</div></div>
                <div className="text-center"><div className="font-rpg text-2xl font-bold" style={{ color: "var(--gh-amber)" }}>{agent.rpgStreak}</div><div className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>🔥 Streak</div></div>
              </div>
            </div>

            <div className="rpg-panel p-4">
              <h4 className="font-pixel text-[7px] mb-2" style={{ color: "var(--gh-gold)" }}>LOADOUT NOTES</h4>
              <ul className="agent-detail-bullets">
                <li>Primary station: {agent.rpgZone}</li>
                <li>Specialization: {agent.rpgClass}</li>
                <li>Design direction: use full illustration art for roster + detail; use small directional sprites on map.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
