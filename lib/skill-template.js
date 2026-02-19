/**
 * Skill Template Generator - scaffolds new skills.
 * @module lib/skill-template
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Generate a new skill scaffold.
 * @param {object} opts
 * @param {string} opts.name - Skill name (kebab-case)
 * @param {string} opts.description - What the skill does
 * @param {string} opts.emoji - Skill emoji
 * @param {string[]} opts.tags - Category tags
 * @param {string} opts.outputDir - Where to create the skill directory
 * @returns {{ success: boolean, path: string }}
 */
export function generateSkill({ name, description, emoji = '🔧', tags = [], outputDir }) {
  const skillDir = join(outputDir, name);

  if (existsSync(skillDir)) {
    return { success: false, path: skillDir, message: `Skill ${name} already exists` };
  }

  mkdirSync(skillDir, { recursive: true });

  // SKILL.md
  const skillMd = `---
name: ${name}
description: ${description}
version: 1.0.0
emoji: ${emoji}
tags: [${tags.join(', ')}]
author: maya-ai
---

# ${emoji} ${name}

${description}

## Usage

\`\`\`
This skill is used by the AI agent automatically when relevant.
\`\`\`

## Examples

- Example usage will be documented here

## Notes

- Built with Maya AI skill framework
`;

  // index.js
  const indexJs = `/**
 * ${emoji} ${name} - ${description}
 * @module skills/${name}
 */

/**
 * Main entry point for the ${name} skill.
 * @param {object} context - Execution context
 * @param {string} context.input - User input or task description
 * @param {object} context.config - Skill configuration
 * @returns {Promise<object>} Skill output
 */
export async function execute(context) {
  const { input, config = {} } = context;

  // TODO: Implement skill logic
  return {
    success: true,
    output: \`${name} executed with input: \${input}\`,
  };
}

export default { execute };
`;

  writeFileSync(join(skillDir, 'SKILL.md'), skillMd);
  writeFileSync(join(skillDir, 'index.js'), indexJs);

  return { success: true, path: skillDir };
}
