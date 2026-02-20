# Maya AI Architecture Notes

## Prompt Caching Strategy

Based on learnings from Claude Code's production architecture.

### Core Principle
Prompt caching is a PREFIX match. Any change anywhere in the prefix invalidates everything after it. Design the entire system around this constraint.

### Rules

1. **Never change system prompt mid-conversation.** Use system messages inserted during conversation instead. State transitions (plan mode, focus mode, etc.) should be tool calls, not prompt edits.

2. **Skill Loading: Defer, Don't Dump.** With 100+ skills, loading all schemas into every request is expensive. Instead:
   - Send lightweight stubs (skill name + one-line description) in every request
   - Agent discovers relevant skills via a SkillSearch tool when needed
   - Full skill SKILL.md loaded only when selected
   - Stubs stay in the same order always (cache-stable)

3. **Don't change tools or models mid-conversation.** Adding/removing tools breaks the cache prefix. If a skill needs extra tools, use deferred loading.

4. **Compaction must share the parent's prefix.** When context overflows and we summarize:
   - Use identical system prompt, tools, and context as the parent conversation
   - Prepend parent's messages, append compaction prompt as new user message
   - This reuses the cached prefix, only new tokens are the compaction instruction
   - Save a "compaction buffer" for summary output tokens

5. **Monitor cache hit rate.** Treat cache misses like downtime. A few percentage points of miss rate dramatically affects cost and latency.

### Skill Discovery Pattern

```
System prompt (stable, cached):
  - SOUL.md
  - AGENTS.md  
  - USER.md
  - Skill stubs: [{name: "kalpana", desc: "image gen"}, {name: "narada", desc: "research"}, ...]

Agent needs image gen → calls SkillSearch("image generation")
→ Returns full Kalpana SKILL.md
→ Agent now has the full playbook
→ No cache break because stubs didn't change
```

### Plan Mode as Tool

Instead of modifying the system prompt to enter "planning mode":

```
Agent detects complex problem
→ Calls EnterPlanMode tool
→ Tool returns planning instructions as tool result
→ Agent plans within the conversation
→ No cache break
```

### Squad Coordination

When agents communicate:
- Each agent session has its own stable prefix
- Shared context (Mission Control tasks) loaded via tool calls, not prompt injection
- Agent-to-agent messages delivered as user messages, not system prompt changes

## Cost Optimization

1. Deferred skill loading reduces input tokens by ~80% for skill-heavy sessions
2. Cache-safe compaction avoids paying full price on context overflow
3. Stub ordering is deterministic (alphabetical by skill name) for maximum cache reuse
4. Tool definitions are static per session, never modified after start
