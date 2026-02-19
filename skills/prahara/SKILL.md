---
name: prahara
description: File watching, build automation, and hot reload — Named after Prahara (प्रहर), the ancient Indian unit of time (3-hour watch) used by sentinels guarding the kingdom. Watches files for changes and triggers rebuilds automatically. Inspired by steipete/poltergeist.
version: 1.0.0
tags: [watch, build, automation, hot-reload, devops, file-watcher]
---

# File Watcher & Build Automation — Prahara (प्रहर)

You are the vigilant sentinel. Like Prahara — the watch period when guards scan the horizon — you monitor files and trigger actions the instant something changes.

## When to Use

- Auto-rebuild on file changes during development
- Watch config files and reload services
- Monitor logs for patterns and alert
- Trigger CI/CD pipelines on file changes
- Live-reload development servers

## Quick Start with Poltergeist

```bash
# Install
npm i -g @steipete/poltergeist

# Auto-detect project and configure
poltergeist init

# Start watching (background daemon)
poltergeist haunt

# Manual build trigger
poltergeist build [target]

# Status
poltergeist status
```

## Native Linux File Watching

### inotifywait (lightweight, built-in)
```bash
# Watch a directory and run command on change
inotifywait -m -r -e modify,create,delete ./src | while read path action file; do
  echo "File $file was $action"
  npm run build
done

# One-shot watch
inotifywait -r -e modify ./src && make build
```

### entr (simple, elegant)
```bash
# Rebuild when any .py file changes
find . -name '*.py' | entr python -m pytest

# Restart server on change
find . -name '*.js' | entr -r node server.js

# Clear screen and run
find . -name '*.ts' | entr -c npx tsc
```

### watchman (Facebook, powerful)
```bash
# Install
sudo apt install watchman  # or brew install watchman

# Watch and trigger
watchman watch ./src
watchman -- trigger ./src build '*.ts' -- npm run build
```

## Common Patterns

### Development Hot Reload
```bash
# Node.js
nodemon --watch src --ext ts,js --exec "npm run dev"

# Python
find . -name '*.py' | entr -r python app.py

# Generic
poltergeist haunt  # auto-detects project type
```

### Config File Monitoring
```bash
# Reload nginx on config change
inotifywait -m -e modify /etc/nginx/nginx.conf | while read; do
  nginx -t && systemctl reload nginx
  echo "$(date): nginx reloaded"
done
```

### Log Monitoring
```bash
# Alert on errors in log
tail -F /var/log/app.log | grep --line-buffered "ERROR" | while read line; do
  echo "⚠️ Error detected: $line"
  # Send notification
done
```

## Poltergeist Config (poltergeist.config.json)
```json
{
  "targets": [
    {
      "name": "app",
      "type": "executable",
      "buildCommand": "npm run build",
      "watchPaths": ["src/"],
      "excludePaths": ["node_modules/", ".git/", "dist/"],
      "extensions": [".ts", ".tsx", ".css"]
    }
  ],
  "notifications": {
    "sound": true,
    "system": true
  }
}
```

## Best Practices

1. **Exclude wisely**: Always exclude node_modules, .git, build output, temp files
2. **Debounce**: Don't rebuild on every keystroke — wait for saves to settle (200-500ms)
3. **Fail fast**: Show build errors immediately with context
4. **Notify on status change**: Only notify on success→fail or fail→success transitions
5. **Resource limits**: Cap concurrent builds to prevent CPU storms
6. **Graceful shutdown**: Clean up child processes when stopping the watcher
