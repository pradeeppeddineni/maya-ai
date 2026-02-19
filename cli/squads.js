/**
 * CLI squad and mission control commands.
 * @module cli/squads
 */
import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import {
  initMissionControl,
  registerAgent,
  createTask,
  updateTask,
  queryTasks,
  generateStandup,
  getHeartbeatSchedule,
  generateWorkingMd,
  TaskStatus,
  AgentLevel,
} from '../lib/mission-control.js';
import { BUILT_IN_SQUADS } from '../lib/squad-framework.js';
import { loadAllAgents } from '../lib/agent-framework.js';

function getMcDir(workspace) {
  const home = process.env.HOME || process.env.USERPROFILE;
  const ws = workspace || join(home, '.openclaw', 'workspace');
  return join(ws, '.mission-control');
}

/** Initialize a squad workspace. */
export async function squadInit(options = {}) {
  const home = process.env.HOME || process.env.USERPROFILE;
  const ws = options.workspace || join(home, '.openclaw', 'workspace');

  console.log(chalk.bold('\n🎯 Initializing Mission Control\n'));
  const mcDir = initMissionControl(ws);
  console.log(chalk.green(`✅ Mission Control initialized at ${mcDir}`));
  console.log(chalk.dim('Register agents with: maya squad register <agent>'));
  console.log('');
}

/** Register an agent in the squad. */
export async function squadRegister(agentName, options = {}) {
  const mcDir = getMcDir(options.workspace);
  const agentsDir = join(import.meta.dirname, '..', 'agents');
  const agents = loadAllAgents(agentsDir);
  const agent = agents.find(a => a.name === agentName);

  const config = {
    name: agentName,
    displayName: agent?.displayName || agentName,
    emoji: agent?.emoji || '🤖',
    level: options.level || AgentLevel.SPECIALIST,
    skills: agent?.skills || [],
  };

  registerAgent(mcDir, config);
  console.log(chalk.green(`✅ Registered ${config.emoji} ${config.displayName} (${config.level})`));
}

/** Show squad status. */
export async function squadStatus(options = {}) {
  const mcDir = getMcDir(options.workspace);

  if (!existsSync(mcDir)) {
    console.log(chalk.red('❌ Mission Control not initialized. Run: maya squad init'));
    return;
  }

  const schedule = getHeartbeatSchedule(mcDir);
  const tasks = queryTasks(mcDir);

  const byStatus = {};
  for (const t of tasks) {
    byStatus[t.status] = (byStatus[t.status] || 0) + 1;
  }

  console.log(chalk.bold('\n🎯 Mission Control Status\n'));

  if (schedule.length > 0) {
    console.log(chalk.cyan('Agents:'));
    for (const s of schedule) {
      console.log(`  ${s.emoji} ${chalk.bold(s.displayName)} — heartbeat every ${s.intervalMinutes}min (offset +${s.offsetMinutes}min)`);
    }
  } else {
    console.log(chalk.dim('  No agents registered.'));
  }

  console.log(chalk.cyan('\nTask Board:'));
  if (tasks.length === 0) {
    console.log(chalk.dim('  No tasks.'));
  } else {
    for (const [status, count] of Object.entries(byStatus)) {
      const icon = status === 'done' ? '✅' : status === 'blocked' ? '🚧'
        : status === 'in_progress' ? '🔨' : status === 'review' ? '👀' : '📋';
      console.log(`  ${icon} ${status}: ${count}`);
    }
  }
  console.log('');
}

/** Create a task on the board. */
export async function squadTask(title, options = {}) {
  const mcDir = getMcDir(options.workspace);
  const task = createTask(mcDir, {
    title,
    description: options.description || '',
    assignee: options.assignee || null,
    priority: options.priority || 'medium',
    createdBy: options.from || 'human',
    tags: options.tags ? options.tags.split(',') : [],
  });

  console.log(chalk.green(`✅ Task created: ${task.id}`));
  if (task.assignee) {
    console.log(chalk.dim(`   Assigned to: ${task.assignee}`));
  }
}

/** Show daily standup. */
export async function squadStandup(options = {}) {
  const mcDir = getMcDir(options.workspace);
  console.log(generateStandup(mcDir));
}

/** Show an agent's WORKING.md. */
export async function squadWorking(agentName, options = {}) {
  const mcDir = getMcDir(options.workspace);
  console.log(generateWorkingMd(mcDir, agentName));
}

/** List built-in squad templates. */
export async function squadList() {
  console.log(chalk.bold('\n🎯 Squad Templates\n'));
  for (const squad of BUILT_IN_SQUADS) {
    console.log(`  🎯 ${chalk.bold(squad.name)} — ${squad.description}`);
    console.log(chalk.dim(`     Strategy: ${squad.strategy} | Members: ${squad.members.join(', ')}\n`));
  }
}
