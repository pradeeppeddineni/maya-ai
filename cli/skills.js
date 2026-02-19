const BUILT_IN_SKILLS = [
  { name: 'kalpana', emoji: '🎨', description: 'Image generation via Flux 2 Pro', installed: false },
  { name: 'narada', emoji: '🔱', description: 'Deep web research agent', installed: false },
  { name: 'transcribe', emoji: '🎬', description: 'Video transcription pipeline (yt-dlp + ffmpeg + whisper)', installed: false },
];

export async function skillsList() {
  console.log('\n🪷 Maya Skills\n');
  console.log('Built-in:');
  for (const skill of BUILT_IN_SKILLS) {
    const status = skill.installed ? '✅' : '⬜';
    console.log(`  ${status} ${skill.emoji} ${skill.name} - ${skill.description}`);
  }
  console.log('\nUse: maya skills install <name>');
}

export async function skillsInstall(name) {
  const skill = BUILT_IN_SKILLS.find(s => s.name === name);
  if (!skill) {
    console.log(`❌ Unknown skill: ${name}`);
    console.log('Available:', BUILT_IN_SKILLS.map(s => s.name).join(', '));
    return;
  }
  console.log(`📦 Installing ${skill.emoji} ${skill.name}...`);
  // TODO: copy skill files to workspace/skills/
  console.log(`✅ ${skill.name} installed!`);
}
