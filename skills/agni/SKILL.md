---
name: agni
description: CI/CD pipeline configuration and optimization — Named after Agni (अग्नि), the fire god who transforms offerings. Your code is the offering; CI/CD is the sacred fire that transforms it into deployable software.
---

# CI/CD Pipelines — Agni (अग्नि)

Like the sacred fire of Agni that transforms raw offerings into divine sustenance, CI/CD transforms raw code into deployed software.

## GitHub Actions Templates

### Basic Node.js CI
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm audit --audit-level=high
```

### Build + Deploy
```yaml
name: Deploy
on:
  push: { branches: [main] }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm run build
      - run: npm test
      - name: Deploy
        run: |
          # Your deploy command here
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

## Pipeline Best Practices

1. **Fail fast**: Lint → Test → Build → Deploy (cheapest checks first)
2. **Cache dependencies**: `cache: npm` saves minutes
3. **Parallel jobs**: Independent tasks run simultaneously
4. **Secrets in env**: Never hardcode credentials
5. **Pin action versions**: `@v4` not `@main`

## Principles

- Green main branch is sacred. Never merge red.
- Deploy automation > manual deploys. Always.
- Pipeline should take < 5 minutes. Slow pipelines don't get run.
- Every production deploy should be reversible.
