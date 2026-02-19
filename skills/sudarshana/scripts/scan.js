/**
 * 🛡️ Sudarshana — Automated security scanner for JS projects.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const PATTERNS = [
  { pattern: /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{8,}['"]/i, severity: 'critical', rule: 'hardcoded-secret', message: 'Hardcoded secret detected' },
  { pattern: /eval\s*\(/, severity: 'high', rule: 'no-eval', message: 'eval() usage — potential code injection' },
  { pattern: /exec\s*\(\s*[`'"].*\$\{/, severity: 'high', rule: 'command-injection', message: 'Template literal in exec() — command injection risk' },
  { pattern: /innerHTML\s*=/, severity: 'high', rule: 'xss-innerhtml', message: 'innerHTML assignment — XSS risk' },
  { pattern: /document\.write\s*\(/, severity: 'high', rule: 'xss-docwrite', message: 'document.write() — XSS risk' },
  { pattern: /Math\.random\(\)/, severity: 'medium', rule: 'weak-random', message: 'Math.random() for security — use crypto.randomBytes' },
  { pattern: /createHash\s*\(\s*['"]md5['"]/, severity: 'medium', rule: 'weak-hash', message: 'MD5 hash — use SHA-256 or bcrypt' },
  { pattern: /createHash\s*\(\s*['"]sha1['"]/, severity: 'medium', rule: 'weak-hash', message: 'SHA1 hash — use SHA-256 or bcrypt' },
  { pattern: /cors\(\s*\)/, severity: 'medium', rule: 'cors-open', message: 'CORS with no options — allows all origins' },
  { pattern: /disable.*csrf|csrf.*false/i, severity: 'high', rule: 'csrf-disabled', message: 'CSRF protection may be disabled' },
  { pattern: /\.env['"]?\s*\)/, severity: 'info', rule: 'env-file-ref', message: 'Direct .env file reference' },
  { pattern: /console\.(log|debug)\(.*(?:key|token|secret|password)/i, severity: 'high', rule: 'log-secrets', message: 'Possible secret logged to console' },
];

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comments and regex pattern definitions
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (trimmed.includes('pattern:') || trimmed.includes('RegExp')) continue;

    for (const { pattern, severity, rule, message } of PATTERNS) {
      if (pattern.test(line)) {
        findings.push({ file: filePath, line: i + 1, severity, rule, message });
      }
    }
  }
  return findings;
}

function walkJs(dir, exclude = ['node_modules', '.git']) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (exclude.some(e => entry.includes(e))) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walkJs(full, exclude));
    else if (['.js', '.mjs', '.ts', '.jsx', '.tsx'].includes(extname(full))) files.push(full);
  }
  return files;
}

const dir = process.argv[2] || '.';
const files = walkJs(dir);
const allFindings = files.flatMap(f => scanFile(f));

const bySev = { critical: 0, high: 0, medium: 0, info: 0 };
for (const f of allFindings) bySev[f.severity]++;

console.log(`\n🛡️ Sudarshana Security Scan\n`);
console.log(`Files: ${files.length} | Findings: ${allFindings.length}`);
console.log(`Critical: ${bySev.critical} | High: ${bySev.high} | Medium: ${bySev.medium} | Info: ${bySev.info}\n`);

for (const f of allFindings) {
  const icon = f.severity === 'critical' ? '🔴' : f.severity === 'high' ? '🟠' : f.severity === 'medium' ? '🟡' : '🔵';
  console.log(`${icon} [${f.severity}] ${f.file}:${f.line} — ${f.message} (${f.rule})`);
}

if (allFindings.length === 0) console.log('✅ No security issues found.');
