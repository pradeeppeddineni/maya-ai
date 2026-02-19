#!/usr/bin/env node

import { Command } from 'commander';
import { init } from '../wizard/init.js';
import { skillsList, skillsInstall } from './skills.js';
import { agentsList, agentsSpawn } from './agents.js';
import { connect } from './connect.js';

const program = new Command();

program
  .name('maya')
  .description('🪷 Maya AI - Your AI employee, ready in minutes')
  .version('0.1.0');

program
  .command('init')
  .description('Interactive setup wizard - creates your AI employee')
  .option('--minimal', 'Quick setup with sensible defaults')
  .option('--workspace <path>', 'OpenClaw workspace path')
  .action(init);

const skills = program.command('skills').description('Manage skills');
skills
  .command('list')
  .description('List available and installed skills')
  .action(skillsList);
skills
  .command('install <name>')
  .description('Install a skill')
  .action(skillsInstall);

const agents = program.command('agents').description('Manage agents');
agents
  .command('list')
  .description('List available agents')
  .action(agentsList);
agents
  .command('spawn <agent> <task>')
  .description('Spawn an agent with a task')
  .action(agentsSpawn);

program
  .command('connect <service>')
  .description('Set up an integration (telegram, x, github, image-gen)')
  .action(connect);

program
  .command('status')
  .description('Show Maya system status')
  .action(async () => {
    console.log('🪷 Maya AI v0.1.0');
    console.log('Status: coming soon...');
  });

program.parse();
