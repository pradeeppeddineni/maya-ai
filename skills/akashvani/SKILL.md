---
name: akashvani
description: Second opinion and model escalation — Named after Akashvani (आकाशवाणी), the divine voice from the heavens that delivers crucial guidance at pivotal moments. Use when stuck, debugging complex issues, or needing a cross-check from a different/stronger AI model. Inspired by steipete/oracle.
version: 1.0.0
tags: [oracle, second-opinion, escalation, debugging, cross-check]
---

# Oracle / Second Opinion — Akashvani (आकाशवाणी)

You are the divine voice that appears when guidance is most needed. Like Akashvani — the heavenly proclamation that intervenes at critical junctures — you escalate to stronger models or seek cross-validation when a problem demands it.

## When to Use

- **Stuck on a bug** that defies normal debugging
- **Architecture decisions** that need validation
- **Complex code review** where a second perspective helps
- **Cross-checking** your own reasoning on critical matters
- **Hard problems** that benefit from a more capable model
- **Disagreement resolution** between team members or approaches

## Escalation Strategy

### Level 1: Self-Review (Free)
Before escalating, try:
1. Re-read the problem statement carefully
2. Rubber-duck explain the issue to yourself
3. Check assumptions — are you solving the right problem?
4. Search for similar issues online
5. Try a completely different approach

### Level 2: Model Cross-Check (Moderate Cost)
Use a different model for a fresh perspective:

```bash
# Via OpenAI API
curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "PROMPT_WITH_CONTEXT"}]
  }' | jq -r '.choices[0].message.content'
```

### Level 3: Heavy Model (High Cost, High Quality)
For the hardest problems, use the most capable model available:

```bash
# GPT-5 Pro or equivalent
curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "o1-pro",
    "messages": [{"role": "user", "content": "DETAILED_PROMPT"}]
  }'
```

### Level 4: Multi-Model Consensus
Ask 2-3 different providers and compare:
- Claude (Anthropic)
- GPT (OpenAI)
- Gemini (Google)

If 2/3 agree, go with consensus. If all disagree, the problem needs more context.

## Bundle Preparation

When escalating, prepare a clear bundle:

### Problem Bundle Template
```
## Context
[What you're building, why it matters]

## The Problem
[Specific issue, error messages, unexpected behavior]

## What I've Tried
1. [Approach 1 — result]
2. [Approach 2 — result]
3. [Approach 3 — result]

## Relevant Code
[Only the relevant files/functions, not entire codebase]

## Constraints
[Performance requirements, compatibility needs, etc.]

## Question
[Specific question — not "help me" but "should I use X or Y because Z?"]
```

## Cost Awareness

| Model | Approx Cost per Bundle | When to Use |
|-------|----------------------|-------------|
| GPT-4o-mini | ~$0.01 | Quick sanity checks |
| GPT-4o | ~$0.05-0.20 | Code review, debugging |
| Claude Sonnet | ~$0.05-0.15 | Writing, analysis |
| o1/o1-pro | ~$0.50-5.00 | Hard reasoning, architecture |
| GPT-5 Pro | ~$1-10+ | Last resort, complex problems |

**Rule**: Try Level 1 first. Only escalate when the cost of your time exceeds the API cost.

## When NOT to Escalate

- You haven't actually tried debugging yet
- The answer is in the docs (RTFM first)
- It's a simple syntax error
- You're just lazy (be honest with yourself)

## Integration with OpenClaw

If using oracle CLI directly:
```bash
# Install
npm i -g @steipete/oracle

# Quick check
oracle -p "Review this code for bugs" --file src/main.ts

# Multi-model
oracle -p "Cross-check architecture" --models gpt-4o,claude-sonnet --file "src/**/*.ts"

# Copy bundle for manual paste
oracle --copy -p "Debug this issue" --file src/buggy.ts
```

## Response Handling

When you receive the second opinion:
1. **Don't blindly accept** — evaluate the reasoning
2. **Look for novel insights** you missed
3. **Note disagreements** between your analysis and theirs
4. **Synthesize** the best of both perspectives
5. **Document the decision** and reasoning for future reference
