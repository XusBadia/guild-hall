import type { GuildAgent } from "../../data/agents";
import GuildMap from "../GuildMap/GuildMap";

interface MapViewProps {
  agents: GuildAgent[];
}

export default function MapView({ agents }: MapViewProps) {
  return (
    <div
      className="h-full overflow-y-auto rpg-bg-pattern"
      style={{ background: "linear-gradient(180deg, var(--gh-bg-deep) 0%, #0a0f1a 100%)" }}
    >
      <GuildMap agents={agents} />
    </div>
  );
}
