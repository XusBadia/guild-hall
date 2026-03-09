import type { GuildAgent } from "../../data/agents";

interface MissionsViewProps {
  agents: GuildAgent[];
}

const MOCK_MISSIONS = [
  {
    id: "m1",
    name: "Daily Reconnaissance",
    type: "RECURRING",
    difficulty: "★★",
    status: "active",
    assignee: "Herald",
    description: "Scan all news feeds and report emerging trends.",
    reward: "15 XP",
  },
  {
    id: "m2",
    name: "Code Forge: API Refactor",
    type: "QUEST",
    difficulty: "★★★★",
    status: "active",
    assignee: "Forgex",
    description: "Refactor the authentication module for better performance.",
    reward: "40 XP",
  },
  {
    id: "m3",
    name: "Treasury Audit Q1",
    type: "QUEST",
    difficulty: "★★★",
    status: "pending",
    assignee: "Goldrak",
    description: "Complete quarterly financial reconciliation.",
    reward: "30 XP",
  },
  {
    id: "m4",
    name: "Perimeter Security Scan",
    type: "RECURRING",
    difficulty: "★★",
    status: "active",
    assignee: "Sentinel",
    description: "Run full security audit on all endpoints.",
    reward: "20 XP",
  },
  {
    id: "m5",
    name: "Research: LLM Benchmarks",
    type: "QUEST",
    difficulty: "★★★★★",
    status: "pending",
    assignee: "Arcanix",
    description: "Deep analysis of latest model performance metrics.",
    reward: "50 XP",
  },
  {
    id: "m6",
    name: "Content Draft: Weekly Update",
    type: "RECURRING",
    difficulty: "★★",
    status: "completed",
    assignee: "Quillon",
    description: "Write and publish the weekly guild newsletter.",
    reward: "15 XP",
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "active":
      return { color: "#34d399", bg: "rgba(52, 211, 153, 0.1)", border: "rgba(52, 211, 153, 0.3)", label: "⚔ ACTIVE" };
    case "completed":
      return { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.3)", label: "✓ DONE" };
    default:
      return { color: "#94a3b8", bg: "rgba(148, 163, 184, 0.05)", border: "rgba(148, 163, 184, 0.2)", label: "◌ PENDING" };
  }
}

export default function MissionsView({ agents }: MissionsViewProps) {
  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto p-4 md:p-6 rpg-bg-pattern rpg-grid-bg">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-pixel text-[9px] md:text-[10px]" style={{ color: "var(--gh-gold)" }}>
          📜 MISSION BOARD
        </h2>
        <span className="font-rpg text-sm" style={{ color: "var(--gh-text-faint)" }}>
          {MOCK_MISSIONS.filter((m) => m.status === "active").length} active ·{" "}
          {MOCK_MISSIONS.filter((m) => m.status === "pending").length} pending
        </span>
      </div>

      {/* Missions List */}
      <div className="flex flex-col gap-3">
        {MOCK_MISSIONS.map((mission) => {
          const s = getStatusStyle(mission.status);
          const assigneeAgent = agents.find((a) => a.name === mission.assignee);

          return (
            <div
              key={mission.id}
              className="rpg-panel-gold p-4 hover:translate-y-[-2px] transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Mission info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-pixel text-[8px]" style={{ color: "var(--gh-text)" }}>
                      {mission.name}
                    </h3>
                    <span
                      className="font-rpg text-xs px-2 py-0.5 rounded-sm shrink-0"
                      style={{
                        background: s.bg,
                        color: s.color,
                        border: `1px solid ${s.border}`,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="font-rpg text-sm" style={{ color: "var(--gh-text-dim)" }}>
                    {mission.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>
                      TYPE: {mission.type}
                    </span>
                    <span className="font-rpg text-xs" style={{ color: "var(--gh-amber)" }}>
                      {mission.difficulty}
                    </span>
                    <span className="font-rpg text-xs" style={{ color: "var(--gh-emerald)" }}>
                      {mission.reward}
                    </span>
                  </div>
                </div>

                {/* Right: Assignee */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {assigneeAgent && (
                    <div
                      className="w-10 h-10 sprite-container rounded-sm"
                      style={{
                        border: "1px solid var(--gh-border-gold-dim)",
                        background: "var(--gh-bg-deep)",
                      }}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${assigneeAgent.spriteSheet})`,
                          backgroundSize: "400% 400%",
                          backgroundPosition: "0% 0%",
                          imageRendering: "pixelated",
                        }}
                      />
                    </div>
                  )}
                  <span className="font-rpg text-xs" style={{ color: "var(--gh-text-dim)" }}>
                    {mission.assignee}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
