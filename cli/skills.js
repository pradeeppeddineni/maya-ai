/**
 * CLI skill management commands.
 * @module cli/skills
 */
import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { loadAllSkills, validateSkill } from '../lib/skill-loader.js';
import { installSkill, listInstalled } from '../lib/skill-installer.js';
import { generateSkill } from '../lib/skill-template.js';

const MAYA_SKILLS_DIR = join(import.meta.dirname, '..', 'skills');

function getWorkspaceSkillsDir() {
  const home = process.env.HOME || process.env.USERPROFILE;
  return join(home, '.openclaw', 'workspace', 'skills');
}

/** List all available and installed skills. */
export async function skillsList() {
  const builtIn = loadAllSkills(MAYA_SKILLS_DIR);
  const installed = listInstalled(getWorkspaceSkillsDir());
  const installedNames = new Set(installed.map(s => s.name));

  console.log(chalk.bold('\n🪷 Maya Skills\n'));

  if (builtIn.length > 0) {
    console.log(chalk.cyan('Built-in:'));
    for (const skill of builtIn) {
      const status = installedNames.has(skill.name) ? '✅' : '⬜';
      console.log(`  ${status} ${skill.emoji} ${chalk.bold(skill.name)} — ${skill.description}`);
    }
  }

  console.log(chalk.dim(`\n${builtIn.length} built-in, ${installed.length} installed`));
  console.log(chalk.dim('Use: maya skills install <name> | maya skills create <name>\n'));
}

/** Install a built-in skill to the workspace. */
export async function skillsInstall(name) {
  const sourceDir = join(MAYA_SKILLS_DIR, name);
  if (!existsSync(sourceDir)) {
    console.log(chalk.red(`❌ Unknown skill: ${name}`));
    const builtIn = loadAllSkills(MAYA_SKILLS_DIR);
    console.log('Available:', builtIn.map(s => s.name).join(', '));
    return;
  }

  const result = installSkill(sourceDir, getWorkspaceSkillsDir());
  if (result.success) {
    console.log(chalk.green(`✅ ${result.message}`));
  } else {
    console.log(chalk.red(`❌ ${result.message}`));
  }
}

/** Create a new skill from template. */
export async function skillsCreate(name, options = {}) {
  const result = generateSkill({
    name,
    description: options.description || `${name} skill`,
    emoji: options.emoji || '🔧',
    tags: options.tags ? options.tags.split(',') : [],
    outputDir: MAYA_SKILLS_DIR,
  });

  if (result.success) {
    console.log(chalk.green(`✅ Created skill scaffold at ${result.path}`));
    console.log(chalk.dim('Edit SKILL.md and index.js to implement your skill.'));
  } else {
    console.log(chalk.red(`❌ ${result.message}`));
  }
}
