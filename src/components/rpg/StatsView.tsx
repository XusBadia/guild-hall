import type { GuildAgent } from "../../data/agents";
import { STAT_KEYS, STAT_LABELS } from "../../data/agents";
import StatsRadar from "./StatsRadar";

interface StatsViewProps {
  agents: GuildAgent[];
}

export default function StatsView({ agents }: StatsViewProps) {
  const totalTasks = agents.reduce((sum, a) => sum + a.rpgTasksCompleted, 0);
  const totalFailed = agents.reduce((sum, a) => sum + a.rpgTasksFailed, 0);
  const totalLevel = agents.reduce((sum, a) => sum + a.rpgLevel, 0);
  const avgLevel = (totalLevel / agents.length).toFixed(1);
  const activeCount = agents.filter((a) => a.status === "active").length;
  const successRate = totalTasks > 0 ? ((totalTasks / (totalTasks + totalFailed)) * 100).toFixed(1) : "0";

  // Guild average stats
  const avgStats = STAT_KEYS.reduce((acc, key) => {
    acc[key] = Math.round(agents.reduce((sum, a) => sum + a.rpgStats[key], 0) / agents.length);
    return acc;
  }, {} as Record<string, number>);

  // Top agents per stat
  const topAgents = STAT_KEYS.map((key) => {
    const sorted = [...agents].sort((a, b) => b.rpgStats[key] - a.rpgStats[key]);
    return { stat: key, agent: sorted[0] };
  });

  // Most productive
  const sortedByTasks = [...agents].sort((a, b) => b.rpgTasksCompleted - a.rpgTasksCompleted);
  const sortedByStreak = [...agents].sort((a, b) => b.rpgStreak - a.rpgStreak);

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto p-4 md:p-6 rpg-bg-pattern rpg-grid-bg">

      {/* Header */}
      <h2 className="font-pixel text-[9px] md:text-[10px]" style={{ color: "var(--gh-gold)" }}>
        📊 GUILD STATISTICS
      </h2>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "TOTAL QUESTS", value: totalTasks, color: "var(--gh-emerald)", icon: "⚔" },
          { label: "SUCCESS RATE", value: `${successRate}%`, color: "var(--gh-gold)", icon: "🎯" },
          { label: "AVG LEVEL", value: avgLevel, color: "var(--gh-purple)", icon: "📈" },
          { label: "ACTIVE NOW", value: `${activeCount}/${agents.length}`, color: "var(--gh-emerald)", icon: "🟢" },
        ].map((stat) => (
          <div key={stat.label} className="rpg-panel p-4 text-center">
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="font-rpg text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="font-pixel text-[6px] mt-1" style={{ color: "var(--gh-text-faint)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Guild Radar */}
        <div className="rpg-panel-gold p-5">
          <h3 className="font-pixel text-[8px] mb-4" style={{ color: "var(--gh-gold)" }}>
            GUILD ATTRIBUTES (AVG)
          </h3>
          <div className="flex justify-center">
            <StatsRadar stats={avgStats as any} size={220} />
          </div>
        </div>

        {/* Top Per Stat */}
        <div className="rpg-panel-gold p-5">
          <h3 className="font-pixel text-[8px] mb-4" style={{ color: "var(--gh-gold)" }}>
            STAT CHAMPIONS
          </h3>
          <div className="flex flex-col gap-3">
            {topAgents.map(({ stat, agent }) => (
              <div key={stat} className="flex items-center gap-3">
                <span className="font-pixel text-[7px] w-8" style={{ color: "var(--gh-text-faint)" }}>
                  {STAT_LABELS[stat]}
                </span>
                <div
                  className="w-8 h-8 sprite-container rounded-sm shrink-0"
                  style={{
                    border: "1px solid var(--gh-border-gold-dim)",
                    background: "var(--gh-bg-deep)",
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
                <span className="font-rpg text-base" style={{ color: "var(--gh-text)" }}>
                  {agent.name}
                </span>
                <span className="font-rpg text-base font-bold ml-auto" style={{ color: "var(--gh-gold)" }}>
                  {agent.rpgStats[stat as keyof typeof agent.rpgStats]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard: Tasks */}
        <div className="rpg-panel-gold p-5">
          <h3 className="font-pixel text-[8px] mb-4" style={{ color: "var(--gh-gold)" }}>
            ⚔ QUEST LEADERBOARD
          </h3>
          <div className="flex flex-col gap-2">
            {sortedByTasks.map((agent, i) => (
              <div key={agent._id} className="flex items-center gap-3">
                <span
                  className="font-pixel text-[8px] w-5 text-center"
                  style={{ color: i < 3 ? "var(--gh-gold)" : "var(--gh-text-faint)" }}
                >
                  {i + 1}
                </span>
                <span className="text-base">{agent.rpgEmoji}</span>
                <span className="font-rpg text-base flex-1" style={{ color: "var(--gh-text)" }}>
                  {agent.name}
                </span>
                <span className="font-rpg text-base font-bold" style={{ color: "var(--gh-emerald)" }}>
                  {agent.rpgTasksCompleted}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard: Streaks */}
        <div className="rpg-panel-gold p-5">
          <h3 className="font-pixel text-[8px] mb-4" style={{ color: "var(--gh-gold)" }}>
            🔥 STREAK RANKINGS
          </h3>
          <div className="flex flex-col gap-2">
            {sortedByStreak.map((agent, i) => (
              <div key={agent._id} className="flex items-center gap-3">
                <span
                  className="font-pixel text-[8px] w-5 text-center"
                  style={{ color: i < 3 ? "var(--gh-amber)" : "var(--gh-text-faint)" }}
                >
                  {i + 1}
                </span>
                <span className="text-base">{agent.rpgEmoji}</span>
                <span className="font-rpg text-base flex-1" style={{ color: "var(--gh-text)" }}>
                  {agent.name}
                </span>
                <span className="font-rpg text-base font-bold" style={{ color: "var(--gh-amber)" }}>
                  🔥 {agent.rpgStreak}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
