export type RoomStatus = "ready" | "needs-art";
export type RoomState = "idle" | "active" | "blocked";

export interface PathNode {
  x: number;
  y: number;
  pauseMs?: number;
}

export interface SpriteSpawn {
  agentId: string;
  x: number;
  y: number;
  facing?: "north" | "south" | "east" | "west";
  state?: RoomState;
}

export interface RoomDefinition {
  id: string;
  slug: string;
  name: string;
  nameEs: string;
  icon: string;
  description: string;
  gridArea: string;
  mood: string;
  palette: string[];
  image?: string;
  status: RoomStatus;
  artBrief: string;
  walkPath: PathNode[];
  agentSpawns: SpriteSpawn[];
  fallbackGradient: string;
  tags: string[];
}

export const ROOM_DEFINITIONS: RoomDefinition[] = [
  {
    id: "throne-room",
    slug: "throne-room",
    name: "Throne Room",
    nameEs: "Sala del Trono",
    icon: "👑",
    description: "Guild command chamber. Flix conducts the whole operation from the red carpet line of sight.",
    gridArea: "throne",
    mood: "Regal, strategic, lit by stained glass and oath banners.",
    palette: ["#6a1f3c", "#d9b96f", "#2e3f6a"],
    image: "/map/rooms/sala-del-trono.png",
    status: "ready",
    artBrief: "Already usable, but future version should expand depth, balcony space, and side exits while preserving the throne composition.",
    walkPath: [
      { x: 18, y: 74 },
      { x: 35, y: 68, pauseMs: 1100 },
      { x: 50, y: 60 },
      { x: 65, y: 68, pauseMs: 700 },
      { x: 81, y: 74 },
    ],
    agentSpawns: [{ agentId: "Flix", x: 50, y: 69, facing: "south", state: "active" }],
    fallbackGradient: "linear-gradient(135deg, rgba(88,22,54,.95), rgba(27,30,63,.95))",
    tags: ["command", "royal", "core-room"],
  },
  {
    id: "forge",
    slug: "forge",
    name: "The Forge",
    nameEs: "La Forja",
    icon: "🔥",
    description: "Code and steel workshop with clear working lanes, heat bloom, and smithing stations.",
    gridArea: "forge",
    mood: "Industrial warmth, sparks, tools, and heavy productivity.",
    palette: ["#ff9a3c", "#7d3a1b", "#3b2c26"],
    image: "/map/rooms/forge-room.png",
    status: "ready",
    artBrief: "Current forge works. Future tileset should split furnace, anvil, drafting table, barrel, and doorway into reusable layers.",
    walkPath: [
      { x: 20, y: 78 },
      { x: 38, y: 73 },
      { x: 51, y: 67, pauseMs: 800 },
      { x: 63, y: 73 },
      { x: 80, y: 78, pauseMs: 1200 },
    ],
    agentSpawns: [{ agentId: "Forgex", x: 50, y: 72, facing: "south", state: "active" }],
    fallbackGradient: "linear-gradient(135deg, rgba(95,34,16,.96), rgba(28,13,8,.95))",
    tags: ["builder", "crafting", "core-room"],
  },
  {
    id: "library",
    slug: "library",
    name: "Arcane Library",
    nameEs: "Biblioteca Arcana",
    icon: "📚",
    description: "Research stacks, glowing indexes, and quiet surveillance corners for deeper intel work.",
    gridArea: "library",
    mood: "Scholar sanctuary with magical filing systems and hidden alcoves.",
    palette: ["#184536", "#7ec7b5", "#d9c794"],
    status: "needs-art",
    artBrief: "Need a top-down/isometric library room with book walls, central reading table, side archive shelves, rune-lit index pedestal, and one shadowy intel alcove.",
    walkPath: [
      { x: 14, y: 76 },
      { x: 28, y: 70, pauseMs: 600 },
      { x: 48, y: 64, pauseMs: 1200 },
      { x: 67, y: 70 },
      { x: 84, y: 77, pauseMs: 900 },
    ],
    agentSpawns: [
      { agentId: "Arcanix", x: 36, y: 68, facing: "south", state: "active" },
      { agentId: "Spectra", x: 69, y: 73, facing: "west", state: "active" },
    ],
    fallbackGradient: "linear-gradient(135deg, rgba(16,58,45,.96), rgba(8,18,22,.92))",
    tags: ["research", "intel", "needs-art"],
  },
  {
    id: "range",
    slug: "range",
    name: "Shooting Range",
    nameEs: "Campo de Tiro",
    icon: "🎯",
    description: "Precision testing grounds for bug hunts, QA practice, and challenge runs.",
    gridArea: "range",
    mood: "Forest-edge training hall with moving targets and diagnostic boards.",
    palette: ["#445d1e", "#9dc86f", "#5e3d21"],
    status: "needs-art",
    artBrief: "Need a QA training room with wooden lanes, hanging targets, broken dummy parts, test monitors, and a subtle ranger/fox vibe. Keep clear central walking strip.",
    walkPath: [
      { x: 16, y: 80 },
      { x: 34, y: 74 },
      { x: 52, y: 69, pauseMs: 1000 },
      { x: 70, y: 74 },
      { x: 86, y: 80, pauseMs: 700 },
    ],
    agentSpawns: [{ agentId: "Bugbane", x: 53, y: 75, facing: "south", state: "idle" }],
    fallbackGradient: "linear-gradient(135deg, rgba(61,82,26,.96), rgba(24,17,8,.92))",
    tags: ["testing", "qa", "needs-art"],
  },
  {
    id: "treasury",
    slug: "treasury",
    name: "Dragon Treasury",
    nameEs: "Cueva del Dragón",
    icon: "💰",
    description: "Vault room for coins, invoices, ledgers, and draconic financial oversight.",
    gridArea: "treasury",
    mood: "Warm cavern vault with gold reflections and neat accounting stations.",
    palette: ["#7a4d13", "#f1c45b", "#40240d"],
    status: "needs-art",
    artBrief: "Need a dragon treasury room: coin piles, shelves of ledgers, invoice chest, abacus desk, glowing vault door, and a nest perch for Goldrak.",
    walkPath: [
      { x: 18, y: 79 },
      { x: 37, y: 72 },
      { x: 55, y: 66, pauseMs: 900 },
      { x: 71, y: 71 },
      { x: 84, y: 77, pauseMs: 1300 },
    ],
    agentSpawns: [{ agentId: "Goldrak", x: 57, y: 73, facing: "south", state: "idle" }],
    fallbackGradient: "linear-gradient(135deg, rgba(104,62,12,.97), rgba(30,14,5,.92))",
    tags: ["finance", "treasury", "needs-art"],
  },
  {
    id: "tavern",
    slug: "tavern",
    name: "The Tavern",
    nameEs: "La Taberna",
    icon: "🍺",
    description: "Performance room where stories, scripts, and content ideas get hammered into shape.",
    gridArea: "tavern",
    mood: "Cozy storytelling inn with a miniature stage and cluttered creative props.",
    palette: ["#7f5330", "#d7a15d", "#432619"],
    status: "needs-art",
    artBrief: "Need a bard tavern room with stage platform, writing desk, mugs, pinned drafts, lute/mic stand, and bright storytelling lighting.",
    walkPath: [
      { x: 15, y: 78 },
      { x: 31, y: 73 },
      { x: 48, y: 70, pauseMs: 1100 },
      { x: 67, y: 73 },
      { x: 85, y: 79, pauseMs: 800 },
    ],
    agentSpawns: [{ agentId: "Quillon", x: 50, y: 74, facing: "south", state: "active" }],
    fallbackGradient: "linear-gradient(135deg, rgba(101,58,31,.97), rgba(35,18,10,.92))",
    tags: ["content", "bard", "needs-art"],
  },
  {
    id: "walls",
    slug: "walls",
    name: "The Walls",
    nameEs: "Las Murallas",
    icon: "🏰",
    description: "Perimeter overlook where security and scouting agents patrol the frontier.",
    gridArea: "walls",
    mood: "Windy battlements with signal braziers, watch posts, and horizon sightlines.",
    palette: ["#4a5268", "#a5b2d1", "#2b3347"],
    status: "needs-art",
    artBrief: "Need a battlement room with crenellations, horn post, security monitors/sigil ward, weathered stone path, and clear two-agent patrol route.",
    walkPath: [
      { x: 14, y: 76 },
      { x: 32, y: 69 },
      { x: 52, y: 64, pauseMs: 700 },
      { x: 70, y: 69 },
      { x: 88, y: 76, pauseMs: 900 },
    ],
    agentSpawns: [
      { agentId: "Herald", x: 34, y: 72, facing: "east", state: "active" },
      { agentId: "Sentinel", x: 68, y: 74, facing: "west", state: "active" },
    ],
    fallbackGradient: "linear-gradient(135deg, rgba(61,67,89,.96), rgba(16,20,30,.92))",
    tags: ["security", "scouting", "needs-art"],
  },
  {
    id: "tower",
    slug: "tower",
    name: "Lightning Tower",
    nameEs: "Torre del Rayo",
    icon: "⚡",
    description: "Home systems control room filled with electric conduits and ambient automation magic.",
    gridArea: "tower",
    mood: "Charged, blue-lit, practical, slightly arcane smart-home operations hub.",
    palette: ["#254d7d", "#7dd3fc", "#1a2540"],
    status: "needs-art",
    artBrief: "Need a control tower room with Tesla coils, wall panels, energy conduits, cozy automation console, and one bright central circuit core.",
    walkPath: [
      { x: 18, y: 80 },
      { x: 34, y: 74 },
      { x: 50, y: 67, pauseMs: 900 },
      { x: 68, y: 73 },
      { x: 83, y: 79, pauseMs: 1100 },
    ],
    agentSpawns: [{ agentId: "Luminos", x: 53, y: 74, facing: "south", state: "idle" }],
    fallbackGradient: "linear-gradient(135deg, rgba(28,67,110,.97), rgba(11,16,33,.93))",
    tags: ["automation", "energy", "needs-art"],
  },
  {
    id: "sanctuary",
    slug: "sanctuary",
    name: "Vitalis Sanctuary",
    nameEs: "Santuario de Vitalis",
    icon: "💚",
    description: "Healing and clinical reflection room with calm light and organized medical reference surfaces.",
    gridArea: "sanctuary",
    mood: "Serene, botanical, clinical but warm.",
    palette: ["#2d6e55", "#a9e6c3", "#204031"],
    status: "needs-art",
    artBrief: "Need a healing sanctuary with herb shelves, clean desk, anatomy scrolls, medical tomes, shallow fountain or lantern glow, and soft green ambience.",
    walkPath: [
      { x: 17, y: 80 },
      { x: 35, y: 73 },
      { x: 50, y: 67, pauseMs: 1300 },
      { x: 67, y: 73 },
      { x: 83, y: 80, pauseMs: 800 },
    ],
    agentSpawns: [{ agentId: "Vitalis", x: 50, y: 75, facing: "south", state: "idle" }],
    fallbackGradient: "linear-gradient(135deg, rgba(32,95,66,.97), rgba(10,25,20,.92))",
    tags: ["medical", "healing", "needs-art"],
  },
];

export const ROOM_BY_ID = Object.fromEntries(ROOM_DEFINITIONS.map((room) => [room.id, room]));
