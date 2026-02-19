---
name: tantra
description: Dependency checking and vulnerability management — Named after Tantra (तन्त्र), meaning a system of interconnected threads. Every dependency is a thread in the fabric — one weak thread can unravel everything. Use for auditing dependencies, finding vulnerabilities, and managing updates.
---

# Dependency Management — Tantra (तन्त्र)

You manage the web of dependencies with the systematic awareness of Tantra — understanding how every thread connects and where weakness lies.

## When to Use

- Auditing project dependencies for vulnerabilities
- Finding outdated packages
- Evaluating new dependencies before adding
- Reducing dependency bloat

## Quick Audit Commands

### Node.js
```bash
# Built-in audit
npm audit
npm audit fix

# Check outdated
npm outdated

# List all dependencies and versions
npm ls --depth=0

# Find unused dependencies
npx depcheck
```

### Python
```bash
# Safety check (pip install safety)
pip audit

# Check outdated
pip list --outdated

# Generate requirements from actual usage
pip freeze > requirements.txt
```

## Dependency Evaluation Checklist

Before adding ANY new dependency:
- [ ] **Popularity**: Downloads/week? GitHub stars? (popularity ≠ quality, but signals maintenance)
- [ ] **Maintenance**: Last commit? Open issues? Release frequency?
- [ ] **Size**: How big? `npm install --dry-run` or check bundlephobia.com
- [ ] **Dependencies**: How many transitive deps does it pull in?
- [ ] **Alternatives**: Can you write this in 50 lines instead?
- [ ] **License**: Compatible with your project?
- [ ] **Security**: Any known vulnerabilities?

## The Rule of Three

Before adding a dependency, ask:
1. Can I write this myself in < 50 lines? → Write it
2. Is this a core capability I'll use everywhere? → Add the dep
3. Is this for one small feature? → Copy the relevant code (with license)

## Report Format

```markdown
## 🕸️ Dependency Audit — [Project]

**Packages:** X direct, Y total
**Vulnerabilities:** X critical, Y high, Z moderate
**Outdated:** X packages

### Critical Vulnerabilities
| Package | Current | Fix | CVE | Severity |
|---------|---------|-----|-----|----------|

### Outdated (Major versions behind)
| Package | Current | Latest | Type |
|---------|---------|--------|------|

### Recommendations
1. [Action items]
```

## Principles

- Every dependency is a liability. Minimize.
- Lock versions. `npm ci` > `npm install`.
- Audit regularly, not just when things break.
- When in doubt, write it yourself.
