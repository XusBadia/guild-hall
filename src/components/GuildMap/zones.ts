// Guild Map zone definitions
// Each zone has a position on the map grid, an assigned agent set, and a background

export interface Zone {
  id: string;
  name: string;
  nameEs: string;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  color: string; // fallback bg color
  icon: string;
  description: string;
}

export const ZONES: Zone[] = [
  {
    id: "throne-room",
    name: "Throne Room",
    nameEs: "Sala del Trono",
    gridX: 1, gridY: 0, width: 2, height: 1,
    color: "#2d1b69",
    icon: "👑",
    description: "The heart of the guild. Flix orchestrates all operations from here.",
  },
  {
    id: "library",
    name: "Arcane Library",
    nameEs: "Biblioteca Arcana",
    gridX: 0, gridY: 0, width: 1, height: 1,
    color: "#1a3a2a",
    icon: "📚",
    description: "Ancient tomes and research papers. Arcanix and Spectra study here.",
  },
  {
    id: "forge",
    name: "The Forge",
    nameEs: "La Forja",
    gridX: 3, gridY: 0, width: 1, height: 1,
    color: "#4a1a0a",
    icon: "🔥",
    description: "Where code is hammered into shape. Forgex builds here day and night.",
  },
  {
    id: "shooting-range",
    name: "Shooting Range",
    nameEs: "Campo de Tiro",
    gridX: 0, gridY: 1, width: 1, height: 1,
    color: "#2a3a1a",
    icon: "🎯",
    description: "Testing grounds. Bugbane hunts bugs here with precision.",
  },
  {
    id: "dragon-cave",
    name: "Dragon's Cave",
    nameEs: "Cueva del Dragón",
    gridX: 3, gridY: 1, width: 1, height: 1,
    color: "#3a2a0a",
    icon: "💰",
    description: "The treasury. Goldrak guards every coin and invoice.",
  },
  {
    id: "tavern",
    name: "The Tavern",
    nameEs: "La Taberna",
    gridX: 1, gridY: 1, width: 1, height: 1,
    color: "#3a2a1a",
    icon: "🍺",
    description: "Where stories are told and content is created. Quillon performs nightly.",
  },
  {
    id: "walls",
    name: "The Walls",
    nameEs: "Las Murallas",
    gridX: 2, gridY: 1, width: 1, height: 1,
    color: "#2a2a3a",
    icon: "🏰",
    description: "The guild's perimeter. Herald scouts and Sentinel guards.",
  },
  {
    id: "lightning-tower",
    name: "Lightning Tower",
    nameEs: "Torre del Rayo",
    gridX: 0, gridY: 2, width: 1, height: 1,
    color: "#1a2a4a",
    icon: "⚡",
    description: "Crackling with energy. Luminos controls all home systems from here.",
  },
  {
    id: "sanctuary",
    name: "Vitalis Sanctuary",
    nameEs: "Santuario de Vitalis",
    gridX: 3, gridY: 2, width: 1, height: 1,
    color: "#0a3a2a",
    icon: "💚",
    description: "A peaceful healing grove. Vitalis tends to clinical research here.",
  },
  {
    id: "dormitories",
    name: "Dormitories",
    nameEs: "Dormitorios",
    gridX: 1, gridY: 2, width: 2, height: 1,
    color: "#1a1a2a",
    icon: "🛏️",
    description: "Where idle agents rest between tasks.",
  },
];

// Map agents to their default zones
export const AGENT_ZONES: Record<string, string> = {
  "Flix": "throne-room",
  "Arcanix": "library",
  "Bugbane": "shooting-range",
  "Forgex": "forge",
  "Goldrak": "dragon-cave",
  "Herald": "walls",
  "Luminos": "lightning-tower",
  "Quillon": "tavern",
  "Sentinel": "walls",
  "Spectra": "library",
  "Vitalis": "sanctuary",
};
