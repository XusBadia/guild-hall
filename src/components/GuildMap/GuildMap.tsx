import { useEffect, useMemo, useState } from "react";
import type { GuildAgent, SpriteDirection } from "../../data/agents";

const TILE_SIZE = 48;

interface TileCoord {
  x: number;
  y: number;
}

interface PatrolNode extends TileCoord {
  pauseMs?: number;
}

interface RoomSpriteLayout {
  rowsByDirection: Record<SpriteDirection, number>;
  idleColumn: number;
  walkColumns: number[];
  columns: number;
  rows: number;
  notes: string;
}

interface RoomDefinition {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  image?: string;
  fallbackGradient: string;
  width: number;
  height: number;
  floorPattern: string[];
  collisionPattern: string[];
  spawnPoints: Record<string, TileCoord>;
  patrols: Record<string, PatrolNode[]>;
  defaultFacing?: Partial<Record<string, SpriteDirection>>;
  spriteLayout: RoomSpriteLayout;
}

interface TileEntityState {
  agent: GuildAgent;
  x: number;
  y: number;
  direction: SpriteDirection;
  frame: number;
  moving: boolean;
}

interface GuildMapProps {
  agents: GuildAgent[];
}

const DEFAULT_LAYOUT: RoomSpriteLayout = {
  rowsByDirection: { south: 0, west: 1, east: 2, north: 3 },
  idleColumn: 0,
  walkColumns: [0, 1, 2, 1],
  columns: 4,
  rows: 4,
  notes:
    "Assumed 4x4 sheets use RPG rows ordered south, west, east, north with the first column as idle and columns 0-1-2-1 as the walk loop.",
};

const THRONE_ROOM: RoomDefinition = {
  id: "throne-room",
  name: "Throne Room",
  nameEs: "Sala del Trono",
  description:
    "Command hall built as a tile room: carpet lane, blocked furniture, throne dais, and fixed patrol rails.",
  image: "/map/rooms/sala-del-trono.png",
  fallbackGradient: "linear-gradient(135deg, rgba(88,22,54,.95), rgba(27,30,63,.95))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##..........##",
    "##..TTTTTT..##",
    "##....==....##",
    "##..........##",
    "##..........##",
    "##....++....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "##..........##",
    "##..######..##",
    "##..........##",
    "##..........##",
    "##..........##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Flix: { x: 6, y: 5 },
  },
  patrols: {
    Flix: [
      { x: 5, y: 5, pauseMs: 800 },
      { x: 6, y: 5 },
      { x: 7, y: 5, pauseMs: 1100 },
      { x: 6, y: 5 },
    ],
  },
  defaultFacing: { Flix: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const FORGE_ROOM: RoomDefinition = {
  id: "forge",
  name: "The Forge",
  nameEs: "La Forja",
  description:
    "A smithy room with true blocked props: furnace, workbench, anvil zone, barrel corner, and a clear center lane.",
  image: "/map/rooms/forge-room.png",
  fallbackGradient: "linear-gradient(135deg, rgba(95,34,16,.96), rgba(28,13,8,.95))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##~~~~..wwww##",
    "##~~~....www##",
    "##...AA.....##",
    "##..........##",
    "##...bb.....##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "#######..#####",
    "######....####",
    "##...##.....##",
    "##..........##",
    "##...##.....##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Forgex: { x: 6, y: 4 },
  },
  patrols: {
    Forgex: [
      { x: 5, y: 4, pauseMs: 700 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 7, y: 5, pauseMs: 900 },
      { x: 6, y: 5 },
      { x: 5, y: 4 },
    ],
  },
  defaultFacing: { Forgex: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const LIBRARY_ROOM: RoomDefinition = {
  id: "library",
  name: "Arcane Library",
  nameEs: "Biblioteca Arcana",
  description:
    "Research stacks, glowing indexes, and quiet surveillance corners for deeper intel work.",
  image: "/map/rooms/arcane-library-v2-room.png",
  fallbackGradient: "linear-gradient(135deg, rgba(16,58,45,.96), rgba(8,18,22,.92))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##bbbb..ssss##",
    "##bb......ss##",
    "##..........##",
    "##....TT....##",
    "##..........##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "######..######",
    "####......####",
    "##..........##",
    "##....##....##",
    "##..........##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Arcanix: { x: 4, y: 4 },
    Spectra: { x: 9, y: 4 },
  },
  patrols: {
    Arcanix: [
      { x: 3, y: 4, pauseMs: 900 },
      { x: 4, y: 4 },
      { x: 5, y: 4, pauseMs: 1100 },
      { x: 4, y: 4 },
    ],
    Spectra: [
      { x: 8, y: 4, pauseMs: 800 },
      { x: 9, y: 4 },
      { x: 10, y: 4, pauseMs: 700 },
      { x: 9, y: 4 },
    ],
  },
  defaultFacing: { Arcanix: "south", Spectra: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const QA_RANGE: RoomDefinition = {
  id: "range",
  name: "QA Range",
  nameEs: "Campo de Tiro",
  description:
    "Precision testing grounds for bug hunts, QA practice, and challenge runs.",
  fallbackGradient: "linear-gradient(135deg, rgba(61,82,26,.96), rgba(24,17,8,.92))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##tttt..xxxx##",
    "##tt......xx##",
    "##..........##",
    "##..........##",
    "##....cc....##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "######..######",
    "####......####",
    "##..........##",
    "##..........##",
    "##....##....##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Bugbane: { x: 6, y: 4 },
  },
  patrols: {
    Bugbane: [
      { x: 5, y: 4, pauseMs: 800 },
      { x: 6, y: 4 },
      { x: 7, y: 4, pauseMs: 1000 },
      { x: 6, y: 4 },
    ],
  },
  defaultFacing: { Bugbane: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const TREASURY_ROOM: RoomDefinition = {
  id: "treasury",
  name: "Dragon Treasury",
  nameEs: "Cueva del Dragón",
  description:
    "Vault room for coins, invoices, ledgers, and draconic financial oversight.",
  fallbackGradient: "linear-gradient(135deg, rgba(104,62,12,.97), rgba(30,14,5,.92))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##gggg..LLLL##",
    "##gg......LL##",
    "##..........##",
    "##....NN....##",
    "##..........##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "######..######",
    "####......####",
    "##..........##",
    "##....##....##",
    "##..........##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Goldrak: { x: 6, y: 4 },
  },
  patrols: {
    Goldrak: [
      { x: 5, y: 4, pauseMs: 900 },
      { x: 6, y: 4 },
      { x: 7, y: 4, pauseMs: 1300 },
      { x: 6, y: 4 },
    ],
  },
  defaultFacing: { Goldrak: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const WALLS_ROOM: RoomDefinition = {
  id: "walls",
  name: "The Walls",
  nameEs: "Las Murallas",
  description:
    "Perimeter overlook where security and scouting agents patrol the frontier.",
  fallbackGradient: "linear-gradient(135deg, rgba(61,67,89,.96), rgba(16,20,30,.92))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##WWWW..WWWW##",
    "##WW......WW##",
    "##..........##",
    "##....hh....##",
    "##..........##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "######..######",
    "####......####",
    "##..........##",
    "##....##....##",
    "##..........##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Herald: { x: 4, y: 4 },
    Sentinel: { x: 9, y: 4 },
  },
  patrols: {
    Herald: [
      { x: 3, y: 4, pauseMs: 700 },
      { x: 4, y: 4 },
      { x: 5, y: 4, pauseMs: 900 },
      { x: 4, y: 4 },
    ],
    Sentinel: [
      { x: 8, y: 4, pauseMs: 900 },
      { x: 9, y: 4 },
      { x: 10, y: 4, pauseMs: 700 },
      { x: 9, y: 4 },
    ],
  },
  defaultFacing: { Herald: "east", Sentinel: "west" },
  spriteLayout: DEFAULT_LAYOUT,
};

const TOWER_ROOM: RoomDefinition = {
  id: "tower",
  name: "Lightning Tower",
  nameEs: "Torre del Rayo",
  description:
    "Home systems control room filled with electric conduits and ambient automation magic.",
  fallbackGradient: "linear-gradient(135deg, rgba(28,67,110,.97), rgba(11,16,33,.93))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##eeee..cccc##",
    "##ee......cc##",
    "##..........##",
    "##....PP....##",
    "##..........##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "######..######",
    "####......####",
    "##..........##",
    "##....##....##",
    "##..........##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Luminos: { x: 6, y: 4 },
  },
  patrols: {
    Luminos: [
      { x: 5, y: 4, pauseMs: 900 },
      { x: 6, y: 4 },
      { x: 7, y: 4, pauseMs: 1100 },
      { x: 6, y: 4 },
    ],
  },
  defaultFacing: { Luminos: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const TAVERN_ROOM: RoomDefinition = {
  id: "tavern",
  name: "Bard Tavern",
  nameEs: "La Taberna",
  description:
    "Performance room where stories, scripts, and content ideas get hammered into shape.",
  fallbackGradient: "linear-gradient(135deg, rgba(101,58,31,.97), rgba(35,18,10,.92))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##pppp..dddd##",
    "##pp......dd##",
    "##..........##",
    "##....SS....##",
    "##..........##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "######..######",
    "####......####",
    "##..........##",
    "##....##....##",
    "##..........##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Quillon: { x: 6, y: 4 },
  },
  patrols: {
    Quillon: [
      { x: 5, y: 4, pauseMs: 1100 },
      { x: 6, y: 4 },
      { x: 7, y: 4, pauseMs: 800 },
      { x: 6, y: 4 },
    ],
  },
  defaultFacing: { Quillon: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const SANCTUARY_ROOM: RoomDefinition = {
  id: "sanctuary",
  name: "Vitalis Sanctuary",
  nameEs: "Santuario de Vitalis",
  description:
    "Healing and clinical reflection room with calm light and organized medical reference surfaces.",
  fallbackGradient: "linear-gradient(135deg, rgba(32,95,66,.97), rgba(10,25,20,.92))",
  width: 14,
  height: 8,
  floorPattern: [
    "##############",
    "##hhhh..mmmm##",
    "##hh......mm##",
    "##..........##",
    "##....ff....##",
    "##..........##",
    "##....DD....##",
    "##############",
  ],
  collisionPattern: [
    "##############",
    "######..######",
    "####......####",
    "##..........##",
    "##....##....##",
    "##..........##",
    "##....##....##",
    "##############",
  ],
  spawnPoints: {
    Vitalis: { x: 6, y: 4 },
  },
  patrols: {
    Vitalis: [
      { x: 5, y: 4, pauseMs: 1300 },
      { x: 6, y: 4 },
      { x: 7, y: 4, pauseMs: 800 },
      { x: 6, y: 4 },
    ],
  },
  defaultFacing: { Vitalis: "south" },
  spriteLayout: DEFAULT_LAYOUT,
};

const ROOM_ORDER = [
  THRONE_ROOM,
  FORGE_ROOM,
  LIBRARY_ROOM,
  QA_RANGE,
  TREASURY_ROOM,
  WALLS_ROOM,
  TOWER_ROOM,
  TAVERN_ROOM,
  SANCTUARY_ROOM,
] satisfies RoomDefinition[];
const ROOM_BY_ID = Object.fromEntries(ROOM_ORDER.map((room) => [room.id, room])) as Record<string, RoomDefinition>;

const ROOM_LABELS: Record<string, string> = {
  ".": "Floor",
  "#": "Wall / blocked",
  T: "Throne dais / Table",
  "=": "Carpet runner",
  "+": "Entrance arch",
  "~": "Furnace zone",
  w: "Workbench",
  A: "Anvil platform",
  b: "Barrel / tools / Bookshelf",
  D: "Door",
  s: "Surveillance corner",
  t: "Target",
  x: "Practice dummy",
  c: "Control console",
  g: "Gold pile",
  L: "Ledger shelf",
  N: "Nest perch",
  W: "Wall battlement",
  h: "Horn post / Herb shelf",
  e: "Energy conduit",
  P: "Power core",
  p: "Props / Performance area",
  d: "Drafts / Documents",
  S: "Stage platform",
  f: "Fountain / Medical station",
  m: "Medical tomes",
};

function isBlocked(room: RoomDefinition, x: number, y: number) {
  if (x < 0 || y < 0 || x >= room.width || y >= room.height) return true;
  return room.collisionPattern[y]?.[x] === "#";
}

function keyOf(x: number, y: number) {
  return `${x},${y}`;
}

function getNeighbors(room: RoomDefinition, tile: TileCoord) {
  return [
    { x: tile.x, y: tile.y - 1, direction: "north" as SpriteDirection },
    { x: tile.x + 1, y: tile.y, direction: "east" as SpriteDirection },
    { x: tile.x, y: tile.y + 1, direction: "south" as SpriteDirection },
    { x: tile.x - 1, y: tile.y, direction: "west" as SpriteDirection },
  ].filter((next) => !isBlocked(room, next.x, next.y));
}

function findPath(room: RoomDefinition, start: TileCoord, goal: TileCoord, occupied: Set<string>) {
  if (start.x === goal.x && start.y === goal.y) return [start];

  const queue: TileCoord[] = [start];
  const visited = new Set([keyOf(start.x, start.y)]);
  const parents = new Map<string, TileCoord>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const next of getNeighbors(room, current)) {
      const nextKey = keyOf(next.x, next.y);
      if (visited.has(nextKey)) continue;
      if (occupied.has(nextKey) && !(next.x === goal.x && next.y === goal.y)) continue;

      visited.add(nextKey);
      parents.set(nextKey, current);

      if (next.x === goal.x && next.y === goal.y) {
        const path: TileCoord[] = [{ x: goal.x, y: goal.y }];
        let cursor = current;
        while (!(cursor.x === start.x && cursor.y === start.y)) {
          path.unshift(cursor);
          cursor = parents.get(keyOf(cursor.x, cursor.y))!;
        }
        path.unshift(start);
        return path;
      }

      queue.push({ x: next.x, y: next.y });
    }
  }

  return [start];
}

function directionFromStep(from: TileCoord, to: TileCoord): SpriteDirection {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "east" : "west";
  return dy > 0 ? "south" : "north";
}

function getSpriteSheet(slug: string) {
  return `/map/xus-sprites/${slug}-sheet.png`;
}

function getFrameBackgroundPosition(direction: SpriteDirection, frame: number, layout: RoomSpriteLayout) {
  const row = layout.rowsByDirection[direction] ?? layout.rowsByDirection.south;
  const col = layout.walkColumns[frame % layout.walkColumns.length] ?? layout.idleColumn;
  const x = layout.columns <= 1 ? 0 : (col / (layout.columns - 1)) * 100;
  const y = layout.rows <= 1 ? 0 : (row / (layout.rows - 1)) * 100;
  return `${x}% ${y}%`;
}

function roomForAgent(agent: GuildAgent) {
  return ROOM_BY_ID[agent.roomAssignment] ? agent.roomAssignment : agent.name === "Forgex" ? "forge" : "throne-room";
}

function buildInitialState(agents: GuildAgent[]) {
  const byRoom: Record<string, TileEntityState[]> = {};

  for (const room of ROOM_ORDER) {
    const roomAgents = agents.filter((agent) => roomForAgent(agent) === room.id);
    byRoom[room.id] = roomAgents.map((agent, index) => {
      const fallback = room.patrols[agent.name]?.[0] ?? room.spawnPoints[agent.name] ?? { x: 1 + index, y: room.height - 2 };
      const facing = room.defaultFacing?.[agent.name] ?? "south";
      return {
        agent,
        x: fallback.x,
        y: fallback.y,
        direction: facing,
        frame: 0,
        moving: false,
      };
    });
  }

  return byRoom;
}

function stepRoom(room: RoomDefinition, states: TileEntityState[]) {
  const occupied = new Set(states.map((state) => keyOf(state.x, state.y)));

  return states.map((state) => {
    const patrol = room.patrols[state.agent.name] ?? [room.spawnPoints[state.agent.name] ?? { x: state.x, y: state.y }];
    if (patrol.length === 0) return { ...state, moving: false, frame: 0 };

    const currentIndex = patrol.findIndex((node) => node.x === state.x && node.y === state.y);
    const nextTarget = currentIndex >= 0 ? patrol[(currentIndex + 1) % patrol.length] : patrol[0];

    occupied.delete(keyOf(state.x, state.y));
    const path = findPath(room, { x: state.x, y: state.y }, nextTarget, occupied);
    const nextStep = path[1];
    occupied.add(keyOf(state.x, state.y));

    if (!nextStep) {
      return { ...state, moving: false, frame: 0 };
    }

    const destinationKey = keyOf(nextStep.x, nextStep.y);
    if (occupied.has(destinationKey)) {
      return { ...state, moving: false, frame: 0 };
    }

    occupied.delete(keyOf(state.x, state.y));
    occupied.add(destinationKey);

    return {
      ...state,
      x: nextStep.x,
      y: nextStep.y,
      direction: directionFromStep({ x: state.x, y: state.y }, nextStep),
      frame: (state.frame + 1) % room.spriteLayout.walkColumns.length,
      moving: true,
    };
  });
}

function getTileClass(char: string) {
  switch (char) {
    case "#":
      return "rpg-map-tile is-blocked";
    case "T":
      return "rpg-map-tile is-throne";
    case "=":
      return "rpg-map-tile is-carpet";
    case "+":
    case "D":
      return "rpg-map-tile is-door";
    case "~":
      return "rpg-map-tile is-furnace";
    case "w":
      return "rpg-map-tile is-workbench";
    case "A":
      return "rpg-map-tile is-anvil";
    case "b":
      return "rpg-map-tile is-barrel";
    default:
      return "rpg-map-tile is-floor";
  }
}

function getStatusTone(status: GuildAgent["status"]) {
  if (status === "active") return { dot: "#34d399", label: "ACTIVE" };
  if (status === "blocked") return { dot: "#ef4444", label: "BLOCKED" };
  return { dot: "#94a3b8", label: "IDLE" };
}

function TileMapRoom({
  room,
  entities,
  onAgentClick,
}: {
  room: RoomDefinition;
  entities: TileEntityState[];
  onAgentClick: (agent: GuildAgent) => void;
}) {
  return (
    <section className="rpg-map-room-panel rpg-panel-gold">
      <div className="rpg-map-room-head">
        <div>
          <div className="rpg-map-room-kicker">{room.nameEs}</div>
          <h3 className="rpg-map-room-title">{room.name}</h3>
          <p className="rpg-map-room-copy">{room.description}</p>
        </div>
        <div className="rpg-map-room-badges">
          <span>{room.width}×{room.height} tiles</span>
          <span>{entities.length} agents</span>
        </div>
      </div>

      <div className="rpg-map-stage-wrap">
        <div
          className="rpg-map-stage"
          style={{
            width: room.width * TILE_SIZE,
            height: room.height * TILE_SIZE,
            gridTemplateColumns: `repeat(${room.width}, ${TILE_SIZE}px)`,
            gridTemplateRows: `repeat(${room.height}, ${TILE_SIZE}px)`,
            background: room.image
              ? `url(${room.image}) center/100% 100% no-repeat`
              : room.fallbackGradient,
            imageRendering: "pixelated",
          }}
        >
          {room.floorPattern.flatMap((row, y) =>
            row.split("").map((cell, x) => {
              const blocked = isBlocked(room, x, y);
              return (
                <div
                  key={`${room.id}-${x}-${y}`}
                  className={getTileClass(cell)}
                  title={`${x},${y} · ${ROOM_LABELS[cell] ?? "Floor"}${blocked ? " · collision" : ""}`}
                >
                  <span className="rpg-map-grid-dot" />
                </div>
              );
            }),
          )}

          {entities.map((entity) => {
            const status = getStatusTone(entity.agent.status);
            const sheet = getSpriteSheet(entity.agent.avatar || entity.agent.name.toLowerCase());
            return (
              <div
                key={entity.agent._id}
                className="rpg-map-entity"
                style={{
                  left: entity.x * TILE_SIZE,
                  top: entity.y * TILE_SIZE,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  cursor: "pointer",
                }}
                title={`${entity.agent.name} · ${entity.direction} · tile ${entity.x},${entity.y}`}
                onClick={() => onAgentClick(entity.agent)}
              >
                <div className="rpg-map-entity-shadow" />
                <div
                  className="rpg-map-entity-sprite"
                  style={{
                    backgroundImage: `url(${sheet})`,
                    backgroundSize: `${DEFAULT_LAYOUT.columns * 100}% ${DEFAULT_LAYOUT.rows * 100}%`,
                    backgroundPosition: getFrameBackgroundPosition(entity.direction, entity.moving ? entity.frame : 0, room.spriteLayout),
                  }}
                />
                <div className="rpg-map-entity-status" style={{ background: status.dot }} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="rpg-map-legend">
        <div className="rpg-map-legend-group">
          <span className="rpg-map-legend-title">Collision layer</span>
          <div className="rpg-map-legend-row">
            <span className="legend-chip floor">walkable</span>
            <span className="legend-chip blocked">blocked</span>
            <span className="legend-chip route">patrol route</span>
          </div>
        </div>
        <div className="rpg-map-legend-group">
          <span className="rpg-map-legend-title">Sprite sheet mapping</span>
          <p>
            {room.spriteLayout.notes}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function GuildMap({ agents }: GuildMapProps) {
  const [entitiesByRoom, setEntitiesByRoom] = useState<Record<string, TileEntityState[]>>(() => buildInitialState(agents));
  const [selectedRoom, setSelectedRoom] = useState<string>(ROOM_ORDER[0].id);
  const [inspectedAgent, setInspectedAgent] = useState<GuildAgent | null>(null);

  useEffect(() => {
    setEntitiesByRoom(buildInitialState(agents));
  }, [agents]);

  useEffect(() => {
    const handle = window.setInterval(() => {
      setEntitiesByRoom((current) => {
        const next: Record<string, TileEntityState[]> = {};
        for (const room of ROOM_ORDER) {
          next[room.id] = stepRoom(room, current[room.id] ?? []);
        }
        return next;
      });
    }, 280);

    return () => window.clearInterval(handle);
  }, []);

  const roomSummaries = useMemo(
    () =>
      ROOM_ORDER.map((room) => ({
        room,
        entities: entitiesByRoom[room.id] ?? [],
      })),
    [entitiesByRoom],
  );

  const currentRoomData = roomSummaries.find((r) => r.room.id === selectedRoom) ?? roomSummaries[0];

  return (
    <div className="flex h-full gap-4 p-4 md:p-6">
      {/* Room Selector Sidebar */}
      <aside className="flex flex-col gap-3 w-64 flex-shrink-0">
        <div className="rpg-panel-gold p-4">
          <h3 className="font-pixel text-xs uppercase mb-3" style={{ color: "var(--gh-gold)" }}>
            Guild Rooms
          </h3>
          <div className="flex flex-col gap-2">
            {roomSummaries.map(({ room, entities }) => (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoom(room.id)}
                className={`p-3 text-left rounded border transition-all ${
                  selectedRoom === room.id
                    ? "border-[var(--gh-gold)] bg-[var(--gh-gold)]/10"
                    : "border-slate-600/30 bg-slate-800/20 hover:border-slate-500/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{room.icon ?? "🏛"}</span>
                  <span className="font-pixel text-[10px] uppercase text-white/90">{room.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span>{entities.length} agents</span>
                  {room.image && <span className="text-green-400">✓ art</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Map Area */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
        <section className="guild-map-hero rpg-panel-gold">
          <div>
            <div className="guild-map-kicker">🗺 RPG map system</div>
            <h2 className="guild-map-title">Tile rooms, 1×1 agents, real collisions.</h2>
            <p className="guild-map-subtitle">
              The map now behaves like a small RPG board instead of a dashboard card wall: every agent occupies exactly one tile,
              movement resolves on a collision grid, and map rendering uses the real 4×4 animated sprite sheets.
            </p>
          </div>
          <div className="guild-map-summary-grid">
            <div className="guild-map-summary-card">
              <span className="guild-map-summary-value">{ROOM_ORDER.length}</span>
              <span className="guild-map-summary-label">tile rooms</span>
            </div>
            <div className="guild-map-summary-card">
              <span className="guild-map-summary-value">{agents.length}</span>
              <span className="guild-map-summary-label">1×1 entities</span>
            </div>
            <div className="guild-map-summary-card">
              <span className="guild-map-summary-value">BFS</span>
              <span className="guild-map-summary-label">pathing / collision</span>
            </div>
            <div className="guild-map-summary-card">
              <span className="guild-map-summary-value">4×4</span>
              <span className="guild-map-summary-label">animated sheets</span>
            </div>
          </div>
        </section>

        <TileMapRoom
          room={currentRoomData.room}
          entities={currentRoomData.entities}
          onAgentClick={setInspectedAgent}
        />

        <section className="rpg-panel p-4 rpg-map-notes">
          <div className="rpg-map-legend-title">Current room data scaffolding</div>
          <ul>
            <li>Room definitions include floor pattern, collision pattern, spawn points, patrol nodes, and sprite layout metadata.</li>
            <li>Throne Room and Forge use current art as background layers while the playable logic lives in tile data.</li>
            <li>All 11 agents are now placed across 9 rooms with proper tile-based movement and collision.</li>
          </ul>
        </section>
      </div>

      {/* Agent Inspection Popup */}
      {inspectedAgent && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setInspectedAgent(null)}
        >
          <div
            className="rpg-panel-gold max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{inspectedAgent.rpgEmoji}</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{inspectedAgent.name}</h3>
                <p className="text-sm text-slate-300">{inspectedAgent.role}</p>
                <p className="text-xs text-[var(--gh-gold)] mt-1">{inspectedAgent.rpgClass}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400 text-xs">Status</span>
                  <p className="text-white capitalize">{inspectedAgent.status}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Level</span>
                  <p className="text-white">LV {inspectedAgent.rpgLevel}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Zone</span>
                  <p className="text-white">{inspectedAgent.rpgZone}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Streak</span>
                  <p className="text-white">🔥 {inspectedAgent.rpgStreak}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-600/30">
                <p className="text-sm text-slate-300 leading-relaxed">{inspectedAgent.lore}</p>
              </div>

              <div className="flex gap-2 flex-wrap pt-2">
                {Object.entries(inspectedAgent.rpgStats).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
                  >
                    {key.slice(0, 3).toUpperCase()} {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
