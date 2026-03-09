"use client";

import { useState } from "react";
import { useSession } from "./lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { DEFAULT_TENANT_ID } from "./lib/tenant";
import { GUILD_AGENTS } from "./data/agents";
import type { GuildAgent } from "./data/agents";
import SignInForm from "./components/SignIn";
import GuildHeader from "./components/rpg/GuildHeader";
import AgentsGrid from "./components/rpg/AgentsGrid";
import MapView from "./components/rpg/MapView";
import MissionsView from "./components/rpg/MissionsView";
import StatsView from "./components/rpg/StatsView";

function useGuildAgents(): GuildAgent[] {
  // Try to fetch from Convex, fall back to static data
  let convexAgents: any[] | undefined;
  try {
    convexAgents = useQuery(api.queries.listAgents, { tenantId: DEFAULT_TENANT_ID });
  } catch {
    // Convex not connected — use static data
  }

  if (convexAgents && convexAgents.length > 0) {
    // Merge Convex data with static fallback for any missing fields
    return convexAgents.map((ca) => {
      const staticMatch = GUILD_AGENTS.find((sa) => sa.name === ca.name);
      return {
        _id: ca._id,
        name: ca.name,
        role: ca.role || staticMatch?.role || "",
        status: ca.status || "idle",
        level: ca.level || "INT",
        avatar: ca.avatar || staticMatch?.avatar || "",
        rpgClass: ca.rpgClass || staticMatch?.rpgClass || "",
        rpgLevel: ca.rpgLevel ?? staticMatch?.rpgLevel ?? 1,
        rpgXp: ca.rpgXp ?? staticMatch?.rpgXp ?? 0,
        rpgXpToNext: ca.rpgXpToNext ?? staticMatch?.rpgXpToNext ?? 100,
        rpgEvolution: ca.rpgEvolution ?? 0,
        rpgAnimal: ca.rpgAnimal || staticMatch?.rpgAnimal || "",
        rpgEmoji: ca.rpgEmoji || staticMatch?.rpgEmoji || "🤖",
        rpgZone: ca.rpgZone || staticMatch?.rpgZone || "",
        rpgStats: ca.rpgStats || staticMatch?.rpgStats || { intelligence: 5, speed: 5, reliability: 5, creativity: 5, stealth: 5, endurance: 5 },
        rpgTasksCompleted: ca.rpgTasksCompleted ?? staticMatch?.rpgTasksCompleted ?? 0,
        rpgTasksFailed: ca.rpgTasksFailed ?? staticMatch?.rpgTasksFailed ?? 0,
        rpgStreak: ca.rpgStreak ?? staticMatch?.rpgStreak ?? 0,
        rpgTitle: ca.rpgTitle || staticMatch?.rpgTitle || "",
        lore: ca.lore || staticMatch?.lore || "",
        character: ca.character || staticMatch?.character || "",
        spriteSheet: staticMatch?.spriteSheet || `/sprites/${(ca.avatar || ca.name.toLowerCase())}-sheet.png`,
      };
    });
  }

  // Use static data as-is
  return GUILD_AGENTS;
}

function GuildApp() {
  const [activeTab, setActiveTab] = useState("agents");
  const agents = useGuildAgents();

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--gh-bg-deep)" }}>
      <GuildHeader
        agents={agents}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content area */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "agents" && <AgentsGrid agents={agents} />}
        {activeTab === "map" && <MapView agents={agents} />}
        {activeTab === "missions" && <MissionsView agents={agents} />}
        {activeTab === "stats" && <StatsView agents={agents} />}
      </main>
    </div>
  );
}

export default function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div
        className="flex min-h-screen items-center justify-center rpg-bg-pattern"
        style={{ background: "var(--gh-bg-deep)" }}
      >
        <div className="flex flex-col items-center gap-4 animate-fade-in-up">
          <span className="text-4xl animate-gentle-bounce">🏰</span>
          <div
            className="font-pixel text-[8px] tracking-widest uppercase"
            style={{ color: "var(--gh-gold)" }}
          >
            Loading Guild...
          </div>
          <div className="w-32 xp-bar-track rounded-sm">
            <div
              className="xp-bar-fill"
              style={{
                width: "60%",
                animation: "shimmer 1.5s infinite",
                backgroundSize: "200% 100%",
                backgroundImage: "linear-gradient(90deg, #065f46, #34d399, #065f46)",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <SignInForm />;
  }

  return <GuildApp />;
}
