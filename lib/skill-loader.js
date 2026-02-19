/**
 * Skill Loader - reads SKILL.md frontmatter and loads skill definitions.
 * @module lib/skill-loader
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

/**
 * Parse YAML-like frontmatter from a SKILL.md file.
 * Expects --- delimiters around key: value pairs.
 * @param {string} content - Raw markdown content
 * @returns {{ meta: object, body: string }}
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // Handle arrays: [item1, item2]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim());
    }
    meta[key] = val;
  }
  return { meta, body: match[2] };
}

/**
 * Load a single skill from its directory.
 * @param {string} skillDir - Path to the skill directory
 * @returns {object|null} Skill definition or null if invalid
 */
export function loadSkill(skillDir) {
  const skillMd = join(skillDir, 'SKILL.md');
  if (!existsSync(skillMd)) return null;

  const content = readFileSync(skillMd, 'utf-8');
  const { meta, body } = parseFrontmatter(content);

  if (!meta.name) {
    meta.name = basename(skillDir);
  }

  return {
    name: meta.name,
    description: meta.description || '',
    version: meta.version || '1.0.0',
    author: meta.author || 'unknown',
    emoji: meta.emoji || '🔧',
    tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
    deps: Array.isArray(meta.deps) ? meta.deps : (meta.deps ? [meta.deps] : []),
    dir: skillDir,
    body,
    meta,
  };
}

/**
 * Load all skills from a directory (each subdirectory is a skill).
 * @param {string} skillsDir - Path to the skills root directory
 * @returns {object[]} Array of loaded skill definitions
 */
export function loadAllSkills(skillsDir) {
  if (!existsSync(skillsDir)) return [];

  const skills = [];
  for (const entry of readdirSync(skillsDir)) {
    const fullPath = join(skillsDir, entry);
    if (!statSync(fullPath).isDirectory()) continue;
    const skill = loadSkill(fullPath);
    if (skill) skills.push(skill);
  }
  return skills;
}

/**
 * Validate a skill has all required fields and dependencies.
 * @param {object} skill - Loaded skill object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSkill(skill) {
  const errors = [];
  if (!skill.name) errors.push('Missing name');
  if (!skill.description) errors.push('Missing description');
  if (!existsSync(join(skill.dir, 'SKILL.md'))) errors.push('Missing SKILL.md');

  // skills.sh format: SKILL.md is sufficient. Scripts are optional.
  // Check for scripts/ dir or implementation files as bonus.
  const files = readdirSync(skill.dir);
  const hasScripts = files.includes('scripts');
  const hasImpl = files.some(f => f.endsWith('.js') || f.endsWith('.py') || f.endsWith('.sh'));
  // No error — SKILL.md alone is valid in skills.sh ecosystem

  return { valid: errors.length === 0, errors };
}
