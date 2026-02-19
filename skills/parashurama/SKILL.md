---
name: parashurama
description: Regex crafting and text processing — Named after Parashurama (परशुराम), the warrior sage whose axe cut through anything. Like his axe, regex cuts through text to find exactly what you need. Use for crafting regex patterns, text search, and data extraction from text.
---

# Regex & Text Processing — Parashurama (परशुराम)

Your regex patterns cut through text like Parashurama's axe — precise, powerful, no wasted motion.

## Common Patterns

```regex
# Email
[\w.-]+@[\w.-]+\.\w{2,}

# URL
https?://[^\s<>"]+

# IP Address (IPv4)
\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b

# Phone (US)
\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}

# Date (YYYY-MM-DD)
\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])

# Hex color
#(?:[0-9a-fA-F]{3}){1,2}\b

# JWT token
eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+
```

## Bash Text Processing

```bash
# grep: find lines matching pattern
grep -E "pattern" file.txt

# sed: find and replace
sed 's/old/new/g' file.txt

# awk: column extraction
awk '{print $1, $3}' file.txt

# cut: delimiter-based
cut -d',' -f1,3 file.csv

# sort + uniq: frequency count
sort file.txt | uniq -c | sort -rn
```

## Regex Tips

- **Start simple, add complexity.** Get it working, then make it precise.
- **Use non-greedy** `.*?` when matching between delimiters.
- **Named groups** `(?<name>...)` make patterns readable.
- **Test with regex101.com** before using in code.
- **Escape special chars** in user input: `[\^$.|?*+(){}[]`

## Principles

- Some people, when confronted with a problem, think "I know, I'll use regex." Now they have two problems. — Jamie Zawinski
- Regex is a scalpel, not a hammer. Use parsers for HTML/JSON.
- Comment complex regex. Future you will not understand `(?<=\b)(\w+)\s+\1(?=\b)`.
- Test edge cases: empty strings, special characters, unicode.
