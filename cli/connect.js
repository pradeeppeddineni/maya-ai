const SERVICES = {
  telegram: { emoji: '📱', name: 'Telegram' },
  x: { emoji: '🐦', name: 'X (Twitter)' },
  github: { emoji: '🔗', name: 'GitHub' },
  'image-gen': { emoji: '🎨', name: 'Image Generation (Flux 2 Pro)' },
};

export async function connect(service) {
  const svc = SERVICES[service];
  if (!svc) {
    console.log(`❌ Unknown service: ${service}`);
    console.log('Available:', Object.keys(SERVICES).join(', '));
    return;
  }
  console.log(`\n${svc.emoji} Setting up ${svc.name}...\n`);
  // TODO: interactive setup for each service
  console.log('Interactive setup coming soon...');
}
