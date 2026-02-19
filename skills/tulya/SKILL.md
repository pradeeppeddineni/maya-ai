---
name: tulya
description: LLM token counting and cost tracking — Named after Tulya (तुल्य), Sanskrit for balance/measurement/equivalence. Track token usage, estimate costs, and optimize LLM spending across providers. Inspired by steipete/tokentally and steipete/CodexBar.
version: 1.0.0
tags: [tokens, cost, tracking, llm, budget, optimization]
---

# Token & Cost Tracking — Tulya (तुल्य)

You measure and balance AI spending. Like Tulya — the principle of fair measurement — you track every token, estimate costs, and help optimize LLM usage.

## When to Use

- Estimate cost before running an expensive prompt
- Track cumulative API spending
- Compare cost-effectiveness of different models
- Set budget alerts and limits
- Optimize prompts for cost efficiency

## Token Estimation

### Quick Rules of Thumb
- **1 token ≈ 4 characters** (English)
- **1 token ≈ ¾ of a word**
- **1 page of text ≈ 500-750 tokens**
- **1K tokens ≈ 750 words**

### Programmatic Counting
```bash
# Using tiktoken (Python)
pip install tiktoken
python3 -c "
import tiktoken
enc = tiktoken.encoding_for_model('gpt-4o')
text = open('file.txt').read()
print(f'{len(enc.encode(text))} tokens')
"

# Quick estimate (characters / 4)
wc -c file.txt | awk '{printf "~%d tokens\n", $1/4}'
```

## Model Pricing Reference (2025-2026)

### OpenAI
| Model | Input ($/1M) | Output ($/1M) | Notes |
|-------|-------------|---------------|-------|
| gpt-4o-mini | $0.15 | $0.60 | Best value |
| gpt-4o | $2.50 | $10.00 | Good balance |
| o1 | $15.00 | $60.00 | Reasoning |
| o1-pro | $150.00 | $600.00 | Last resort |

### Anthropic
| Model | Input ($/1M) | Output ($/1M) | Notes |
|-------|-------------|---------------|-------|
| Claude Haiku 3.5 | $0.80 | $4.00 | Fast & cheap |
| Claude Sonnet 4 | $3.00 | $15.00 | Best balance |
| Claude Opus 4 | $15.00 | $75.00 | Most capable |

### Google
| Model | Input ($/1M) | Output ($/1M) | Notes |
|-------|-------------|---------------|-------|
| Gemini Flash | $0.075 | $0.30 | Ultra cheap |
| Gemini Pro | $1.25 | $5.00 | Good quality |

*Prices change frequently. Check provider docs for current rates.*

## Cost Optimization Strategies

### 1. Right-Size Your Model
- **Simple tasks** (formatting, extraction): Use mini/flash models
- **Standard tasks** (writing, coding): Use mid-tier (Sonnet, 4o)
- **Hard problems** (reasoning, math): Use premium (Opus, o1)

### 2. Reduce Input Tokens
- Trim unnecessary context
- Summarize long documents before passing to expensive models
- Use system prompts efficiently (they're cached after first use)

### 3. Reduce Output Tokens
- Ask for concise responses: "Answer in under 100 words"
- Use structured output (JSON) to avoid verbose formatting
- Set max_tokens to cap runaway responses

### 4. Use Caching
- Anthropic prompt caching: 90% discount on cached prefixes
- OpenAI batch API: 50% discount for non-urgent tasks
- Cache common tool outputs locally

### 5. Batch When Possible
- Group similar requests into one prompt
- Use batch APIs for bulk processing (50% cheaper)

## Budget Tracking

### Simple Log-Based Tracking
```bash
# Log each API call
echo "$(date -Iseconds) model=$MODEL input=$INPUT_TOKENS output=$OUTPUT_TOKENS cost=$COST" >> ~/.api-costs.log

# Daily summary
grep "$(date +%Y-%m-%d)" ~/.api-costs.log | awk '{sum += $NF} END {printf "Today: $%.4f\n", sum}'
```

### Monthly Budget Alerts
Set spending limits in provider dashboards:
- OpenAI: Settings → Limits → Monthly budget
- Anthropic: Settings → Spending limits
- Google: Cloud billing budgets

## Best Practices

1. **Always estimate before big runs**: Count tokens, multiply by price
2. **Start cheap, escalate**: Try mini/flash first, only upgrade if quality insufficient
3. **Monitor weekly**: Review spending patterns and optimize
4. **Cache aggressively**: Don't re-process unchanged content
5. **Log everything**: Track model, tokens, cost per request for analysis
