/**
 * Tests for the skill loader module.
 * Daksha (दक्ष) — TDD for maya-ai core.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, loadSkill, loadAllSkills, validateSkill } from '../lib/skill-loader.js';

describe('parseFrontmatter', () => {
  test('extracts key-value pairs from YAML frontmatter', () => {
    const input = '---\nname: test\ndescription: A test skill\n---\n\n# Body';
    const { meta, body } = parseFrontmatter(input);
    assert.equal(meta.name, 'test');
    assert.equal(meta.description, 'A test skill');
    assert.match(body, /# Body/);
  });

  test('handles arrays in frontmatter', () => {
    const input = '---\ntags: [a, b, c]\n---\nBody';
    const { meta } = parseFrontmatter(input);
    assert.deepEqual(meta.tags, ['a', 'b', 'c']);
  });

  test('returns empty meta when no frontmatter', () => {
    const input = '# Just markdown\n\nNo frontmatter here.';
    const { meta, body } = parseFrontmatter(input);
    assert.deepEqual(meta, {});
    assert.equal(body, input);
  });
});

describe('loadSkill', () => {
  test('loads a skill with SKILL.md', () => {
    const skill = loadSkill('./skills/narada');
    assert.ok(skill, 'skill should be loaded');
    assert.equal(skill.name, 'narada');
    assert.ok(skill.description.length > 0);
  });

  test('returns null for directory without SKILL.md', () => {
    const skill = loadSkill('./tests');
    assert.equal(skill, null);
  });
});

describe('loadAllSkills', () => {
  test('loads all skills from skills directory', () => {
    const skills = loadAllSkills('./skills');
    assert.ok(skills.length >= 5, `Expected >=5 skills, got ${skills.length}`);
    const names = skills.map(s => s.name);
    assert.ok(names.includes('narada'));
    assert.ok(names.includes('vidura'));
  });

  test('returns empty array for nonexistent directory', () => {
    const skills = loadAllSkills('./nonexistent');
    assert.deepEqual(skills, []);
  });
});

describe('validateSkill', () => {
  test('valid skill passes validation', () => {
    const skill = loadSkill('./skills/vidura');
    const result = validateSkill(skill);
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });
});
