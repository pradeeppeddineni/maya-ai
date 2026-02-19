---
name: tmux-drishti
description: Tmux session monitoring and management — Named after Drishti (दृष्टि), Sanskrit for vision/sight. Watch and manage tmux sessions, monitor running processes, and keep track of background tasks. Inspired by steipete/tmuxwatch.
version: 1.0.0
tags: [tmux, sessions, monitoring, processes, terminal, background]
---

# Tmux Monitor — Drishti (दृष्टि)

You oversee all running sessions. Like Drishti — the focused gaze that sees through complexity — you monitor tmux sessions, track background processes, and keep everything running smoothly.

## When to Use

- Monitor running tmux sessions
- Check on background processes
- Manage long-running tasks
- Debug stuck or failed processes
- Clean up abandoned sessions

## Quick Reference

### Session Management
```bash
# List all sessions
tmux ls

# Create named session
tmux new -s myproject -d  # -d = detached

# Attach to session
tmux attach -t myproject

# Kill session
tmux kill-session -t myproject

# Kill all sessions
tmux kill-server
```

### Window/Pane Management
```bash
# List windows in session
tmux list-windows -t myproject

# Send command to a pane
tmux send-keys -t myproject:0.0 "npm run build" Enter

# Capture pane output
tmux capture-pane -t myproject:0.0 -p  # print to stdout
tmux capture-pane -t myproject:0.0 -p -S -100  # last 100 lines
```

### Monitoring Patterns

```bash
# Watch all sessions status (like tmuxwatch)
watch -n 5 'tmux ls 2>/dev/null && echo "---" && for s in $(tmux ls -F "#{session_name}"); do echo "=== $s ==="; tmux capture-pane -t "$s" -p | tail -3; done'

# Check if specific session is alive
tmux has-session -t myproject 2>/dev/null && echo "running" || echo "dead"

# Get pane PID for monitoring
tmux list-panes -t myproject -F '#{pane_pid}' | xargs ps -p
```

### Scripted Session Setup
```bash
#!/bin/bash
# Create a dev environment
SESSION="dev"
tmux new-session -d -s $SESSION -n editor
tmux send-keys -t $SESSION:editor "vim ." Enter
tmux new-window -t $SESSION -n server
tmux send-keys -t $SESSION:server "npm run dev" Enter
tmux new-window -t $SESSION -n logs
tmux send-keys -t $SESSION:logs "tail -f /var/log/app.log" Enter
tmux select-window -t $SESSION:editor
```

## Process Health Checks

```bash
# Check if process in tmux pane is still running
PANE_PID=$(tmux list-panes -t session:0.0 -F '#{pane_pid}')
if ps -p $PANE_PID > /dev/null 2>&1; then
    echo "Process alive"
else
    echo "Process died — restarting"
    tmux send-keys -t session:0.0 "npm run dev" Enter
fi
```

## Integration with OpenClaw

OpenClaw often runs in a tmux session. Monitor it:
```bash
# Check OpenClaw tmux session
tmux capture-pane -t openclaw -p | tail -20

# Restart if needed
tmux send-keys -t openclaw C-c
sleep 1
tmux send-keys -t openclaw "openclaw gateway start" Enter
```

## Best Practices

1. **Name sessions meaningfully**: `tmux new -s project-name`
2. **Clean up**: Kill sessions you're done with
3. **Capture before kill**: Save output before terminating
4. **Auto-restart**: Script respawn for critical processes
5. **Don't nest**: Avoid tmux-in-tmux confusion
