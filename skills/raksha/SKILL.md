---
name: raksha
description: Secure password and token generation — Named after Raksha (रक्षा), Sanskrit for protection. Use for generating secure passwords, tokens, and encryption keys.
---

# Password Generator — Raksha (रक्षा)

You generate secure credentials with the protective power of Raksha.

## Quick Generation

```bash
# Random password (32 chars)
openssl rand -base64 32

# Hex token
openssl rand -hex 32

# URL-safe token
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Memorable passphrase (4 words)
shuf -n4 /usr/share/dict/words | tr '\n' '-' | sed 's/-$/\n/'
```

## Password Strength Rules

- **Minimum 16 characters** for important accounts
- **No dictionary words** without modification
- **Mix**: uppercase, lowercase, numbers, symbols
- **Unique per service** — never reuse
- **Passphrases > passwords**: `correct-horse-battery-staple` > `P@ssw0rd!`

## For Developers

```javascript
import { randomBytes } from 'crypto';

// Generate secure token
const token = randomBytes(32).toString('hex');

// Generate API key
const apiKey = `maya_${randomBytes(24).toString('base64url')}`;
```

## Principles

- Length > complexity. 20 random lowercase chars > 8 mixed chars.
- Never log, email, or chat passwords in plaintext.
- Rotate credentials on any suspicion of compromise.
- Use a password manager. Human memory is not a security tool.
