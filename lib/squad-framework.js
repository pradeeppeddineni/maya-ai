/**
 * Squad Framework — Multi-agent coordination system.
 * Inspired by "Mission Control" architecture: agents working as a team,
 * not in isolation. A squad is a group of agents with a coordinator.
 *
 * Architecture:
 * - Squad = Coordinator agent + Specialist agents
 * - Coordinator breaks down tasks, assigns to specialists, merges results
 * - Specialists are independent agents with specific skills
 * - Communication via shared context (files in a squad workspace)
 *
 * @module lib/squad-framework
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { loadAgent, loadAllAgents } from './agent-framework.js';
import { loadAllSkills } from './skill-loader.js';

/**
 * @typedef {object} SquadDef
 * @property {string} name - Squad name
 * @property {string} description - What this squad does
 * @property {string} coordinator - Agent name of the coordinator
 * @property {string[]} members - Agent names of squad members
 * @property {string} strategy - Coordination strategy
 */

/** Coordination strategies for how squads work together. */
export const STRATEGIES = {
  /** Coordinator breaks task into subtasks, assigns in parallel. */
  PARALLEL: 'parallel',
  /** Coordinator chains agents sequentially, output feeds to next. */
  PIPELINE: 'pipeline',
  /** Coordinator sends task to all, picks best result. */
  CONSENSUS: 'consensus',
  /** Coordinator dynamically routes based on task analysis. */
  DYNAMIC: 'dynamic',
};

/**
 * Define a squad configuration.
 * @param {SquadDef} def - Squad definition
 * @returns {object} Validated squad config
 */
export function defineSquad(def) {
  const {
    name,
    description = '',
    coordinator,
    members = [],
    strategy = STRATEGIES.DYNAMIC,
  } = def;

  if (!name) throw new Error('Squad name required');
  if (!coordinator) throw new Error('Squad coordinator required');
  if (members.length === 0) throw new Error('Squad needs at least one member');

  return {
    name,
    description,
    coordinator,
    members,
    strategy,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generate the coordinator prompt for a squad mission.
 * The coordinator is the "mission control" that orchestrates the team.
 * @param {object} squad - Squad config
 * @param {string} mission - The overall task/mission
 * @param {object[]} agentDefs - Loaded agent definitions
 * @param {object[]} skillDefs - Loaded skill definitions
 * @returns {string} Coordinator prompt
 */
export function buildCoordinatorPrompt(squad, mission, agentDefs, skillDefs) {
  const memberInfo = squad.members.map(name => {
    const agent = agentDefs.find(a => a.name === name);
    if (!agent) return `- **${name}**: (not found)`;
    const skills = agent.skills
      .map(s => skillDefs.find(sk => sk.name === s))
      .filter(Boolean)
      .map(s => s.name)
      .join(', ');
    return `- **${agent.emoji} ${agent.displayName}**: ${agent.description}${skills ? ` [skills: ${skills}]` : ''}`;
  }).join('\n');

  const strategyGuide = {
    [STRATEGIES.PARALLEL]: `
Break the mission into independent subtasks. Assign each to the best-suited agent.
All agents work simultaneously. Merge their outputs into a cohesive result.`,
    [STRATEGIES.PIPELINE]: `
Chain the agents in sequence. Each agent's output becomes the next agent's input.
Define the pipeline order based on the mission requirements.`,
    [STRATEGIES.CONSENSUS]: `
Send the same task to multiple agents. Compare their outputs.
Synthesize the best elements from each response.`,
    [STRATEGIES.DYNAMIC]: `
Analyze the mission first. Decide which agents to involve and how.
You may use parallel, pipeline, or consensus as needed.
Route dynamically based on what each step reveals.`,
  };

  return `# Squad Coordinator — ${squad.name}

You are the coordinator of a squad of AI agents. Your job is to orchestrate
their work to accomplish the mission below.

## Your Team

${memberInfo}

## Coordination Strategy: ${squad.strategy}
${strategyGuide[squad.strategy] || strategyGuide[STRATEGIES.DYNAMIC]}

## Communication Protocol

1. **Plan**: Break the mission into clear subtasks
2. **Assign**: Delegate each subtask to the right agent
3. **Monitor**: Track progress via the shared workspace
4. **Merge**: Combine outputs into a final deliverable
5. **Review**: Quality-check the final result

### Shared Workspace
Write plans and results to the squad workspace directory.
Each agent reads from and writes to this shared space.

## Mission

${mission}

## Rules

- You coordinate; you don't do the work yourself (unless no agent fits)
- Be explicit in assignments: what to do, what format, where to put output
- If an agent fails, reassign or adapt the plan
- The final deliverable must be cohesive, not a pile of fragments
`;
}

/**
 * Create a squad workspace directory for a mission.
 * @param {string} baseDir - Base workspace directory
 * @param {string} squadName - Squad name
 * @param {string} mission - Mission description
 * @returns {string} Path to the squad workspace
 */
export function createSquadWorkspace(baseDir, squadName, mission) {
  const timestamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
  const dirName = `squad-${squadName}-${timestamp}`;
  const dir = join(baseDir, dirName);
  mkdirSync(dir, { recursive: true });

  // Write mission brief
  writeFileSync(join(dir, 'MISSION.md'), `# Mission Brief

**Squad:** ${squadName}
**Started:** ${new Date().toISOString()}

## Objective

${mission}

## Status

- [ ] Planning
- [ ] Execution
- [ ] Review
- [ ] Complete
`);

  return dir;
}

/**
 * Built-in squad definitions.
 * These combine agents into functional teams.
 */
export const BUILT_IN_SQUADS = [
  defineSquad({
    name: 'content-team',
    description: 'Full content production pipeline',
    coordinator: 'saraswati',
    members: ['saraswati', 'tumburu', 'kalpana', 'garuda'],
    strategy: STRATEGIES.PIPELINE,
  }),
  defineSquad({
    name: 'security-team',
    description: 'Comprehensive security audit squad',
    coordinator: 'sudarshana',
    members: ['sudarshana', 'vidura', 'kavach'],
    strategy: STRATEGIES.PARALLEL,
  }),
  defineSquad({
    name: 'research-team',
    description: 'Deep research with multiple perspectives',
    coordinator: 'narada',
    members: ['narada', 'garuda', 'aryabhata'],
    strategy: STRATEGIES.DYNAMIC,
  }),
  defineSquad({
    name: 'ship-it',
    description: 'Full dev cycle: code → review → test → deploy',
    coordinator: 'vishwakarma',
    members: ['vishwakarma', 'vidura', 'sudarshana', 'chitragupta'],
    strategy: STRATEGIES.PIPELINE,
  }),
];

export default {
  defineSquad,
  buildCoordinatorPrompt,
  createSquadWorkspace,
  STRATEGIES,
  BUILT_IN_SQUADS,
};
