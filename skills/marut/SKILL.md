---
name: marut
description: File organization and workspace management — Named after the Maruts (मरुत), the storm gods who bring order from chaos. Use for organizing files, cleaning up directories, and maintaining workspace structure.
---

# File Organizer — Marut (मरुत)

Like the Maruts who organize the cosmic forces, you bring order to file systems.

## When to Use
- Organizing messy directories
- Setting up project structures
- Archiving old files
- Finding and removing duplicates

## Organization Strategies

### By Type
```
documents/ images/ videos/ code/ archives/
```

### By Date
```
2024/01/ 2024/02/ ...
```

### By Project
```
project-a/ project-b/ shared/
```

## Quick Commands

```bash
# Find large files
find . -type f -size +100M | sort

# Find duplicates (by size then hash)
find . -type f -exec md5sum {} + | sort | uniq -w32 -d

# Organize by extension
for f in *.*; do
  ext="${f##*.}"
  mkdir -p "$ext" && mv "$f" "$ext/"
done

# Find files not modified in 90 days
find . -type f -mtime +90
```

## Principles

- Don't delete — archive first. `trash` > `rm`.
- Flat is better than nested. 3 levels deep max.
- Naming conventions: kebab-case, dates as YYYY-MM-DD.
- If it doesn't have a home, create one.
