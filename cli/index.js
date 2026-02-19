#!/usr/bin/env node

/**
 * Maya AI CLI - Your AI employee, ready in minutes.
 * @module cli/index
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { init } from '../wizard/init.js';
import { skillsList, skillsInstall, skillsCreate } from './skills.js';
import { agentsList, agentsSpawn } from './agents.js';
import { connect } from './connect.js';

const program = new Command();

program
  .name('maya')
  .description('🪷 Maya AI - Your AI employee, ready in minutes')
  .version('0.1.0');

// ── Setup Wizard ──
program
  .command('init')
  .description('Interactive setup wizard - creates your AI employee')
  .option('--minimal', 'Quick setup with sensible defaults')
  .option('--workspace <path>', 'OpenClaw workspace path')
  .action(init);

// ── Skills ──
const skills = program.command('skills').description('Manage skills');
skills.command('list').description('List available and installed skills').action(skillsList);
skills.command('install <name>').description('Install a skill to workspace').action(skillsInstall);
skills
  .command('create <name>')
  .description('Generate a new skill scaffold')
  .option('-d, --description <desc>', 'Skill description')
  .option('-e, --emoji <emoji>', 'Skill emoji', '🔧')
  .option('-t, --tags <tags>', 'Comma-separated tags')
  .action(skillsCreate);

// ── Agents ──
const agents = program.command('agents').description('Manage agents');
agents.command('list').description('List available agents').action(agentsList);
agents.command('spawn <agent> <task>').description('Spawn an agent with a task').action(agentsSpawn);

// ── Connect ──
program
  .command('connect <service>')
  .description('Set up an integration (telegram, x, github, image-gen)')
  .action(connect);

// ── Status ──
program
  .command('status')
  .description('Show Maya system status')
  .action(async () => {
    const { loadAllSkills } = await import('../lib/skill-loader.js');
    const { loadAllAgents } = await import('../lib/agent-framework.js');
    const { join } = await import('path');

    const skillsDir = join(import.meta.dirname, '..', 'skills');
    const agentsDir = join(import.meta.dirname, '..', 'agents');
    const skills = loadAllSkills(skillsDir);
    const agents = loadAllAgents(agentsDir);

    console.log(chalk.bold('\n🪷 Maya AI v0.1.0\n'));
    console.log(`  Skills: ${chalk.cyan(skills.length)} built-in`);
    console.log(`  Agents: ${chalk.cyan(agents.length)} defined`);
    console.log(`  Node:   ${process.version}`);
    console.log('');
  });

program.parse();
