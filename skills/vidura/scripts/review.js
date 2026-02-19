/**
 * 🧑‍⚖️ Vidura — Code review and quality analysis.
 * Named after Vidura (विदुर), the wise minister of dharma in the Mahabharata.
 * @module skills/vidura
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/** @typedef {{ file: string, line: number, severity: string, message: string, rule: string }} Issue */

/**
 * Scan a JavaScript file for common issues.
 * @param {string} filePath - Path to JS file
 * @returns {Issue[]} List of issues found
 */
export function reviewFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Console.log left in code (skip CLI, wizard, and standalone scripts)
    if (line.match(/console\.(log|debug)\(/) && !filePath.includes('cli/') && !filePath.includes('wizard/') && !filePath.includes('scripts/')) {
      issues.push({
        file: filePath, line: lineNum, severity: 'warn',
        message: 'console.log in non-CLI code', rule: 'no-debug-logs',
      });
    }

    // TODO comments
    if (line.match(/\/\/\s*TODO/i)) {
      issues.push({ file: filePath, line: lineNum, severity: 'info', message: `TODO: ${line.trim().replace(/.*TODO:?\s*/i, '')}`, rule: 'todo-found' });
    }

    // Hardcoded secrets pattern
    if (line.match(/(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{8,}['"]/i)) {
      issues.push({
        file: filePath, line: lineNum, severity: 'critical',
        message: 'Possible hardcoded secret', rule: 'no-hardcoded-secrets',
      });
    }

    // Very long lines
    if (line.length > 120) {
      issues.push({
        file: filePath, line: lineNum, severity: 'info',
        message: `Line too long (${line.length} chars)`, rule: 'max-line-length',
      });
    }

    // Empty catch blocks
    if (line.match(/catch\s*\([^)]*\)\s*\{\s*\}/)) {
      issues.push({
        file: filePath, line: lineNum, severity: 'warn',
        message: 'Empty catch block — errors silently swallowed',
        rule: 'no-empty-catch',
      });
    }

    // var usage (should use const/let)
    if (line.match(/^\s*var\s/)) {
      issues.push({ file: filePath, line: lineNum, severity: 'warn', message: 'Use const/let instead of var', rule: 'no-var' });
    }

    // == instead of ===
    if (line.match(/[^=!]==[^=]/) && !line.match(/===/) && !line.includes('===/')) {
      issues.push({ file: filePath, line: lineNum, severity: 'warn', message: 'Use === instead of ==', rule: 'eqeqeq' });
    }

    // Missing error handling in async
    if (line.match(/await\s/) && !hasNearbyTryCatch(lines, i)) {
      // Only flag if the function doesn't have try/catch
    }
  }

  // File-level checks
  if (!content.includes('/**') && !content.includes('* @')) {
    issues.push({ file: filePath, line: 1, severity: 'info', message: 'No JSDoc comments found', rule: 'require-jsdoc' });
  }

  // Check for actual require() calls (skip strings and comments)
  const codeLines = lines.filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('*'));
  const hasRequire = codeLines.some(l => /\brequire\s*\(/.test(l) && !/['"`].*require\s*\(/.test(l));
  const hasImport = content.match(/^import\s/m);
  if (hasRequire && hasImport) {
    issues.push({
      file: filePath, line: 1, severity: 'warn',
      message: 'Mixed CJS require() and ESM import',
      rule: 'consistent-modules',
    });
  }

  return issues;
}

/**
 * Check if a line is within a try/catch block.
 * @param {string[]} lines - All lines
 * @param {number} idx - Current line index
 * @returns {boolean}
 */
function hasNearbyTryCatch(lines, idx) {
  const start = Math.max(0, idx - 20);
  const slice = lines.slice(start, idx + 1).join('\n');
  return slice.includes('try {') || slice.includes('try{');
}

/**
 * Recursively find all JS files in a directory.
 * @param {string} dir - Directory to scan
 * @param {string[]} exclude - Patterns to exclude
 * @returns {string[]} File paths
 */
export function findJsFiles(dir, exclude = ['node_modules', '.git', 'package-lock']) {
  const files = [];
  function walk(d) {
    for (const entry of readdirSync(d)) {
      if (exclude.some(e => entry.includes(e))) continue;
      const full = join(d, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (extname(full) === '.js') files.push(full);
    }
  }
  walk(dir);
  return files;
}

/**
 * Review an entire project directory.
 * @param {string} projectDir - Root directory
 * @returns {{ files: number, issues: Issue[], score: number, summary: object }}
 */
export function reviewProject(projectDir) {
  const jsFiles = findJsFiles(projectDir);
  const allIssues = [];

  for (const file of jsFiles) {
    const issues = reviewFile(file);
    allIssues.push(...issues);
  }

  const bySeverity = { critical: 0, warn: 0, info: 0 };
  for (const issue of allIssues) {
    bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1;
  }

  // Score: start at 10, deduct for issues
  let score = 10;
  score -= bySeverity.critical * 2;
  score -= bySeverity.warn * 0.5;
  score -= bySeverity.info * 0.1;
  score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

  return {
    files: jsFiles.length,
    issues: allIssues,
    score,
    summary: bySeverity,
  };
}

export async function execute(context) {
  const { input } = context;
  const result = reviewProject(input || '.');
  return { success: true, skill: 'vidura', ...result };
}

export default { execute, reviewFile, reviewProject, findJsFiles };
