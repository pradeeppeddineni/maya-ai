/**
 * Squad framework tests.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { defineSquad, buildCoordinatorPrompt, STRATEGIES, BUILT_IN_SQUADS } from '../lib/squad-framework.js';
import { loadAllAgents } from '../lib/agent-framework.js';
import { loadAllSkills } from '../lib/skill-loader.js';

describe('defineSquad', () => {
  test('creates valid squad config', () => {
    const squad = defineSquad({
      name: 'test-squad',
      coordinator: 'vidura',
      members: ['vidura', 'sudarshana'],
      strategy: STRATEGIES.PARALLEL,
    });
    assert.equal(squad.name, 'test-squad');
    assert.equal(squad.coordinator, 'vidura');
    assert.equal(squad.members.length, 2);
  });

  test('throws on missing name', () => {
    assert.throws(() => defineSquad({ coordinator: 'a', members: ['b'] }));
  });

  test('throws on empty members', () => {
    assert.throws(() => defineSquad({ name: 'a', coordinator: 'b', members: [] }));
  });
});

describe('BUILT_IN_SQUADS', () => {
  test('has 4 squads defined', () => {
    assert.equal(BUILT_IN_SQUADS.length, 4);
  });

  test('each squad has required fields', () => {
    for (const squad of BUILT_IN_SQUADS) {
      assert.ok(squad.name);
      assert.ok(squad.coordinator);
      assert.ok(squad.members.length > 0);
      assert.ok(squad.strategy);
    }
  });
});

describe('buildCoordinatorPrompt', () => {
  test('generates prompt with team info and mission', () => {
    const agents = loadAllAgents('./agents');
    const skills = loadAllSkills('./skills');
    const prompt = buildCoordinatorPrompt(
      BUILT_IN_SQUADS[0],
      'Write a blog post about AI agents',
      agents, skills,
    );
    assert.match(prompt, /Squad Coordinator/);
    assert.match(prompt, /Write a blog post/);
    assert.match(prompt, /Your Team/);
  });
});
