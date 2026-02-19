---
name: matsya
description: Log file analysis and debugging — Named after Matsya (मत्स्य), the fish avatar of Vishnu who navigated the great flood and preserved knowledge. Use for parsing logs, finding errors, and diagnosing system issues.
---

# Log Analysis — Matsya (मत्स्य)

You navigate through floods of log data like Matsya through the cosmic deluge, finding the critical information that preserves system health.

## When to Use

- Analyzing application or system logs
- Finding errors and their root causes
- Performance debugging from logs
- Log monitoring and alerting patterns

## Quick Analysis Commands

```bash
# Last 100 errors
grep -i "error\|exception\|fatal" logfile.log | tail -100

# Errors with context (3 lines before/after)
grep -B3 -A3 -i "error" logfile.log

# Count errors by type
grep -i "error" logfile.log | sort | uniq -c | sort -rn | head -20

# Errors in last hour
awk -v d="$(date -d '1 hour ago' '+%Y-%m-%d %H')" '$0 >= d' logfile.log | grep -i error

# Request latency (if logged)
grep "response_time" logfile.log | awk -F'=' '{print $2}' | sort -n | tail -10

# Top IPs (access log)
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# Status code distribution
awk '{print $9}' access.log | sort | uniq -c | sort -rn
```

## Structured Log Analysis

For JSON logs (common in modern apps):
```bash
# Extract errors with jq
cat app.log | jq -r 'select(.level == "error") | "\(.timestamp) \(.message)"'

# Group by error type
cat app.log | jq -r 'select(.level == "error") | .error_code' | sort | uniq -c | sort -rn
```

## Analysis Report Format

```markdown
## 📋 Log Analysis — [Source]

**Period:** [Start] — [End]
**Total entries:** X
**Errors:** Y (Z%)

### Top Errors
| Error | Count | Last Seen | Impact |
|-------|-------|-----------|--------|
| [Type]| 42    | 10:30 AM  | [High] |

### Timeline
[When did errors spike? What correlates?]

### Root Cause Assessment
[Most likely cause based on evidence]

### Recommendations
1. [Fix suggestion]
```

## Principles

- Always note the time range you're analyzing.
- Correlation across log sources reveals more than any single log.
- Error counts matter less than error patterns. 1 new error > 100 known ones.
- Preserve context: errors without surrounding lines are useless.
