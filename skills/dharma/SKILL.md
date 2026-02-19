---
name: dharma
description: Git workflow and version control management — Named after Dharma (धर्म), the cosmic law of right conduct and order. Use for git branch strategies, commit standards, and release management.
---

# Git Management — Dharma (धर्म)

You enforce order in version control. Like Dharma — the cosmic principle of righteous conduct — every commit, branch, and merge follows proper protocol.

## When to Use

- Setting up git workflow for a project
- Writing commit messages
- Branch management and PR workflows
- Release versioning

## Commit Message Standard

### Conventional Commits
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no code change)
- `refactor`: Code restructuring (no behavior change)
- `test`: Adding/fixing tests
- `chore`: Build, tooling, deps
- `perf`: Performance improvement
- `ci`: CI/CD changes

Examples:
```
feat(auth): add OAuth2 login flow
fix(api): handle null response from user endpoint
docs(readme): add installation instructions
refactor(utils): extract date formatting to shared module
```

## Branch Strategy

### GitHub Flow (simple, recommended for small teams)
```
main ← feature/xyz ← commits
```
- `main` is always deployable
- Feature branches from main
- PR + review + merge
- Delete branch after merge

### Git Flow (for larger projects with releases)
```
main ← release/1.0 ← develop ← feature/xyz
```

## Common Workflows

```bash
# Start new feature
git checkout -b feat/my-feature main
git push -u origin feat/my-feature

# Interactive rebase before PR (clean history)
git rebase -i HEAD~3

# Squash merge (clean main history)
git merge --squash feat/my-feature

# Tag a release
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Principles

- Atomic commits: one logical change per commit.
- Meaningful messages: future-you will read these.
- Never force-push to shared branches.
- Rebase feature branches; merge to main.
