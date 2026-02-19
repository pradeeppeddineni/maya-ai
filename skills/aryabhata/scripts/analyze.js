/**
 * 📊 Aryabhata — CSV quick analyzer.
 * Usage: node analyze.js <file.csv>
 */
import { readFileSync } from 'fs';

const file = process.argv[2];
if (!file) { console.log('Usage: node analyze.js <file.csv>'); process.exit(1); }

const content = readFileSync(file, 'utf-8');
const lines = content.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

console.log(`\n📊 Aryabhata — Quick Analysis\n`);
console.log(`File: ${file}`);
console.log(`Rows: ${lines.length - 1} | Columns: ${headers.length}`);
console.log(`Headers: ${headers.join(', ')}\n`);

// Parse rows
const rows = lines.slice(1).map(line => {
  const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
  const obj = {};
  headers.forEach((h, i) => obj[h] = vals[i]);
  return obj;
});

// Analyze each column
for (const col of headers) {
  const values = rows.map(r => r[col]).filter(v => v !== '' && v != null);
  const nums = values.map(Number).filter(n => !isNaN(n));

  if (nums.length > values.length * 0.5 && nums.length > 0) {
    // Numeric column
    nums.sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const median = nums[Math.floor(nums.length / 2)];
    const min = nums[0];
    const max = nums[nums.length - 1];
    const missing = rows.length - values.length;
    console.log(`📐 ${col} (numeric): mean=${mean.toFixed(2)}, median=${median}, min=${min}, max=${max}, missing=${missing}`);
  } else {
    // Categorical
    const counts = {};
    for (const v of values) counts[v] = (counts[v] || 0) + 1;
    const unique = Object.keys(counts).length;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const missing = rows.length - values.length;
    console.log(`🏷️  ${col} (categorical): ${unique} unique, top="${top?.[0]}" (${top?.[1]}x), missing=${missing}`);
  }
}
