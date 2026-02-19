/**
 * Skill Template Generator — scaffolds skills.sh-compatible skills.
 * @module lib/skill-template
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Generate a new skill scaffold (skills.sh compatible).
 * @param {object} opts
 * @param {string} opts.name - Skill name (kebab-case)
 * @param {string} opts.description - What the skill does
 * @param {string} opts.emoji - Skill emoji
 * @param {string[]} opts.tags - Category tags
 * @param {string} opts.outputDir - Where to create the skill
 * @returns {{ success: boolean, path: string }}
 */
export function generateSkill({ name, description, emoji = '🔧', tags = [], outputDir }) {
  const skillDir = join(outputDir, name);

  if (existsSync(skillDir)) {
    return { success: false, path: skillDir, message: `Skill ${name} already exists` };
  }

  mkdirSync(skillDir, { recursive: true });

  const skillMd = `---
name: ${name}
description: ${description}
---

# ${emoji} ${name}

${description}

## When to Use

- Describe when this skill should activate

## Process

### Step 1
...

### Step 2
...

## Principles

- Key principle 1
- Key principle 2
`;

  writeFileSync(join(skillDir, 'SKILL.md'), skillMd);
  return { success: true, path: skillDir };
}
