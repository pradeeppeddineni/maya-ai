/**
 * Integration connection setup commands.
 * @module cli/connect
 */
import chalk from 'chalk';

const SERVICES = {
  telegram: { name: 'Telegram', emoji: '📱', envKey: 'TELEGRAM_BOT_TOKEN' },
  x: { name: 'X / Twitter', emoji: '🐦', envKey: 'X_BEARER_TOKEN' },
  github: { name: 'GitHub', emoji: '🐙', envKey: 'GITHUB_TOKEN' },
  'image-gen': { name: 'Image Generation', emoji: '🎨', envKey: 'AZURE_FLUX_API_KEY' },
  email: { name: 'Email (SMTP)', emoji: '📧', envKey: 'SMTP_HOST' },
  slack: { name: 'Slack', emoji: '💬', envKey: 'SLACK_TOKEN' },
  discord: { name: 'Discord', emoji: '🎮', envKey: 'DISCORD_TOKEN' },
};

/**
 * Set up a service integration interactively.
 * @param {string} service - Service name to connect
 */
export async function connect(service) {
  const svc = SERVICES[service];
  if (!svc) {
    console.log(chalk.red(`❌ Unknown service: ${service}`));
    console.log('Available:', Object.keys(SERVICES).join(', '));
    return;
  }

  console.log(chalk.bold(`\n🔌 Connect ${svc.emoji} ${svc.name}\n`));
  console.log(`Set ${chalk.cyan(svc.envKey)} in your ~/.openclaw/.env file.`);
  console.log(chalk.dim('\nSee docs for setup instructions.\n'));
}
