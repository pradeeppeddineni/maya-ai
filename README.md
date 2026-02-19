# 🪷 Maya AI — Your AI Employee, Ready in Minutes

> A CLI toolkit that transforms AI agents into a coordinated team of specialists, each named after figures from Indian mythology.

[![Skills](https://img.shields.io/badge/skills-100-blue)](./skills/)
[![Agents](https://img.shields.io/badge/agents-7-green)](./agents/)
[![License](https://img.shields.io/badge/license-MIT-yellow)](./LICENSE)

## What is Maya?

Maya AI gives you a team of AI agents that work together like a real team — not isolated chatbots, but a coordinated squad with a shared task board, staggered heartbeats, and inter-agent communication.

Inspired by [@pbteja1998's Mission Control](https://twitter.com/pbteja1998/status/2017662163540971756) architecture, Maya makes it trivially easy to set up what previously took weeks.

**10 minutes from install → fully operational AI team.**

## Quick Start

```bash
npx maya-ai init
```

Or install globally:

```bash
npm install -g maya-ai
maya init
```

The interactive wizard asks about your AI's personality, your preferences, and which integrations to connect. It generates all 7 workspace files automatically.

## Features

### 🪷 59 Skills (Indian Mythology Named)

Every skill is a reusable capability with expert-level procedural knowledge, compatible with the [skills.sh](https://skills.sh) ecosystem.

| Category | Skills |
|----------|--------|
| **Research** | Narada (🔱 deep research), Garuda (📰 news monitor), Chanakya (🏰 competitive intel), Shalya (📄 paper reader) |
| **Content** | Saraswati (✍️ blog writing), Vachaspati (💬 copywriting), Nirukta (🔄 humanizer), Pratibha (📱 social posts), Kavya (🎬 video scripts) |
| **Development** | Vidura (🧑‍⚖️ code review), Daksha (🧪 TDD), Panini (📝 docs), Dharma (🌿 git workflow), Vakra (🔄 refactoring) |
| **Security** | Sudarshana (🛡️ security audit), Kavach (🔐 secret scanning), Raksha (🔑 password gen) |
| **DevOps** | Vishwakarma (🏗️ infrastructure), Agni (🔥 CI/CD), Surya (☀️ monitoring), Matsya (🐟 log analysis) |
| **Data** | Aryabhata (📊 CSV analysis), Shakuni (🎲 SQL), Varuna (🌊 JSON transforms) |
| **Creative** | Kalpana (🎨 image gen), Rasa (🎭 storytelling), Chandra (🌙 color palettes), Nirmana (🏗️ name gen) |
| **Business** | Kubera (💰 finance), Karna (⚔️ pitch decks), Chitragupta (📋 task tracking) |
| **Communication** | Sandesh (📧 email), Tumburu (🎵 X/Twitter), Samvada (💬 replies), Agastya (🌍 translation) |
| **Learning** | Guru (📚 learning paths), Prajna (🧠 ELI5), Ashwin (🃏 flashcards), Drona (👨‍🏫 tutorials) |
| **System** | Yantra (⚙️ cron), Manu (💾 backups), Marut (📁 file org), Tantra (🕸️ dependencies) |

### 🤖 7 Agent Personas

Agents combine skills into specialized team members:

| Agent | Role | Skills |
|-------|------|--------|
| ✍️ Saraswati Lead | Content Creation | saraswati, pratibha, vachaspati, nirukta, kavya, tumburu |
| 🛡️ Sudarshana Lead | Security Audit | sudarshana, kavach, vidura |
| 🔱 Narada Lead | Research & Analysis | narada, garuda, chanakya, shalya |
| 🏗️ Vishwakarma Lead | DevOps & Infrastructure | vishwakarma, surya, matsya, dharma, astra |
| 📊 Chitragupta Lead | Project Management | chitragupta, soma, brihaspati |
| 💰 Kubera Lead | Financial Analysis | kubera, aryabhata |
| 🧑‍⚖️ Vidura Lead | Code Quality | vidura, daksha, panini, dharma |

### 🎯 Mission Control (Multi-Agent Squads)

Agents don't work in isolation — they coordinate through Mission Control:

- **Task Board**: JSON-based lifecycle (Inbox → Assigned → In Progress → Review → Done → Blocked)
- **WORKING.md**: Each agent reads their current state on every wake
- **@Mentions**: Tag agents to notify them on next heartbeat
- **Staggered Heartbeats**: Agents wake offset by 2 minutes to avoid collision
- **Agent Levels**: Intern (needs approval) → Specialist (independent) → Lead (full autonomy)
- **Daily Standups**: Auto-generated summaries of all agent activity

#### Squad Templates

```
content-team   — Saraswati → Tumburu → Kalpana → Garuda (pipeline)
security-team  — Sudarshana + Vidura + Kavach (parallel)
research-team  — Narada + Garuda + Aryabhata (dynamic)
ship-it        — Vishwakarma → Vidura → Sudarshana → Chitragupta (pipeline)
```

## CLI Commands

```bash
maya init                          # Interactive setup wizard
maya init --minimal                # Quick setup with defaults
maya status                        # Show system status

# Skills
maya skills list                   # List all skills
maya skills install <name>         # Install skill to workspace
maya skills create <name>          # Generate new skill scaffold

# Agents
maya agents list                   # List agent personas
maya agents spawn <agent> <task>   # Spawn agent with a task

# Mission Control
maya squad init                    # Initialize Mission Control
maya squad register <agent>        # Register agent in squad
maya squad status                  # Show squad status
maya squad task "Title" --assignee agent --priority high
maya squad standup                 # Generate daily standup
maya squad working <agent>         # Show agent's WORKING.md

# Integrations
maya connect telegram              # Set up Telegram
maya connect x                     # Set up X/Twitter
maya connect github                # Set up GitHub
```

## Architecture

```
maya-ai/
├── cli/                    # CLI commands
│   ├── index.js           # Main entry point
│   ├── skills.js          # Skill management
│   ├── agents.js          # Agent management
│   ├── squads.js          # Mission Control CLI
│   └── connect.js         # Integration setup
├── lib/                    # Core framework
│   ├── skill-loader.js    # SKILL.md parser
│   ├── skill-installer.js # Install skills to workspace
│   ├── skill-template.js  # Scaffold new skills
│   ├── agent-framework.js # Agent definition loader
│   ├── squad-framework.js # Squad coordination
│   └── mission-control.js # Task board, mentions, standups
├── skills/                 # 59 built-in skills
│   ├── narada/SKILL.md    # Each skill is a directory
│   └── ...                # with SKILL.md + optional scripts/
├── agents/                 # 7 agent personas
│   ├── saraswati-lead/    # Each agent is a directory
│   └── ...                # with AGENT.md
├── wizard/                 # Setup wizard
│   └── init.js            # Interactive + minimal setup
├── templates/              # Workspace file templates
├── tests/                  # Test suite (17 tests)
└── package.json
```

## Skills.sh Compatible

All skills follow the [skills.sh](https://skills.sh) ecosystem format:
- SKILL.md with YAML frontmatter (name, description)
- Procedural knowledge in markdown body
- Optional scripts/ and references/ directories
- Ready to publish: `npx skillsadd pradeeppeddineni/maya-ai`

## Requirements

- Node.js ≥ 18
- OpenClaw (for agent orchestration)
- Optional: ffmpeg, whisper, yt-dlp (for media skills)

## Philosophy

Every skill and agent is named after a figure from Indian mythology:
- **Maya** (माया) — cosmic creative power, illusion that shapes reality
- Names carry meaning — each skill's mythology connection reflects its purpose
- The pantheon grows as capabilities grow

## Contributing

1. Fork the repo
2. Create a skill: `maya skills create my-skill`
3. Write rich procedural knowledge in SKILL.md
4. Add scripts/ if the skill needs automation
5. Test it on real tasks
6. Submit a PR

## License

MIT
