import { useEffect, useMemo, useState } from "react";
import { ROOM_BY_ID, ROOM_DEFINITIONS, type PathNode, type RoomDefinition } from "./zones";

type SpriteDirection = "north" | "south" | "east" | "west";

interface Agent {
  _id: string;
  name: string;
  status: "idle" | "active" | "blocked";
  rpgEmoji?: string;
  rpgZone?: string;
  rpgLevel?: number;
  rpgClass?: string;
  avatar?: string;
  spriteSheet?: string;
  illustration?: string;
  roomAssignment?: string;
  mapSprite?: Partial<Record<SpriteDirection, string>>;
}

interface GuildMapProps {
  agents: Agent[];
  onSelectAgent?: (agentId: string) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computePathPosition(path: PathNode[], progress: number) {
  if (path.length === 0) return { x: 50, y: 78 };
  if (path.length === 1) return { x: path[0].x, y: path[0].y };

  const segments = path.length - 1;
  const normalized = clamp(progress, 0, 0.9999) * segments;
  const index = Math.floor(normalized);
  const local = normalized - index;
  const start = path[index];
  const end = path[index + 1] ?? start;

  return {
    x: start.x + (end.x - start.x) * local,
    y: start.y + (end.y - start.y) * local,
  };
}

function inferDirection(path: PathNode[], progress: number): SpriteDirection {
  if (path.length < 2) return "south";
  const segments = path.length - 1;
  const normalized = clamp(progress, 0, 0.9999) * segments;
  const index = Math.floor(normalized);
  const start = path[index];
  const end = path[index + 1] ?? start;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? "east" : "west";
  return dy <= 0 ? "north" : "south";
}

function getStatusStyle(status: Agent["status"]) {
  switch (status) {
    case "active":
      return {
        dot: "#34d399",
        chip: "rgba(52,211,153,.14)",
        border: "rgba(52,211,153,.35)",
        label: "ACTIVE",
      };
    case "blocked":
      return {
        dot: "#ef4444",
        chip: "rgba(239,68,68,.14)",
        border: "rgba(239,68,68,.35)",
        label: "BLOCKED",
      };
    default:
      return {
        dot: "#94a3b8",
        chip: "rgba(148,163,184,.14)",
        border: "rgba(148,163,184,.25)",
        label: "IDLE",
      };
  }
}

function RoomSprite({
  agent,
  room,
  progress,
  onSelect,
}: {
  agent: Agent;
  room: RoomDefinition;
  progress: number;
  onSelect?: () => void;
}) {
  const spawn = room.agentSpawns.find((entry) => entry.agentId === agent.name);
  const pathPos = computePathPosition(room.walkPath, progress);
  const status = getStatusStyle(agent.status);
  const direction = spawn?.facing ?? inferDirection(room.walkPath, progress);
  const sprite = agent.mapSprite?.[direction] ?? agent.mapSprite?.south;
  const position = {
    x: spawn ? spawn.x + (pathPos.x - 50) * 0.18 : pathPos.x,
    y: spawn ? spawn.y + (pathPos.y - 74) * 0.18 : pathPos.y,
  };

  return (
    <button
      type="button"
      className="group absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
      title={`${agent.name} · ${agent.rpgClass || "Agent"}`}
    >
      <div className="relative flex flex-col items-center gap-1">
        <div
          className="guild-sprite-status"
          style={{
            background: status.dot,
            boxShadow: `0 0 10px ${status.dot}`,
          }}
        />
        <div className="guild-sprite-shell">
          {sprite ? (
            <img src={sprite} alt={agent.name} className="guild-room-sprite" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg">{agent.rpgEmoji || "🤖"}</div>
          )}
        </div>
        <div className="guild-sprite-nameplate">
          <span>{agent.name}</span>
        </div>
      </div>
    </button>
  );
}

function RoomCard({
  room,
  agents,
  selected,
  onSelectRoom,
  onSelectAgent,
  tick,
}: {
  room: RoomDefinition;
  agents: Agent[];
  selected: boolean;
  onSelectRoom: () => void;
  onSelectAgent?: (agentId: string) => void;
  tick: number;
}) {
  return (
    <article
      className={`guild-room-card ${selected ? "is-selected" : ""}`}
      style={{ gridArea: room.gridArea }}
      onClick={onSelectRoom}
    >
      <div className="guild-room-art" style={{ background: room.fallbackGradient }}>
        {room.image ? (
          <img src={room.image} alt={room.nameEs} className="guild-room-image" />
        ) : (
          <div className="guild-room-missing-art">
            <span className="text-3xl">{room.icon}</span>
            <span>{room.status === "needs-art" ? "Tileset pending" : "Room ready"}</span>
          </div>
        )}
        <div className="guild-room-vignette" />
        <div className="guild-room-path-overlay" />
        {agents.map((agent, index) => (
          <RoomSprite
            key={agent._id}
            agent={agent}
            room={room}
            progress={((tick * 0.04) + index / Math.max(agents.length, 1)) % 1}
            onSelect={() => onSelectAgent?.(agent._id)}
          />
        ))}
      </div>

      <div className="guild-room-body">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="guild-room-kicker">{room.icon} {room.nameEs}</div>
            <h3 className="guild-room-title">{room.name}</h3>
          </div>
          <div className={`guild-room-status ${room.status}`}>
            {room.status === "ready" ? "art ready" : "needs art"}
          </div>
        </div>

        <p className="guild-room-description">{room.description}</p>

        <div className="guild-room-meta">
          <div>
            <span className="guild-room-meta-label">Mood</span>
            <span className="guild-room-meta-value">{room.mood}</span>
          </div>
          <div>
            <span className="guild-room-meta-label">Walk nodes</span>
            <span className="guild-room-meta-value">{room.walkPath.length}</span>
          </div>
          <div>
            <span className="guild-room-meta-label">Agents</span>
            <span className="guild-room-meta-value">{agents.length}</span>
          </div>
        </div>

        <div className="guild-room-tags">
          {room.tags.map((tag) => (
            <span key={tag} className="guild-room-tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function GuildMap({ agents, onSelectAgent }: GuildMapProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("throne-room");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handle = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 900);

    return () => window.clearInterval(handle);
  }, []);

  const agentsByRoom = useMemo(() => {
    const grouped = ROOM_DEFINITIONS.reduce<Record<string, Agent[]>>((acc, room) => {
      acc[room.id] = [];
      return acc;
    }, {});

    for (const agent of agents) {
      const roomId = agent.roomAssignment ?? "throne-room";
      if (!grouped[roomId]) grouped[roomId] = [];
      grouped[roomId].push(agent);
    }

    return grouped;
  }, [agents]);

  const selectedRoom = ROOM_BY_ID[selectedRoomId] ?? ROOM_DEFINITIONS[0];
  const selectedRoomAgents = agentsByRoom[selectedRoom.id] ?? [];
  const readyRooms = ROOM_DEFINITIONS.filter((room) => room.status === "ready").length;

  return (
    <div className="flex h-full flex-col gap-5 p-4 md:p-6">
      <div className="guild-map-hero">
        <div>
          <div className="guild-map-kicker">🗺 Real Guild Map</div>
          <h2 className="guild-map-title">Rooms first. Tileset-ready. Sprite-aware.</h2>
          <p className="guild-map-subtitle">
            The guild now runs on room definitions instead of generic colored blocks: room art, patrol paths,
            spawn points, and state-ready sprite movement all live in data.
          </p>
        </div>
        <div className="guild-map-summary-grid">
          <div className="guild-map-summary-card">
            <span className="guild-map-summary-value">{ROOM_DEFINITIONS.length}</span>
            <span className="guild-map-summary-label">rooms</span>
          </div>
          <div className="guild-map-summary-card">
            <span className="guild-map-summary-value">{readyRooms}</span>
            <span className="guild-map-summary-label">art ready</span>
          </div>
          <div className="guild-map-summary-card">
            <span className="guild-map-summary-value">{agents.length}</span>
            <span className="guild-map-summary-label">sprites placed</span>
          </div>
        </div>
      </div>

      <div className="guild-map-layout">
        <section className="guild-map-grid">
          {ROOM_DEFINITIONS.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              agents={agentsByRoom[room.id] ?? []}
              selected={selectedRoom.id === room.id}
              onSelectRoom={() => setSelectedRoomId(room.id)}
              onSelectAgent={onSelectAgent}
              tick={tick}
            />
          ))}
        </section>

        <aside className="guild-room-inspector rpg-panel-gold">
          <div className="guild-room-inspector-kicker">Room inspector</div>
          <h3 className="guild-room-inspector-title">{selectedRoom.nameEs}</h3>
          <p className="guild-room-inspector-description">{selectedRoom.description}</p>

          <div className="guild-room-inspector-section">
            <span className="guild-room-meta-label">Art brief</span>
            <p className="guild-room-inspector-copy">{selectedRoom.artBrief}</p>
          </div>

          <div className="guild-room-inspector-section">
            <span className="guild-room-meta-label">Palette</span>
            <div className="guild-palette-row">
              {selectedRoom.palette.map((color) => (
                <div key={color} className="guild-palette-chip" title={color}>
                  <span style={{ background: color }} />
                  <code>{color}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="guild-room-inspector-section">
            <span className="guild-room-meta-label">Path nodes</span>
            <div className="guild-path-list">
              {selectedRoom.walkPath.map((node, index) => (
                <div key={`${node.x}-${node.y}-${index}`} className="guild-path-node">
                  <span>Node {index + 1}</span>
                  <code>{node.x}% / {node.y}%</code>
                </div>
              ))}
            </div>
          </div>

          <div className="guild-room-inspector-section">
            <span className="guild-room-meta-label">Agents in room</span>
            <div className="guild-room-agent-list">
              {selectedRoomAgents.length > 0 ? selectedRoomAgents.map((agent) => {
                const status = getStatusStyle(agent.status);
                return (
                  <button
                    type="button"
                    key={agent._id}
                    className="guild-room-agent-item"
                    onClick={() => onSelectAgent?.(agent._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="guild-room-agent-avatar">
                        {agent.mapSprite?.south ? <img src={agent.mapSprite.south} alt={agent.name} className="guild-room-agent-avatar-img" /> : agent.rpgEmoji}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="guild-room-agent-name">{agent.name}</span>
                        <span className="guild-room-agent-role">{agent.rpgClass}</span>
                      </div>
                    </div>
                    <span className="guild-room-agent-status" style={{ background: status.chip, color: status.dot, borderColor: status.border }}>
                      {status.label}
                    </span>
                  </button>
                );
              }) : <p className="guild-room-inspector-copy">No agents assigned yet.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
