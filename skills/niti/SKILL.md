---
name: niti
description: Agent rules, guardrails, and best practices — Named after Niti (नीति), Sanskrit for policy/ethics/rules of conduct. A comprehensive guide for writing effective AGENTS.md, CLAUDE.md, and agent instruction files. Inspired by steipete/agent-rules (5.6k⭐) and steipete/agent-scripts.
version: 1.0.0
tags: [agents, rules, guardrails, best-practices, prompt-engineering, instructions]
---

# Agent Rules & Guardrails — Niti (नीति)

You craft the rules that govern AI agents. Like Niti — the ancient science of statecraft and ethical conduct — you establish clear, effective guidelines that make agents reliable, safe, and productive.

## When to Use

- Writing AGENTS.md or CLAUDE.md for a project
- Setting up guardrails for AI coding agents
- Creating system prompts or instruction files
- Establishing team conventions for AI-assisted development
- Reviewing and improving existing agent configurations

## AGENTS.md Structure

### Essential Sections

```markdown
# AGENTS.md

## Project Overview
[What this project is, tech stack, architecture in 2-3 sentences]

## Key Rules
- [Rule 1: Most critical constraint]
- [Rule 2: Second most critical]
- [Rule 3: ...]

## Code Style
- [Language-specific conventions]
- [Formatting preferences]
- [Naming conventions]

## Testing
- [How to run tests]
- [Test requirements before committing]
- [Coverage expectations]

## Git Workflow
- [Branch naming]
- [Commit message format]
- [PR process]

## Do NOT
- [Explicit list of things to avoid]
- [Common mistakes to prevent]
```

### Best Practices from steipete/agent-rules

1. **Be specific, not vague**: "Use 2-space indentation" not "format code nicely"
2. **Prioritize**: Put most important rules first — agents may truncate
3. **Use examples**: Show correct and incorrect patterns
4. **Keep it DRY**: Use pointer files for shared rules across repos
5. **Version it**: Track changes to agent rules in git
6. **Test rules**: Verify agents actually follow your rules

### Pointer Pattern (Multi-Repo)
```markdown
# AGENTS.md
READ ~/Projects/agent-scripts/AGENTS.MD BEFORE ANYTHING (skip if missing).

## Repo-Specific Rules
[Only rules unique to THIS repo go here]
```

## Guardrail Categories

### Safety Guardrails
- Never delete without confirmation (use trash > rm)
- No force-pushes to main/master
- No credential exposure in commits
- No destructive database operations without backup

### Quality Guardrails
- Run tests before every commit
- Lint before committing
- Type-check TypeScript/Python code
- Keep functions under 50 lines

### Process Guardrails
- One logical change per commit
- Meaningful commit messages (conventional commits)
- Always create a branch for large changes
- Review diffs before committing

## Committer Helper Pattern

Inspired by steipete's `scripts/committer`:
```bash
#!/bin/bash
# Committer helper: stages specific files and creates clean commits
set -euo pipefail

FILES="$@"
if [ -z "$FILES" ]; then echo "Usage: committer <files...>"; exit 1; fi

# Stage only listed files
git add $FILES

# Require non-empty message
read -p "Commit message: " MSG
if [ -z "$MSG" ]; then echo "Empty message, aborting"; exit 1; fi

git commit -m "$MSG"
echo "✅ Committed: $MSG"
```

## Common Agent Instructions

### For Coding Agents
```markdown
## Rules
1. Always read the full file before editing
2. Run tests after every change
3. Commit frequently with descriptive messages
4. Ask before deleting files — use trash
5. If tests fail, fix them before moving on
6. Don't modify files outside the project directory
```

### For Research Agents
```markdown
## Rules
1. Cite sources for all claims
2. Verify facts from multiple sources
3. Distinguish between facts, opinions, and speculation
4. Note when information may be outdated
5. Provide confidence levels for uncertain conclusions
```

### For Communication Agents
```markdown
## Rules
1. Never send external messages without explicit approval
2. Match the tone and formality of the platform
3. Proofread before sending
4. Don't share private information in public channels
5. Ask if unsure about the appropriate response
```

## Anti-Patterns to Avoid

1. **Too many rules**: Agents lose focus beyond ~20 rules
2. **Contradictory rules**: "Be concise" + "Be thorough" without context
3. **Vague rules**: "Write good code" is useless
4. **No examples**: Rules without examples get misinterpreted
5. **Stale rules**: Rules that reference deprecated patterns
6. **Micromanagement**: Trust the agent for obvious decisions

## Docs Lister Pattern

From steipete's `docs-list.ts` — enforce front-matter in docs:
```markdown
---
summary: What this doc covers in one line
read_when: When an agent should read this doc
---
```

This lets agents selectively load only relevant documentation, saving context window space.
