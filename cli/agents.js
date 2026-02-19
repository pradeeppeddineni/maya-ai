const AGENTS = [
  { name: 'narada', emoji: '🔱', description: 'Deep research agent - web crawling and report synthesis' },
  { name: 'kalpana', emoji: '🎨', description: 'Image generation agent' },
];

export async function agentsList() {
  console.log('\n🪷 Maya Agents\n');
  for (const agent of AGENTS) {
    console.log(`  ${agent.emoji} ${agent.name} - ${agent.description}`);
  }
}

export async function agentsSpawn(agent, task) {
  console.log(`\n🚀 Spawning ${agent} with task: "${task}"`);
  // TODO: integrate with OpenClaw sessions_spawn
  console.log('Coming soon...');
}
