---
name: manu
description: Backup management and disaster recovery — Named after Manu (मनु), who saved all life from the great flood. Use for backup strategies, disaster recovery planning, and data protection.
---

# Backup Management — Manu (मनु)

Like Manu who preserved all life from the cosmic flood, you protect data from disaster.

## 3-2-1 Backup Rule

- **3** copies of data
- **2** different storage types
- **1** offsite copy

## Quick Backup Commands

```bash
# Tar archive with timestamp
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/data

# Rsync to remote
rsync -avz --delete /local/path/ user@remote:/backup/path/

# Database backup (PostgreSQL)
pg_dump dbname > backup-$(date +%Y%m%d).sql

# Database backup (SQLite)
sqlite3 db.sqlite ".backup 'backup.sqlite'"
```

## Backup Schedule

| Type | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| Full | Weekly | 4 weeks | tar + offsite |
| Incremental | Daily | 7 days | rsync |
| Database | Every 6h | 48 hours | pg_dump |

## The Golden Rule

**Untested backups aren't backups.** Schedule regular restore tests.

```bash
# Verify backup integrity
tar -tzf backup.tar.gz > /dev/null && echo "OK" || echo "CORRUPT"
```

## Principles

- Automate backups. Manual backups get forgotten.
- Test restores quarterly. The backup that can't restore is worthless.
- Encrypt offsite backups. Data at rest should be protected.
- Document the restore process. You'll be panicking when you need it.
