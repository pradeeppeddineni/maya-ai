/**
 * CLI agent management commands.
 * @module cli/agents
 */
import { join } from 'path';
import chalk from 'chalk';
import { loadAllAgents, buildSpawnPrompt } from '../lib/agent-framework.js';
import { loadAllSkills } from '../lib/skill-loader.js';

const MAYA_AGENTS_DIR = join(import.meta.dirname, '..', 'agents');
const MAYA_SKILLS_DIR = join(import.meta.dirname, '..', 'skills');

/** List all available agents. */
export async function agentsList() {
  const agents = loadAllAgents(MAYA_AGENTS_DIR);

  console.log(chalk.bold('\n🪷 Maya Agents\n'));

  if (agents.length === 0) {
    console.log(chalk.dim('  No agents defined yet.'));
  } else {
    for (const agent of agents) {
      const skillList = agent.skills.length > 0 ? chalk.dim(` [${agent.skills.join(', ')}]`) : '';
      console.log(`  ${agent.emoji} ${chalk.bold(agent.displayName || agent.name)} — ${agent.description}${skillList}`);
    }
  }

  console.log(chalk.dim(`\n${agents.length} agents available`));
  console.log(chalk.dim('Use: maya agents spawn <agent> "<task>"\n'));
}

/** Spawn an agent with a task. */
export async function agentsSpawn(agentName, task) {
  const agents = loadAllAgents(MAYA_AGENTS_DIR);
  const agent = agents.find(a => a.name === agentName);

  if (!agent) {
    console.log(chalk.red(`❌ Unknown agent: ${agentName}`));
    console.log('Available:', agents.map(a => a.name).join(', ') || 'none');
    return;
  }

  const allSkills = loadAllSkills(MAYA_SKILLS_DIR);
  const relevantSkills = allSkills.filter(s => agent.skills.includes(s.name));
  const prompt = buildSpawnPrompt(agent, task, relevantSkills);

  console.log(chalk.cyan(`\n🚀 Spawning ${agent.emoji} ${agent.displayName}...\n`));
  console.log(chalk.dim('Prompt generated for OpenClaw sessions_spawn:'));
  console.log(chalk.dim('─'.repeat(50)));
  console.log(prompt.slice(0, 500) + (prompt.length > 500 ? '...' : ''));
  console.log(chalk.dim('─'.repeat(50)));
}
