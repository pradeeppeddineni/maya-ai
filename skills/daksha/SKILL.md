---
name: daksha
description: Test-driven development and test generation — Named after Daksha (दक्ष), the skilled creator god known for meticulous craftsmanship. Use for writing tests, TDD workflows, and ensuring code correctness.
---

# Test Writing & TDD — Daksha (दक्ष)

You write tests with the precision of Daksha, the master craftsman. Tests prove code works. No test = no proof.

## When to Use

- Writing tests for new features
- Adding tests to existing code
- TDD: test-first development
- Bug reproduction with failing tests

## The Iron Law of TDD

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**

Wrote code before the test? Delete it. Start over. No exceptions.

## Red-Green-Refactor Cycle

### 🔴 RED — Write a Failing Test
```javascript
// Node.js built-in test runner
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('createTask', () => {
  test('creates task with title and default status', () => {
    const task = createTask({ title: 'Test task' });
    assert.equal(task.title, 'Test task');
    assert.equal(task.status, 'inbox');
    assert.ok(task.id);
  });
});
```

Run it. Watch it fail. Confirm it fails for the RIGHT reason.

### 🟢 GREEN — Write Minimal Code to Pass
Simplest possible implementation. Don't get clever.

### 🔵 REFACTOR — Clean Up
Only after green. Remove duplication, improve names. Stay green.

## Test Quality Checklist

### Good Tests
- **One behavior per test**: If name has "and", split it
- **Clear names**: `test('rejects expired tokens')` not `test('test1')`
- **No implementation coupling**: Test behavior, not internals
- **Fast**: Each test < 100ms. Slow tests don't get run.
- **Independent**: No test depends on another test's state

### What to Test
- **Happy path**: Does it work with good input?
- **Edge cases**: Empty, null, undefined, zero, max, negative
- **Error cases**: Invalid input, network failure, timeout
- **Boundaries**: Off-by-one, array bounds, string limits

### What NOT to Test
- Third-party libraries (they test themselves)
- Trivial getters/setters
- Implementation details (private methods)
- Things that can't fail

## Testing Patterns by Type

### Unit Tests (functions, classes)
```javascript
test('parseFrontmatter extracts name from YAML', () => {
  const input = '---\nname: test\n---\nBody';
  const { meta } = parseFrontmatter(input);
  assert.equal(meta.name, 'test');
});
```

### Integration Tests (modules working together)
```javascript
test('skill loader finds all skills in directory', () => {
  const skills = loadAllSkills('./test-fixtures/skills');
  assert.ok(skills.length >= 2);
  assert.ok(skills.find(s => s.name === 'test-skill'));
});
```

### CLI Tests (command output)
```javascript
import { execSync } from 'child_process';

test('maya status shows version', () => {
  const output = execSync('node cli/index.js status').toString();
  assert.match(output, /Maya AI v\d+/);
});
```

## Running Tests

```bash
# Node.js built-in test runner
node --test tests/

# Specific file
node --test tests/skill-loader.test.js

# With pattern
node --test --test-name-pattern="parseFrontmatter" tests/
```

## Principles

- A test you never saw fail proves nothing.
- Test behavior, not implementation. Code can change; behavior shouldn't.
- If it's hard to test, the design is wrong.
- 100% coverage is a lie. Meaningful coverage is the goal.
