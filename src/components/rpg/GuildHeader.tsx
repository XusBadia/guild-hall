import { useEffect, useState } from "react";
import { signOut } from "../../lib/auth-client";
import type { GuildAgent } from "../../data/agents";

interface GuildHeaderProps {
  agents: GuildAgent[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "agents", label: "Agents", icon: "⚔" },
  { id: "map", label: "Map", icon: "🗺" },
  { id: "missions", label: "Missions", icon: "📜" },
  { id: "stats", label: "Stats", icon: "📊" },
];

export default function GuildHeader({ agents, activeTab, onTabChange }: GuildHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalLevel = agents.reduce((sum, a) => sum + a.rpgLevel, 0);
  const guildLevel = Math.floor(totalLevel / agents.length);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <header
      className="relative z-20 flex items-center justify-between px-4 md:px-6"
      style={{
        height: "var(--header-height)",
        background: "linear-gradient(180deg, var(--gh-bg-card) 0%, var(--gh-bg-deep) 100%)",
        borderBottom: "2px solid var(--gh-border-gold-dim)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(200, 168, 78, 0.1)",
      }}
    >
      {/* Left: Title + Guild Level */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl" style={{ filter: "drop-shadow(0 0 6px rgba(251, 191, 36, 0.3))" }}>
            🏰
          </span>
          <h1
            className="font-pixel text-[10px] md:text-xs hidden sm:block"
            style={{
              color: "var(--gh-gold)",
              textShadow: "0 0 10px rgba(251, 191, 36, 0.2)",
            }}
          >
            GUILD HALL
          </h1>
        </div>

        {/* Guild Level Badge */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-sm"
          style={{
            background: "var(--gh-bg-deep)",
            border: "1px solid var(--gh-border-gold-dim)",
          }}
        >
          <span className="font-rpg text-sm" style={{ color: "var(--gh-text-faint)" }}>
            Guild Lv.
          </span>
          <span className="font-pixel text-[9px]" style={{ color: "var(--gh-gold)" }}>
            {guildLevel}
          </span>
        </div>

        {/* Active Agents */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1">
            {agents.slice(0, 5).map((a) => (
              <div
                key={a._id}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: a.status === "active" ? "#34d399" : a.status === "blocked" ? "#ef4444" : "#475569",
                }}
                title={`${a.name}: ${a.status}`}
              />
            ))}
            {agents.length > 5 && (
              <span className="font-rpg text-xs" style={{ color: "var(--gh-text-faint)" }}>
                +{agents.length - 5}
              </span>
            )}
          </div>
          <span className="font-rpg text-sm" style={{ color: "var(--gh-text-dim)" }}>
            {activeCount}/{agents.length}
          </span>
        </div>
      </div>

      {/* Center: Tabs */}
      <nav className="flex items-end gap-0" style={{ marginBottom: "-2px" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`rpg-tab ${activeTab === tab.id ? "active" : ""}`}
          >
            <span className="hidden md:inline">{tab.icon} </span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right: Time + Sign Out */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-rpg text-xl tabular-nums" style={{ color: "var(--gh-text)" }}>
            {formatTime(time)}
          </div>
        </div>
        <button
          onClick={() => void signOut()}
          className="font-rpg text-sm px-3 py-1.5 rounded-sm cursor-pointer transition-all hover:bg-red-900/30"
          style={{
            color: "var(--gh-red)",
            border: "1px solid var(--gh-red-dim)",
          }}
        >
          ⏻ EXIT
        </button>
      </div>
    </header>
  );
}
