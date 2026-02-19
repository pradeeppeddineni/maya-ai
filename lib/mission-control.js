/**
 * Mission Control — Multi-agent task coordination system.
 * Agents communicate via a shared task board (JSON files) and
 * workspace files. Inspired by @pbteja1998's Mission Control architecture.
 *
 * Key concepts:
 * - Task Board: JSON-based task lifecycle (Inbox → Done)
 * - WORKING.md: Each agent's current state, read on every wake
 * - @mentions: Tag agents to notify them on next heartbeat
 * - Staggered heartbeats: Agents wake offset to avoid collision
 * - Agent levels: Intern (needs approval) → Specialist → Lead
 *
 * @module lib/mission-control
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/** Task lifecycle states. */
export const TaskStatus = {
  INBOX: 'inbox',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
  BLOCKED: 'blocked',
};

/** Agent autonomy levels. */
export const AgentLevel = {
  INTERN: 'intern',       // Needs human approval for actions
  SPECIALIST: 'specialist', // Independent within their domain
  LEAD: 'lead',           // Full autonomy, can assign to others
};

/**
 * @typedef {object} Task
 * @property {string} id - Unique task ID
 * @property {string} title - Task title
 * @property {string} description - Detailed description
 * @property {string} status - Current status (TaskStatus)
 * @property {string} assignee - Agent name assigned to this task
 * @property {string} createdBy - Who created the task
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 * @property {string} priority - high | medium | low
 * @property {string[]} subscribers - Agents subscribed to updates
 * @property {object[]} comments - Thread of comments/updates
 * @property {string[]} tags - Task tags
 * @property {string} blockedBy - Task ID this is blocked by
 */

/**
 * @typedef {object} AgentConfig
 * @property {string} name - Agent name
 * @property {string} displayName - Display name
 * @property {string} emoji - Agent emoji
 * @property {string} level - AgentLevel
 * @property {string[]} skills - Skill names this agent has
 * @property {number} heartbeatOffsetMin - Minutes offset for stagger
 * @property {string} sessionKey - OpenClaw session key
 */

/**
 * Initialize a Mission Control workspace.
 * Creates the directory structure for multi-agent coordination.
 * @param {string} baseDir - Base directory for the squad workspace
 * @returns {string} Path to the mission control directory
 */
export function initMissionControl(baseDir) {
  const mcDir = join(baseDir, '.mission-control');
  const dirs = [
    mcDir,
    join(mcDir, 'agents'),
    join(mcDir, 'tasks'),
    join(mcDir, 'inbox'),
    join(mcDir, 'standups'),
  ];

  for (const d of dirs) {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  }

  // Initialize task board if not exists
  const boardPath = join(mcDir, 'board.json');
  if (!existsSync(boardPath)) {
    writeFileSync(boardPath, JSON.stringify({
      version: 1,
      created: new Date().toISOString(),
      tasks: [],
      mentions: [],
    }, null, 2));
  }

  // Initialize agent registry
  const registryPath = join(mcDir, 'agents.json');
  if (!existsSync(registryPath)) {
    writeFileSync(registryPath, JSON.stringify({
      agents: [],
      heartbeatInterval: 15,
      staggerOffset: 2,
    }, null, 2));
  }

  return mcDir;
}

/**
 * Load the task board from disk.
 * @param {string} mcDir - Mission control directory
 * @returns {object} Board data
 */
export function loadBoard(mcDir) {
  const boardPath = join(mcDir, 'board.json');
  if (!existsSync(boardPath)) {
    return { version: 1, tasks: [], mentions: [] };
  }
  return JSON.parse(readFileSync(boardPath, 'utf-8'));
}

/**
 * Save the task board to disk.
 * @param {string} mcDir - Mission control directory
 * @param {object} board - Board data
 */
export function saveBoard(mcDir, board) {
  board.updatedAt = new Date().toISOString();
  writeFileSync(
    join(mcDir, 'board.json'),
    JSON.stringify(board, null, 2)
  );
}

/**
 * Create a new task on the board.
 * @param {string} mcDir - Mission control directory
 * @param {object} task - Partial task data
 * @returns {Task} Created task
 */
export function createTask(mcDir, task) {
  const board = loadBoard(mcDir);
  const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const newTask = {
    id,
    title: task.title || 'Untitled',
    description: task.description || '',
    status: TaskStatus.INBOX,
    assignee: task.assignee || null,
    createdBy: task.createdBy || 'human',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: task.priority || 'medium',
    subscribers: [task.createdBy, task.assignee].filter(Boolean),
    comments: [],
    tags: task.tags || [],
    blockedBy: null,
  };

  board.tasks.push(newTask);
  if (newTask.assignee) {
    newTask.status = TaskStatus.ASSIGNED;
  }
  saveBoard(mcDir, board);
  return newTask;
}

/**
 * Update a task's status and add a comment.
 * Auto-subscribes the updater to the task.
 * @param {string} mcDir - Mission control directory
 * @param {string} taskId - Task ID
 * @param {object} update - Fields to update
 * @param {string} updatedBy - Who made the update
 * @returns {Task|null}
 */
export function updateTask(mcDir, taskId, update, updatedBy) {
  const board = loadBoard(mcDir);
  const task = board.tasks.find(t => t.id === taskId);
  if (!task) return null;

  // Apply updates
  for (const [key, val] of Object.entries(update)) {
    if (key === 'comment') {
      task.comments.push({
        by: updatedBy,
        at: new Date().toISOString(),
        text: val,
      });
    } else if (key !== 'id' && key !== 'createdAt') {
      task[key] = val;
    }
  }

  task.updatedAt = new Date().toISOString();

  // Auto-subscribe the updater
  if (updatedBy && !task.subscribers.includes(updatedBy)) {
    task.subscribers.push(updatedBy);
  }

  saveBoard(mcDir, board);
  return task;
}

/**
 * Get tasks filtered by status, assignee, or tags.
 * @param {string} mcDir - Mission control directory
 * @param {object} filter - Filter criteria
 * @returns {Task[]}
 */
export function queryTasks(mcDir, filter = {}) {
  const board = loadBoard(mcDir);
  let tasks = board.tasks;

  if (filter.status) {
    tasks = tasks.filter(t => t.status === filter.status);
  }
  if (filter.assignee) {
    tasks = tasks.filter(t => t.assignee === filter.assignee);
  }
  if (filter.tag) {
    tasks = tasks.filter(t => t.tags.includes(filter.tag));
  }
  if (filter.priority) {
    tasks = tasks.filter(t => t.priority === filter.priority);
  }

  return tasks;
}

/**
 * Send an @mention to an agent. They'll see it on next heartbeat.
 * @param {string} mcDir - Mission control directory
 * @param {string} from - Sender agent name
 * @param {string} to - Target agent name
 * @param {string} message - The mention message
 * @param {string} taskId - Optional related task
 */
export function sendMention(mcDir, from, to, message, taskId = null) {
  const board = loadBoard(mcDir);
  board.mentions = board.mentions || [];
  board.mentions.push({
    id: `mention-${Date.now()}`,
    from,
    to,
    message,
    taskId,
    createdAt: new Date().toISOString(),
    read: false,
  });
  saveBoard(mcDir, board);
}

/**
 * Get unread mentions for an agent and mark them read.
 * @param {string} mcDir - Mission control directory
 * @param {string} agentName - Agent to check
 * @returns {object[]} Unread mentions
 */
export function consumeMentions(mcDir, agentName) {
  const board = loadBoard(mcDir);
  const unread = (board.mentions || [])
    .filter(m => m.to === agentName && !m.read);

  // Mark as read
  for (const m of unread) m.read = true;
  saveBoard(mcDir, board);

  return unread;
}

/**
 * Register an agent in the squad.
 * @param {string} mcDir - Mission control directory
 * @param {AgentConfig} agentConfig
 */
export function registerAgent(mcDir, agentConfig) {
  const regPath = join(mcDir, 'agents.json');
  const registry = JSON.parse(readFileSync(regPath, 'utf-8'));

  // Remove existing entry for this agent
  registry.agents = registry.agents.filter(a => a.name !== agentConfig.name);
  registry.agents.push({
    ...agentConfig,
    registeredAt: new Date().toISOString(),
  });

  // Calculate staggered heartbeat offset
  const idx = registry.agents.findIndex(a => a.name === agentConfig.name);
  agentConfig.heartbeatOffsetMin = idx * (registry.staggerOffset || 2);

  writeFileSync(regPath, JSON.stringify(registry, null, 2));
}

/**
 * Generate WORKING.md for an agent — their current state file.
 * Read first on every wake. Updated constantly.
 * @param {string} mcDir - Mission control directory
 * @param {string} agentName - Agent name
 * @returns {string} WORKING.md content
 */
export function generateWorkingMd(mcDir, agentName) {
  const board = loadBoard(mcDir);
  const myTasks = board.tasks.filter(t => t.assignee === agentName);
  const mentions = (board.mentions || [])
    .filter(m => m.to === agentName && !m.read);

  const inProgress = myTasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const assigned = myTasks.filter(t => t.status === TaskStatus.ASSIGNED);
  const blocked = myTasks.filter(t => t.status === TaskStatus.BLOCKED);
  const review = myTasks.filter(t => t.status === TaskStatus.REVIEW);

  const formatTask = (t) =>
    `- [${t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢'}] **${t.title}** (${t.id})\n  ${t.description.slice(0, 100)}`;

  let md = `# WORKING.md — ${agentName}
*Auto-generated by Mission Control. Last updated: ${new Date().toISOString()}*

`;

  if (mentions.length > 0) {
    md += `## 📢 Unread Mentions (${mentions.length})\n\n`;
    for (const m of mentions) {
      md += `- **@${m.from}**: ${m.message}${m.taskId ? ` (re: ${m.taskId})` : ''}\n`;
    }
    md += '\n';
  }

  if (inProgress.length > 0) {
    md += `## 🔨 In Progress (${inProgress.length})\n\n`;
    md += inProgress.map(formatTask).join('\n') + '\n\n';
  }

  if (assigned.length > 0) {
    md += `## 📋 Assigned to You (${assigned.length})\n\n`;
    md += assigned.map(formatTask).join('\n') + '\n\n';
  }

  if (blocked.length > 0) {
    md += `## 🚧 Blocked (${blocked.length})\n\n`;
    md += blocked.map(formatTask).join('\n') + '\n\n';
  }

  if (review.length > 0) {
    md += `## 👀 In Review (${review.length})\n\n`;
    md += review.map(formatTask).join('\n') + '\n\n';
  }

  if (myTasks.length === 0 && mentions.length === 0) {
    md += `## ✅ All clear!\n\nNo tasks assigned. Check the inbox for unassigned work.\n`;
  }

  return md;
}

/**
 * Generate a daily standup summary for all agents.
 * @param {string} mcDir - Mission control directory
 * @returns {string} Standup markdown
 */
export function generateStandup(mcDir) {
  const board = loadBoard(mcDir);
  const regPath = join(mcDir, 'agents.json');
  const registry = existsSync(regPath)
    ? JSON.parse(readFileSync(regPath, 'utf-8'))
    : { agents: [] };

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = board.tasks.filter(t =>
    t.updatedAt && t.updatedAt.startsWith(today)
  );

  let md = `# 📊 Daily Standup — ${today}\n\n`;

  if (registry.agents.length === 0) {
    md += '*No agents registered yet.*\n';
    return md;
  }

  for (const agent of registry.agents) {
    const agentTasks = board.tasks.filter(t => t.assignee === agent.name);
    const completed = agentTasks.filter(t =>
      t.status === TaskStatus.DONE && t.updatedAt?.startsWith(today)
    );
    const inProgress = agentTasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
    const blocked = agentTasks.filter(t => t.status === TaskStatus.BLOCKED);

    md += `## ${agent.emoji || '🤖'} ${agent.displayName || agent.name}\n`;
    md += `**Level:** ${agent.level || 'specialist'}\n\n`;

    if (completed.length > 0) {
      md += `**Done today:**\n`;
      for (const t of completed) md += `- ✅ ${t.title}\n`;
    }
    if (inProgress.length > 0) {
      md += `**Working on:**\n`;
      for (const t of inProgress) md += `- 🔨 ${t.title}\n`;
    }
    if (blocked.length > 0) {
      md += `**Blocked:**\n`;
      for (const t of blocked) md += `- 🚧 ${t.title} — ${t.comments[t.comments.length - 1]?.text || 'no details'}\n`;
    }
    if (completed.length === 0 && inProgress.length === 0 && blocked.length === 0) {
      md += `*No activity today.*\n`;
    }
    md += '\n';
  }

  // Summary stats
  const allDone = board.tasks.filter(t => t.status === TaskStatus.DONE).length;
  const allOpen = board.tasks.filter(t =>
    t.status !== TaskStatus.DONE
  ).length;
  md += `---\n**Total:** ${allDone} done, ${allOpen} open, ${board.tasks.length} total\n`;

  return md;
}

/**
 * Generate heartbeat config for staggered agent wakeups.
 * @param {string} mcDir - Mission control directory
 * @returns {object[]} Agent heartbeat schedule
 */
export function getHeartbeatSchedule(mcDir) {
  const regPath = join(mcDir, 'agents.json');
  if (!existsSync(regPath)) return [];

  const registry = JSON.parse(readFileSync(regPath, 'utf-8'));
  const interval = registry.heartbeatInterval || 15;
  const offset = registry.staggerOffset || 2;

  return registry.agents.map((agent, idx) => ({
    name: agent.name,
    displayName: agent.displayName,
    emoji: agent.emoji,
    intervalMinutes: interval,
    offsetMinutes: idx * offset,
    cronExpression: `*/${interval} * * * *`,
    note: `Wakes at :${String(idx * offset).padStart(2, '0')} past each ${interval}-min mark`,
  }));
}

export default {
  TaskStatus,
  AgentLevel,
  initMissionControl,
  loadBoard,
  saveBoard,
  createTask,
  updateTask,
  queryTasks,
  sendMention,
  consumeMentions,
  registerAgent,
  generateWorkingMd,
  generateStandup,
  getHeartbeatSchedule,
};
