/**
 * Skill Installer - copies skills to workspace and manages installations.
 * @module lib/skill-installer
 */
import { existsSync, mkdirSync, cpSync, rmSync, readdirSync } from 'fs';
import { join } from 'path';
import { loadSkill, validateSkill } from './skill-loader.js';

/**
 * Install a skill from source directory to target workspace.
 * @param {string} sourceDir - Path to skill source
 * @param {string} workspaceSkillsDir - Path to workspace/skills/
 * @returns {{ success: boolean, message: string }}
 */
export function installSkill(sourceDir, workspaceSkillsDir) {
  const skill = loadSkill(sourceDir);
  if (!skill) {
    return { success: false, message: `No valid SKILL.md found in ${sourceDir}` };
  }

  const validation = validateSkill(skill);
  if (!validation.valid) {
    return { success: false, message: `Validation failed: ${validation.errors.join(', ')}` };
  }

  const destDir = join(workspaceSkillsDir, skill.name);
  if (!existsSync(workspaceSkillsDir)) {
    mkdirSync(workspaceSkillsDir, { recursive: true });
  }

  cpSync(sourceDir, destDir, { recursive: true });
  return { success: true, message: `Installed ${skill.name} to ${destDir}` };
}

/**
 * Uninstall a skill by removing its directory.
 * @param {string} skillName - Name of the skill
 * @param {string} workspaceSkillsDir - Path to workspace/skills/
 * @returns {{ success: boolean, message: string }}
 */
export function uninstallSkill(skillName, workspaceSkillsDir) {
  const skillDir = join(workspaceSkillsDir, skillName);
  if (!existsSync(skillDir)) {
    return { success: false, message: `Skill ${skillName} not found` };
  }
  rmSync(skillDir, { recursive: true });
  return { success: true, message: `Uninstalled ${skillName}` };
}

/**
 * List installed skills with their metadata.
 * @param {string} workspaceSkillsDir - Path to workspace/skills/
 * @returns {object[]} Array of installed skill info
 */
export function listInstalled(workspaceSkillsDir) {
  if (!existsSync(workspaceSkillsDir)) return [];

  const skills = [];
  for (const entry of readdirSync(workspaceSkillsDir)) {
    const dir = join(workspaceSkillsDir, entry);
    const skill = loadSkill(dir);
    if (skill) skills.push(skill);
  }
  return skills;
}
