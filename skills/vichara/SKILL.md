---
name: vichara
description: AI model benchmarking and comparison — Named after Vichara (विचार), Sanskrit for inquiry/investigation/deliberation. Benchmark AI models for speed, quality, and cost to choose the right tool for each job. Inspired by steipete/aibench.
version: 1.0.0
tags: [benchmark, ai, models, comparison, performance, evaluation]
---

# AI Benchmarking — Vichara (विचार)

You evaluate and compare AI models. Like Vichara — the disciplined inquiry that separates truth from illusion — you measure, compare, and recommend the right model for each task.

## When to Use

- Compare model quality for a specific task
- Benchmark API latency and throughput
- Evaluate cost-effectiveness of different providers
- Choose between models for a new use case
- Track model performance over time

## Quick Benchmark

### Latency Test
```bash
# Time a single API call
time curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Say hello"}],"max_tokens":10}' \
  | jq -r '.choices[0].message.content'
```

### Multi-Model Comparison
```bash
#!/bin/bash
PROMPT="Explain quantum computing in 2 sentences."
MODELS=("gpt-4o-mini" "gpt-4o")

for model in "${MODELS[@]}"; do
  echo "=== $model ==="
  START=$(date +%s%N)
  RESPONSE=$(curl -s https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"$model\",\"messages\":[{\"role\":\"user\",\"content\":\"$PROMPT\"}],\"max_tokens\":100}")
  END=$(date +%s%N)
  ELAPSED=$(( (END - START) / 1000000 ))
  echo "Time: ${ELAPSED}ms"
  echo "Response: $(echo $RESPONSE | jq -r '.choices[0].message.content')"
  echo "Tokens: $(echo $RESPONSE | jq '.usage')"
  echo
done
```

## Evaluation Dimensions

### 1. Quality
- **Accuracy**: Correct answers to factual questions
- **Reasoning**: Multi-step logic problems
- **Coding**: Code generation and bug fixing
- **Writing**: Clarity, style, coherence
- **Instruction following**: Does it do exactly what asked?

### 2. Speed
- **Time to first token (TTFT)**: Streaming responsiveness
- **Tokens per second**: Generation speed
- **Total latency**: End-to-end for the full response

### 3. Cost
- **Input cost**: Per million input tokens
- **Output cost**: Per million output tokens
- **Total cost per task**: For your specific use case

### 4. Reliability
- **Error rate**: API failures, timeouts
- **Consistency**: Same quality across runs
- **Rate limits**: Requests/min, tokens/min

## Model Selection Matrix

| Task | Budget Pick | Balanced | Premium |
|------|-----------|----------|---------|
| Classification | gpt-4o-mini | Claude Haiku | - |
| Coding | gpt-4o-mini | Claude Sonnet | Claude Opus |
| Writing | Gemini Flash | gpt-4o | Claude Opus |
| Reasoning | gpt-4o | Claude Sonnet | o1-pro |
| Translation | Gemini Flash | gpt-4o | - |
| Summarization | Gemini Flash | Claude Sonnet | - |

## A/B Testing Pattern

For critical tasks, run A/B tests:
1. Define success criteria (accuracy, user preference, etc.)
2. Run same prompts through 2-3 models
3. Blind-evaluate outputs (or use a judge model)
4. Calculate win rates and statistical significance
5. Factor in cost to get value-adjusted scores

## Best Practices

1. **Test on YOUR data**: Public benchmarks don't reflect your use case
2. **Multiple runs**: Single runs are noisy; average over 10+
3. **Real prompts**: Use actual production prompts, not toy examples
4. **Track over time**: Models get updated; re-benchmark quarterly
5. **Include cost**: A model 5% better but 10x more expensive may not win
