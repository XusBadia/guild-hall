import type { GuildAgent } from "../../data/agents";
import GuildMap from "../GuildMap/GuildMap";

interface MapViewProps {
  agents: GuildAgent[];
}

export default function MapView({ agents }: MapViewProps) {
  const mapAgents = agents.map((agent) => ({
    _id: agent._id,
    name: agent.name,
    status: agent.status,
    rpgEmoji: agent.rpgEmoji,
    rpgZone: agent.rpgZone,
    rpgLevel: agent.rpgLevel,
    rpgClass: agent.rpgClass,
    avatar: agent.avatar,
    spriteSheet: agent.spriteSheet,
    illustration: agent.illustration,
    roomAssignment: agent.roomAssignment,
    mapSprite: agent.mapSprite,
  }));

  return (
    <div
      className="h-full overflow-y-auto rpg-bg-pattern"
      style={{ background: "linear-gradient(180deg, var(--gh-bg-deep) 0%, #0a0f1a 100%)" }}
    >
      <GuildMap agents={mapAgents} />
    </div>
  );
}
