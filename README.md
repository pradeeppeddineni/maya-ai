# Maya AI 🪷

**Your AI employee, ready in minutes.**

Maya is a CLI toolkit that sits on top of [OpenClaw](https://github.com/openclaw/openclaw) and turns it from a blank agent into a fully configured AI employee with personality, memory, skills, and integrations.

One command. Your own Maya.

## What You Get

- 🪷 **Personality Engine** - Interactive setup that builds your AI's soul, identity, and voice
- 🧠 **Memory System** - Long-term memory, daily logs, and a correction loop that makes your AI smarter every day
- 🎨 **Kalpana** - Image generation (Flux 2 Pro via Azure, or bring your own)
- 🔱 **Narada** - Deep research agent that crawls the web and synthesizes reports
- 🎬 **Video Transcription** - Pull and transcribe videos from 1000+ sites
- 🐦 **X/Twitter Integration** - Read and post via API or browser
- 🔗 **GitHub Integration** - Full repo access, code management
- 📱 **Multi-channel** - Telegram, Discord, Slack, iMessage, and more via OpenClaw

## Quick Start

```bash
# Install OpenClaw first
npm i -g openclaw

# Install Maya
npm i -g maya-ai

# Run the setup wizard
maya init
```

The wizard interviews you and generates:
- `SOUL.md` - How your AI thinks and talks
- `IDENTITY.md` - Name, role, avatar
- `USER.md` - Who you are, your preferences
- `TOOLS.md` - Available tools and integrations
- `MEMORY.md` - Long-term context
- `AGENTS.md` - Operational rules and correction loop

## Skills

Maya comes with built-in skills and you can add more:

```bash
# List available skills
maya skills list

# Install a skill
maya skills install kalpana

# Create your own
maya skills create my-skill
```

### Built-in Skills

| Skill | Description |
|-------|-------------|
| **Kalpana** 🎨 | Image generation via Flux 2 Pro |
| **Narada** 🔱 | Deep web research agent |
| **Transcribe** 🎬 | Video transcription pipeline |

## Agents

Maya supports multiple specialized agents:

```bash
# List agents
maya agents list

# Spawn a research task
maya agents spawn narada "Research the best GPU for local AI inference"

# Check status
maya agents status
```

## Integrations

```bash
# Set up integrations interactively
maya connect telegram
maya connect x
maya connect github
maya connect image-gen
```

## Philosophy

Maya isn't another chatbot wrapper. She's an opinionated framework for building AI employees that:

1. **Have a soul** - Personality isn't fluff. It's the difference between a tool and a partner.
2. **Remember everything** - Structured memory that compounds over time.
3. **Learn from mistakes** - Every correction becomes a permanent rule.
4. **Actually do things** - Shell access, APIs, browser, code. Not just talk.
5. **Run locally** - Your data stays yours. Privacy isn't optional.

Inspired by the Donna Paulsen philosophy: your AI should know what you need before you ask.

## Architecture

```
maya-ai/
  ├── cli/              # CLI commands (init, skills, agents, connect)
  ├── templates/        # Default SOUL.md, USER.md, etc.
  ├── skills/           # Built-in skills
  │   ├── kalpana/      # Image generation
  │   ├── narada/       # Deep research
  │   └── transcribe/   # Video transcription
  ├── agents/           # Agent definitions and spawn logic
  ├── integrations/     # Platform connectors (X, GitHub, etc.)
  └── wizard/           # Interactive setup wizard
```

## Requirements

- [OpenClaw](https://github.com/openclaw/openclaw) installed and configured
- Node.js 18+
- An LLM API key (Anthropic, OpenAI, etc.)

## Status

🚧 **Under active development.** Built by Maya herself, on a Raspberry Pi 5, one commit at a time.

## License

MIT

---

*Named after Maya (माया), the Sanskrit concept of cosmic illusion, the force that weaves the fabric of reality itself.* 🪷
