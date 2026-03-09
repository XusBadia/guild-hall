import type { GuildAgent } from "../../data/agents";
import GuildMap from "../GuildMap/GuildMap";

interface MapViewProps {
  agents: GuildAgent[];
}

export default function MapView({ agents }: MapViewProps) {
  // Adapt our GuildAgent type to the GuildMap's expected Agent interface
  const mapAgents = agents.map((a) => ({
    _id: a._id,
    name: a.name,
    status: a.status,
    rpgEmoji: a.rpgEmoji,
    rpgZone: a.rpgZone,
    rpgLevel: a.rpgLevel,
    rpgClass: a.rpgClass,
    avatar: a.avatar,
    spriteSheet: a.spriteSheet,
  }));

  return (
    <div
      className="h-full overflow-y-auto rpg-bg-pattern rpg-grid-bg"
      style={{
        background: "linear-gradient(180deg, var(--gh-bg-deep) 0%, #0a0f1a 100%)",
      }}
    >
      <GuildMap agents={mapAgents} />
    </div>
  );
}
