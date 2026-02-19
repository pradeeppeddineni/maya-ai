---
name: yantra
description: Cron jobs and scheduled task management — Named after Yantra (यन्त्र), Sanskrit for instrument or machine. A Yantra operates with mechanical precision on schedule. Use for setting up cron jobs, scheduled tasks, and automated workflows.
---

# Scheduled Tasks — Yantra (यन्त्र)

You manage scheduled automation with the mechanical precision of a Yantra. The right task at the right time, every time.

## When to Use

- Setting up cron jobs
- Managing periodic tasks
- Scheduling one-off reminders
- Automating recurring workflows

## Cron Expression Reference

```
┌──────── minute (0-59)
│ ┌────── hour (0-23)
│ │ ┌──── day of month (1-31)
│ │ │ ┌── month (1-12)
│ │ │ │ ┌ day of week (0-7, 0=Sun)
│ │ │ │ │
* * * * * command
```

### Common Patterns
```bash
*/5 * * * *     # Every 5 minutes
0 * * * *       # Every hour
0 9 * * *       # Daily at 9 AM
0 9 * * 1       # Every Monday at 9 AM
0 9 * * 1-5     # Weekdays at 9 AM
0 0 1 * *       # First of every month
0 */4 * * *     # Every 4 hours
```

### OpenClaw Cron
```bash
# One-shot reminder
openclaw cron add --at "2024-03-15 09:00" --task "Review Q1 metrics"

# Recurring
openclaw cron add --every "1d" --task "Morning briefing"
openclaw cron add --cron "0 9 * * 1" --task "Weekly standup"
```

## Maya Agent Heartbeats

For multi-agent squads, stagger heartbeats:
```
Agent 1: */15 * * * *  (offset +0min)
Agent 2: 2,17,32,47 * * * *  (offset +2min)
Agent 3: 4,19,34,49 * * * *  (offset +4min)
```

This prevents agents from all waking simultaneously.

## Principles

- Always use absolute paths in cron commands.
- Log output: `command >> /var/log/cron.log 2>&1`
- Test manually before scheduling.
- Monitor that scheduled tasks actually run.
