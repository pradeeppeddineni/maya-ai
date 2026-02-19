/**
 * Agent Framework - define, spawn, and manage specialized AI agents.
 * Agents are personas that combine skills with a specific SOUL prompt.
 * @module lib/agent-framework
 */
import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { parseFrontmatter } from './skill-loader.js';

/**
 * @typedef {object} AgentDef
 * @property {string} name - Agent name (kebab-case)
 * @property {string} displayName - Human-readable name
 * @property {string} emoji - Agent emoji
 * @property {string} description - What this agent does
 * @property {string[]} skills - Skills this agent has access to
 * @property {string} soul - SOUL prompt for the agent's personality
 * @property {string} model - Preferred model (optional)
 */

/**
 * Load an agent definition from its directory.
 * Expects AGENT.md with frontmatter + soul prompt in body.
 * @param {string} agentDir - Path to agent directory
 * @returns {AgentDef|null}
 */
export function loadAgent(agentDir) {
  const agentMd = join(agentDir, 'AGENT.md');
  if (!existsSync(agentMd)) return null;

  const content = readFileSync(agentMd, 'utf-8');
  const { meta, body } = parseFrontmatter(content);

  return {
    name: meta.name || '',
    displayName: meta.displayName || meta.name || '',
    emoji: meta.emoji || '🤖',
    description: meta.description || '',
    skills: Array.isArray(meta.skills) ? meta.skills : (meta.skills ? [meta.skills] : []),
    model: meta.model || '',
    soul: body.trim(),
    dir: agentDir,
  };
}

/**
 * Load all agent definitions from a directory.
 * @param {string} agentsDir - Path to agents root directory
 * @returns {AgentDef[]}
 */
export function loadAllAgents(agentsDir) {
  if (!existsSync(agentsDir)) return [];

  const agents = [];
  for (const entry of readdirSync(agentsDir)) {
    const full = join(agentsDir, entry);
    try {
      const agent = loadAgent(full);
      if (agent) agents.push(agent);
    } catch {
      // skip invalid
    }
  }
  return agents;
}

/**
 * Generate a spawn instruction for an agent + task.
 * This creates the prompt that OpenClaw sessions_spawn would use.
 * @param {AgentDef} agent - Agent definition
 * @param {string} task - Task to assign
 * @param {object[]} skillDocs - Loaded skill docs for context
 * @returns {string} Complete spawn prompt
 */
export function buildSpawnPrompt(agent, task, skillDocs = []) {
  const skillContext = skillDocs.length > 0
    ? `\n## Available Skills\n${skillDocs.map(s => `- **${s.name}**: ${s.description}`).join('\n')}\n`
    : '';

  return `${agent.soul}
${skillContext}
## Your Task

${task}

Complete this task thoroughly. Be proactive and creative.
`;
}

/**
 * Generate a new agent scaffold.
 * @param {object} opts
 * @param {string} opts.name - Agent name
 * @param {string} opts.displayName - Display name
 * @param {string} opts.emoji - Agent emoji
 * @param {string} opts.description - What this agent does
 * @param {string[]} opts.skills - Skills the agent uses
 * @param {string} opts.soul - Soul prompt
 * @param {string} opts.outputDir - Where to create the agent
 * @returns {{ success: boolean, path: string }}
 */
export function generateAgent({ name, displayName, emoji, description, skills, soul, outputDir }) {
  const agentDir = join(outputDir, name);
  mkdirSync(agentDir, { recursive: true });

  const content = `---
name: ${name}
displayName: ${displayName || name}
emoji: ${emoji || '🤖'}
description: ${description}
skills: [${skills.join(', ')}]
---

${soul || `You are ${displayName || name}. ${description}\n\nBe thorough, proactive, and creative.`}
`;

  writeFileSync(join(agentDir, 'AGENT.md'), content);
  return { success: true, path: agentDir };
}
