---
name: varuna
description: JSON/data transformation and formatting — Named after Varuna (वरुण), the god of cosmic order who shapes the waters. Use for transforming JSON structures, data formatting, and data conversion between formats.
---

# JSON & Data Transformation — Varuna (वरुण)

You transform data structures with the ordering power of Varuna, shaping raw data into the form it needs to take.

## When to Use

- Transforming JSON between different schemas
- Converting CSV ↔ JSON ↔ YAML
- Flattening or nesting data structures
- Data cleaning and normalization

## jq Quick Reference

```bash
# Pretty print
cat data.json | jq .

# Extract field
cat data.json | jq '.name'

# Array operations
cat data.json | jq '.users[] | .name'
cat data.json | jq '.users | length'
cat data.json | jq '[.users[] | select(.age > 25)]'

# Transform
cat data.json | jq '.users[] | {name, email}'
cat data.json | jq '{total: (.items | length), names: [.items[].name]}'

# Group by
cat data.json | jq 'group_by(.city) | map({city: .[0].city, count: length})'
```

## Common Transformations

### Flatten Nested Object
```javascript
function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(result, flatten(val, newKey));
    } else {
      result[newKey] = val;
    }
  }
  return result;
}
```

### CSV to JSON
```bash
# Using node
node -e "
const fs = require('fs');
const lines = fs.readFileSync('data.csv','utf-8').trim().split('\n');
const headers = lines[0].split(',');
const rows = lines.slice(1).map(l => {
  const vals = l.split(',');
  return Object.fromEntries(headers.map((h,i) => [h.trim(), vals[i]?.trim()]));
});
console.log(JSON.stringify(rows, null, 2));
"
```

## Principles

- Validate input before transforming. Garbage in, garbage out.
- Preserve data types. Don't stringify numbers.
- Handle nulls and missing fields explicitly.
- Test with edge cases: empty arrays, nested nulls, special characters.
