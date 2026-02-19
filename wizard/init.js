import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export async function init(options) {
  console.log(`
🪷 Welcome to Maya AI Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm going to help you create your AI employee.
This takes about 5 minutes. Let's go.
`);

  const workspace = options.workspace || findWorkspace();
  
  if (!workspace) {
    console.log('❌ Could not find OpenClaw workspace.');
    console.log('Make sure OpenClaw is installed: npm i -g openclaw');
    console.log('Or specify: maya init --workspace /path/to/.openclaw/workspace');
    return;
  }

  console.log(`📁 Workspace: ${workspace}\n`);

  if (options.minimal) {
    await minimalSetup(workspace);
  } else {
    await fullSetup(workspace);
  }
}

function findWorkspace() {
  const home = process.env.HOME || process.env.USERPROFILE;
  const defaultPath = join(home, '.openclaw', 'workspace');
  if (existsSync(defaultPath)) return defaultPath;
  return null;
}

async function minimalSetup(workspace) {
  console.log('⚡ Minimal setup - using sensible defaults\n');
  
  const templates = [
    'SOUL.md', 'IDENTITY.md', 'USER.md', 
    'TOOLS.md', 'MEMORY.md', 'AGENTS.md', 'HEARTBEAT.md'
  ];

  const templateDir = join(import.meta.dirname, '..', 'templates');
  
  for (const file of templates) {
    const dest = join(workspace, file);
    if (existsSync(dest)) {
      console.log(`  ⏭️  ${file} already exists, skipping`);
      continue;
    }
    const src = join(templateDir, file);
    if (existsSync(src)) {
      const content = readFileSync(src, 'utf-8');
      writeFileSync(dest, content);
      console.log(`  ✅ Created ${file}`);
    }
  }

  // Create memory directory
  const memDir = join(workspace, 'memory');
  if (!existsSync(memDir)) {
    mkdirSync(memDir, { recursive: true });
    console.log('  ✅ Created memory/');
  }

  // Create skills directory
  const skillsDir = join(workspace, 'skills');
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
    console.log('  ✅ Created skills/');
  }

  console.log('\n🪷 Done! Your AI employee is ready.');
  console.log('Start OpenClaw and say hello.\n');
}

async function fullSetup(workspace) {
  // TODO: interactive inquirer-based interview
  // Ask about personality, name, role, preferences, integrations
  console.log('🎤 Full interactive setup coming soon...');
  console.log('For now, use: maya init --minimal\n');
  await minimalSetup(workspace);
}
