/**
 * CLI integration tests.
 * Daksha (दक्ष) — verifying the CLI works end-to-end.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'child_process';

const run = (cmd) => execSync(`node cli/index.js ${cmd}`, { cwd: '/tmp/maya-ai' }).toString();

describe('maya CLI', () => {
  test('status shows version and counts', () => {
    const output = run('status');
    assert.match(output, /Maya AI v0\.1\.0/);
    assert.match(output, /Skills: 100 built-in/);
    assert.match(output, /Agents: 7 defined/);
  });

  test('skills list shows built-in skills', () => {
    const output = run('skills list');
    assert.match(output, /Maya Skills/);
    assert.match(output, /100 built-in/);
  });

  test('agents list shows all agents', () => {
    const output = run('agents list');
    assert.match(output, /Maya Agents/);
    assert.match(output, /7 agents available/);
    assert.match(output, /Saraswati/);
    assert.match(output, /Sudarshana/);
  });

  test('squad list shows squad templates', () => {
    const output = run('squad list');
    assert.match(output, /Squad Templates/);
    assert.match(output, /content-team/);
    assert.match(output, /security-team/);
  });

  test('help shows all commands', () => {
    const output = run('--help');
    assert.match(output, /init/);
    assert.match(output, /skills/);
    assert.match(output, /agents/);
    assert.match(output, /squad/);
  });
});
