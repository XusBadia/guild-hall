<div align="center">

# 🏰 Copen's Guild Hall

**RPG-gamified AI agent dashboard for OpenClaw**

*Pokédex meets Mission Control — monitor your AI agent guild in real-time with pixel art, XP systems, and evolution paths.*

[![Built with Convex](https://img.shields.io/badge/Built%20with-Convex-FF6B35?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTdMMTIgMjJMMjAgMTdWN0wxMiAyWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)](https://convex.dev)
[![Powered by OpenClaw](https://img.shields.io/badge/Powered%20by-OpenClaw-E34F26?style=flat-square)](https://github.com/openclaw/openclaw)
[![Next.js](https://img.shields.io/badge/Next.js-15-000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Documentation](#features) · [Getting Started](#getting-started) · [Contributing](#contributing)

</div>

---

## What is Guild Hall?

Guild Hall is a **real-time dashboard** that turns your fleet of OpenClaw AI agents into an RPG guild. Each agent has a pixel art avatar, stats, XP progression, and evolution paths — while you get full visibility into what they're doing, when, and how well.

Think of it as **GitHub's contribution graph meets a Pokédex** — but for AI agents.

<div align="center">

```
┌─────────────────────────────────────────────────────┐
│  🏰 COPEN'S GUILD HALL           ⚔️ 11 Agents Active │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🧙 Arcanix    🏹 Bugbane    ⚒️ Forgex    🐉 Goldrak │
│  Lv.12 ████░   Lv.8 ██░░░   Lv.15 █████  Lv.22 ██│
│  Research Mage  QA Ranger    Artificer    Fin Dragon│
│                                                     │
│  📯 Herald     ⚡ Luminos    🎭 Quillon   🛡️ Sentinel│
│  Lv.6 █░░░░   Lv.10 ███░░  Lv.9 ██░░░   Lv.18 ███│
│  News Scout    Home Artif.   Bard         Watchdog  │
│                                                     │
│  👻 Spectra    💚 Vitalis    🙈 Flix                 │
│  Lv.14 ████░  Lv.11 ███░░  Lv.30 ██████            │
│  Intel Phantom Clin. Cleric  Orchestrator           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

</div>

## Why?

Running multiple OpenClaw agents is powerful — but visibility is limited to CLI output and Discord messages. You can't see:

- Which agents are active right now
- How many tasks each agent completed this week
- Whether a cron job failed at 3 AM
- How your system resources are doing
- What's in each agent's memory

Guild Hall solves this with a **single dashboard** that aggregates everything in real-time.

## Features

### 🎮 RPG Gamification Layer

- **XP & Leveling** — Every completed task earns XP. Agents level up over time.
- **6 Stats** — INT (Intelligence), SPD (Speed), REL (Reliability), CRE (Creativity), STL (Stealth), END (Endurance) — displayed as radar charts.
- **Evolution Paths** — Each agent has unique evolution stages with new pixel art avatars unlocked at level thresholds (Pokémon-style).
- **Leaderboard** — Ranked by level and XP with gold/silver/bronze badges.

### 🖥️ Real-Time Agent Monitoring

- **Live Status Grid** — See all agents at a glance (🟢 active / 🟡 idle / 🔴 error).
- **Task Kanban** — Inbox → Assigned → In Progress → Review → Done.
- **Activity Feed** — Chronological log of every agent action across the guild.
- **Activity Heatmap** — GitHub-style contribution graph per agent (last 90 days).

### 📊 Dynamic Multi-Source Dashboard

Parallel data fetching from multiple sources, aggregated into one view:

| Source | Metrics |
|--------|---------|
| **System Health** | CPU, RAM, disk usage, uptime |
| **GitHub** | Recent commits, open PRs, repo activity |
| **Trialinx** | User signups, active studies, conversion rates |
| **Marketing** | Followers per platform, engagement rates |
| **Cron Jobs** | Status per agent, last run, next scheduled |

All sources fetch independently via `Promise.allSettled` — if one fails, the rest still update. Auto-refresh every 60 seconds.

### 🔍 Global Memory Search (Second Brain)

- **`Cmd+K` / `Ctrl+K`** from any page opens a global search modal.
- Searches across ALL agent memory files (`memory/*.md`, `MEMORY.md`, `SOUL.md`).
- Full-text search powered by SQLite FTS5.
- Filter by agent, date range, or file type.
- Click a result → reading pane with highlighted context.

### 🎨 Pixel Art & Design

- Custom 64×64 pixel art avatars for each agent (base + evolution stages).
- Dark theme with per-agent accent colors.
- Framer Motion animations (XP bar fills, level-up sparkles, card hover effects).
- Responsive: desktop sidebar, mobile bottom tabs.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Animations** | Framer Motion |
| **Backend** | [Convex](https://convex.dev) — real-time database, serverless functions, auth, file storage |
| **Charts** | Recharts (radar, line, bar) + custom SVG (heatmap) |
| **Search** | cmdk + SQLite FTS5 |
| **Deploy** | Vercel |
| **Integration** | OpenClaw gateway hooks → Convex HTTP actions |

## Architecture

```
┌──────────────────┐     webhook events      ┌─────────────────┐
│   OpenClaw       │ ──────────────────────→  │    Convex       │
│   Gateway        │  task start/end/error    │    Backend      │
│   (11 agents)    │  progress updates        │    (real-time)  │
└──────────────────┘                          └────────┬────────┘
                                                       │
                                              real-time subscriptions
                                                       │
                                              ┌────────▼────────┐
                                              │   Next.js       │
                                              │   Frontend      │
                                              │   (Vercel)      │
                                              └─────────────────┘
```

**How it works:**

1. OpenClaw agents run tasks (via cron, Discord commands, or sub-agent spawns).
2. Gateway lifecycle hooks send events (`start`, `progress`, `end`, `error`) as HTTP POST to Convex.
3. Convex mutations update the real-time database.
4. Frontend subscribes to Convex queries — UI updates instantly, no polling.
5. RPG logic runs in Convex functions: XP calculation, level-ups, evolution triggers.

## The Guild

| Agent | Class | Role |
|-------|-------|------|
| 🙈 **Flix** | Orchestrator | Guild leader. Routes tasks to specialists. |
| 🧙 **Arcanix** | Research Mage | Deep research, paper analysis, knowledge synthesis |
| 🏹 **Bugbane** | QA Ranger | Testing, bug hunting, quality assurance |
| ⚒️ **Forgex** | Artificer | Code generation, refactoring, dev ops |
| 🐉 **Goldrak** | Financial Dragon | Personal finance, tax optimization, invoicing |
| 📯 **Herald** | News Scout | Daily briefings, news aggregation, trend tracking |
| ⚡ **Luminos** | Home Artificer | Home Assistant automations, IoT, smart home |
| 🎭 **Quillon** | Bard | Creative writing, social media content, copywriting |
| 🛡️ **Sentinel** | Watchdog | Security monitoring, health checks, infrastructure |
| 👻 **Spectra** | Intel Phantom | Competitive intelligence, market research, OSINT |
| 💚 **Vitalis** | Clinical Cleric | Medical research, clinical data, PubMed analysis |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Convex](https://convex.dev) account (free tier works)
- An OpenClaw instance with agents configured

### Installation

```bash
# Clone the repo
git clone https://github.com/XusBadia/guild-hall.git
cd guild-hall

# Install dependencies
bun install  # or npm install

# Set up Convex
npx convex dev

# Start the dev server
bun dev
```

### Environment Variables

```env
# Convex
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# OpenClaw (for memory search)
OPENCLAW_WORKSPACE_PATH=/path/to/.openclaw/workspace
```

### Connect OpenClaw

Copy the webhook handler to your OpenClaw hooks directory:

```bash
cp hooks/guild-hall ~/.openclaw/hooks/guild-hall
```

Add to your OpenClaw config:

```json
{
  "hooks": {
    "webhooks": [{
      "url": "https://your-project.convex.site/openclaw/event",
      "events": ["task:start", "task:end", "task:error", "task:progress"]
    }]
  }
}
```

Restart the gateway:

```bash
openclaw gateway restart
```

## Roadmap

- [x] PRD & architecture design
- [x] Agent roster with pixel art avatars
- [x] RPG stat system (6 axes)
- [x] Evolution paths per agent
- [ ] Fork & adapt Mission Control base
- [ ] Convex backend schema
- [ ] Real-time agent grid
- [ ] XP/leveling system
- [ ] Task kanban board
- [ ] Activity feed
- [ ] Agent detail pages with radar charts
- [ ] Leaderboard
- [ ] Dynamic multi-source dashboard
- [ ] Global memory search (Cmd+K)
- [ ] Activity heatmaps
- [ ] Mobile responsive
- [ ] Deploy to Vercel

## Based On

Forked from [openclaw-mission-control](https://github.com/manish-raana/openclaw-mission-control) by [@manish-raana](https://github.com/manish-raana) — a real-time agent monitoring dashboard built with Convex and React.

Guild Hall extends it with RPG gamification, multi-source dashboards, and global memory search.

## Contributing

Contributions welcome! Whether it's new pixel art, RPG mechanics, dashboard widgets, or bug fixes.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by a surgeon who codes**

*Part of the OpenClaw ecosystem*

[⬆ Back to top](#-copens-guild-hall)

</div>
