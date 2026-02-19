/**
 * 🛡️ Kavach — Secret scanner for code repositories.
 * Usage: node scan-secrets.js <directory>
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';

const PATTERNS = [
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/, severity: 'critical' },
  { name: 'GitHub Token', pattern: /gh[ps]_[a-zA-Z0-9]{36,}/, severity: 'critical' },
  { name: 'Private Key', pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/, severity: 'critical' },
  { name: 'Generic Secret', pattern: /(api[_-]?key|secret[_-]?key|auth[_-]?token)\s*[:=]\s*['"][A-Za-z0-9+/=]{16,}['"]/i, severity: 'high' },
  { name: 'Password in URL', pattern: /https?:\/\/[^:]+:[^@]+@/, severity: 'high' },
  { name: 'JWT Token', pattern: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}/, severity: 'high' },
  { name: 'Slack Token', pattern: /xox[bpors]-[0-9a-zA-Z-]+/, severity: 'critical' },
  { name: 'Hardcoded Password', pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/i, severity: 'high' },
  { name: 'Connection String', pattern: /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, severity: 'critical' },
  { name: 'Base64 Key (long)', pattern: /[A-Za-z0-9+/]{40,}={0,2}/, severity: 'low' },
];

const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', '__pycache__'];
const SKIP_EXTS = ['.png', '.jpg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.lock'];
const SENSITIVE_FILES = ['.env', '.env.local', '.env.prod', '.env.staging'];

function walkFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.includes(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) files.push(...walkFiles(full));
    else if (!SKIP_EXTS.includes(extname(full)) && stat.size < 500_000) files.push(full);
  }
  return files;
}

const dir = process.argv[2] || '.';
const files = walkFiles(dir);
const findings = [];

for (const file of files) {
  // Check for sensitive files that shouldn't be committed
  const basename = file.split('/').pop();
  if (SENSITIVE_FILES.includes(basename)) {
    findings.push({ file, line: 0, severity: 'critical', type: `Sensitive file committed: ${basename}` });
  }

  let content;
  try { content = readFileSync(file, 'utf-8'); } catch { continue; }
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('*')) continue;
    // Skip pattern definition lines (self-referential)
    if (line.includes('pattern:') || line.includes('RegExp') || line.includes('PATTERNS')) continue;

    for (const { name, pattern, severity } of PATTERNS) {
      if (severity === 'low') continue; // Skip noisy patterns by default
      if (pattern.test(line)) {
        findings.push({ file, line: i + 1, severity, type: name });
      }
    }
  }
}

// Check .gitignore
const gitignorePath = join(dir, '.gitignore');
if (existsSync(gitignorePath)) {
  const gi = readFileSync(gitignorePath, 'utf-8');
  if (!gi.includes('.env')) {
    findings.push({ file: '.gitignore', line: 0, severity: 'high', type: '.env not in .gitignore' });
  }
}

console.log('\n🛡️ Kavach — Secret Scan\n');
console.log(`Scanned: ${files.length} files`);
console.log(`Findings: ${findings.length}\n`);

for (const f of findings) {
  const icon = f.severity === 'critical' ? '🔴' : f.severity === 'high' ? '🟠' : '🟡';
  console.log(`${icon} [${f.severity}] ${f.file}${f.line ? ':' + f.line : ''} — ${f.type}`);
}

if (findings.length === 0) console.log('✅ No secrets found. Clean!');
