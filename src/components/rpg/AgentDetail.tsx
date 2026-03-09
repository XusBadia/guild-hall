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
      <div
        className="modal-content w-full max-w-2xl mx-4 rpg-panel-gold animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "2px solid var(--gh-border-gold-dim)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{agent.rpgEmoji}</span>
            <h2 className="font-pixel text-sm" style={{ color: "var(--gh-gold)" }}>
              {agent.name}
            </h2>
            <div
              className="font-rpg text-base px-3 py-0.5 rounded-sm"
              style={{
                background: statusInfo.bg,
                color: statusInfo.color,
                border: `1px solid ${statusInfo.color}30`,
              }}
            >
              {statusInfo.label}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-rpg text-2xl hover:text-white transition-colors cursor-pointer"
            style={{ color: "var(--gh-text-faint)" }}
          >
            ✕
          </button>
        </div>

        {/* Main content — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* LEFT COLUMN: Sprite + Identity */}
          <div className="p-5 flex flex-col gap-4" style={{ borderRight: "1px solid var(--gh-border)" }}>

            {/* Large Sprite */}
            <div className="flex justify-center">
              <div
                className="w-32 h-32 sprite-container rounded-sm"
                style={{
                  border: "3px solid var(--gh-border-gold-dim)",
                  background: "var(--gh-bg-deep)",
                  boxShadow: "inset 0 0 16px rgba(0,0,0,0.6), 0 0 20px rgba(200, 168, 78, 0.1)",
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
            </div>

            {/* Class Badge */}
            <div className="flex items-center justify-center gap-3">
              <div
                className="font-pixel text-[8px] px-3 py-1.5 rounded-sm text-center"
                style={{
                  background: "linear-gradient(135deg, var(--gh-bg-deep), var(--gh-bg-card))",
                  color: "var(--gh-purple)",
                  border: "1px solid var(--gh-purple)",
                  boxShadow: "0 0 8px rgba(167, 139, 250, 0.15)",
                }}
              >
                {agent.rpgClass}
              </div>
              <div
                className="font-pixel text-[8px] px-3 py-1.5 rounded-sm text-center"
                style={{
                  background: "linear-gradient(135deg, #92400e20, #b4530920)",
                  color: "#fde68a",
                  border: "1px solid #d97706",
                }}
              >
                LV. {agent.rpgLevel}
              </div>
            </div>

            {/* XP Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[7px]" style={{ color: "var(--gh-text-dim)" }}>
                  EXPERIENCE
                </span>
                <span className="font-rpg text-sm" style={{ color: "var(--gh-emerald)" }}>
                  {agent.rpgXp} / {agent.rpgXpToNext}
                </span>
              </div>
              <div className="xp-bar-track rounded-sm">
                <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>

            {/* Lore */}
            <div className="rpg-panel p-3">
              <h4 className="font-pixel text-[7px] mb-2" style={{ color: "var(--gh-gold)" }}>
                LORE
              </h4>
              <p className="font-rpg text-base leading-relaxed" style={{ color: "var(--gh-text)" }}>
                "{agent.lore}"
              </p>
            </div>

            {/* Zone */}
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[7px]" style={{ color: "var(--gh-text-faint)" }}>
                ZONE
              </span>
              <span className="font-rpg text-base" style={{ color: "var(--gh-gold-light)" }}>
                📍 {agent.rpgZone}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats + Combat Record */}
          <div className="p-5 flex flex-col gap-4">

            {/* Stats Radar */}
            <div>
              <h4 className="font-pixel text-[7px] mb-3" style={{ color: "var(--gh-gold)" }}>
                ATTRIBUTES
              </h4>
              <div className="flex justify-center mb-3">
                <StatsRadar stats={agent.rpgStats} size={180} />
              </div>
            </div>

            {/* Stat Bars */}
            <div className="flex flex-col gap-2">
              {STAT_KEYS.map((key) => {
                const val = agent.rpgStats[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className="font-pixel text-[7px] w-8 text-right"
                      style={{ color: "var(--gh-text-faint)" }}
                    >
                      {STAT_LABELS[key]}
                    </span>
                    <div className="stat-bar-track flex-1 rounded-sm h-2">
                      <div
                        className="stat-bar-fill h-full"
                        style={{
                          width: `${val * 10}%`,
                          backgroundColor: getStatColor(val),
                        }}
                      />
                    </div>
                    <span
                      className="font-rpg text-base w-5 text-center font-bold"
                      style={{ color: getStatColor(val) }}
                    >
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Combat Record */}
            <div className="rpg-panel p-3 mt-1">
              <h4 className="font-pixel text-[7px] mb-3" style={{ color: "var(--gh-gold)" }}>
                GUILD RECORD
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="font-rpg text-2xl font-bold" style={{ color: "var(--gh-emerald)" }}>
                    {agent.rpgTasksCompleted}
                  </div>
                  <div className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>
                    Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-rpg text-2xl font-bold" style={{ color: "var(--gh-red)" }}>
                    {agent.rpgTasksFailed}
                  </div>
                  <div className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>
                    Failed
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-rpg text-2xl font-bold" style={{ color: "var(--gh-amber)" }}>
                    {agent.rpgStreak}
                  </div>
                  <div className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>
                    🔥 Streak
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            {agent.rpgTitle && (
              <div className="text-center">
                <span
                  className="font-pixel text-[7px] px-4 py-1.5 rounded-sm inline-block"
                  style={{
                    background: "linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(200, 168, 78, 0.05))",
                    color: "var(--gh-gold)",
                    border: "1px solid var(--gh-border-gold-dim)",
                  }}
                >
                  ✦ {agent.rpgTitle} ✦
                </span>
              </div>
            )}

            {/* Task History placeholder */}
            <div className="rpg-panel p-3">
              <h4 className="font-pixel text-[7px] mb-2" style={{ color: "var(--gh-gold)" }}>
                RECENT QUESTS
              </h4>
              <div className="space-y-2">
                {[
                  { name: "System patrol", status: "✓", time: "2h ago" },
                  { name: "Data analysis", status: "✓", time: "5h ago" },
                  { name: "Alert response", status: "…", time: "ongoing" },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-rpg text-sm" style={{ color: "var(--gh-text-dim)" }}>
                      {task.status} {task.name}
                    </span>
                    <span className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>
                      {task.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
