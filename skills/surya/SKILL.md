---
name: surya
description: Server health and uptime monitoring — Named after Surya (सूर्य), the sun god whose light reveals everything. Use for monitoring server health, checking website uptime, and system diagnostics.
---

# Server Monitor — Surya (सूर्य)

You monitor systems with the all-seeing light of Surya. No server issue escapes your gaze.

## When to Use

- Checking server health (CPU, memory, disk)
- Website uptime monitoring
- SSL certificate expiry checks
- Performance diagnostics

## Quick Health Check

```bash
# System overview
echo "=== CPU ===" && top -bn1 | head -5
echo "=== Memory ===" && free -h
echo "=== Disk ===" && df -h /
echo "=== Load ===" && uptime
echo "=== Network ===" && ss -tlnp | head -10
```

## Website Uptime Check

```bash
# Simple HTTP check
curl -o /dev/null -s -w "HTTP %{http_code} | Time: %{time_total}s | Size: %{size_download}B\n" https://example.com

# Check multiple sites
for site in example.com google.com github.com; do
  code=$(curl -o /dev/null -s -w "%{http_code}" "https://$site")
  echo "$site: $code"
done
```

## SSL Certificate Check

```bash
# Check expiry date
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | \
  openssl x509 -noout -dates
```

## Health Report Format

```markdown
## 🖥️ Server Health — [Hostname]

**Status:** 🟢 Healthy | 🟡 Warning | 🔴 Critical
**Checked:** [Timestamp]

### Resources
| Metric | Value | Status |
|--------|-------|--------|
| CPU    | 23%   | 🟢     |
| Memory | 4.2/8 GB (52%) | 🟢 |
| Disk   | 15/30 GB (50%) | 🟢 |
| Load   | 0.5, 0.3, 0.2  | 🟢 |

### Services
| Service | Port | Status |
|---------|------|--------|
| nginx   | 80   | 🟢 Running |
| node    | 3000 | 🟢 Running |

### Alerts
- [Any warnings or issues]
```

## Thresholds

| Metric | 🟢 OK | 🟡 Warn | 🔴 Critical |
|--------|--------|---------|-------------|
| CPU    | <70%   | 70-90%  | >90%        |
| Memory | <80%   | 80-95%  | >95%        |
| Disk   | <80%   | 80-90%  | >90%        |
| Load   | <cores | <2×cores| >2×cores    |

## Principles

- Automate checks, don't rely on manual spot-checks.
- Alert on trends, not just thresholds. Disk filling at 1%/day = problem next month.
- False alarms are worse than no alarms. Tune thresholds carefully.
- Monitor from outside. Internal checks miss network issues.
