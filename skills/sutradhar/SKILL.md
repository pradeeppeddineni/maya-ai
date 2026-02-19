---
name: sutradhar
description: MCP (Model Context Protocol) bridge and tool orchestration — Named after Sutradhar (सूत्रधार), the narrator/director in Sanskrit drama who controls the entire performance. Connect to MCP servers, bridge external tools, and orchestrate complex tool chains. Inspired by steipete/mcporter.
version: 1.0.0
tags: [mcp, tools, bridge, orchestration, integration, protocol]
---

# MCP Bridge — Sutradhar (सूत्रधार)

You are the Sutradhar — the master orchestrator who connects all players in the performance. You bridge MCP servers, chain tools, and make external capabilities available seamlessly.

## When to Use

- Connect to MCP (Model Context Protocol) servers
- Bridge external tool servers into your workflow
- Orchestrate multi-tool pipelines
- Integrate third-party AI tool ecosystems

## What is MCP?

Model Context Protocol is a standard for AI tools. MCP servers expose tools via stdio or HTTP that any MCP-compatible client can call. Think of it as a universal plugin system for AI agents.

## Using mcporter

```bash
# Install
npm i -g @steipete/mcporter

# Call an MCP tool as a CLI command
mcporter call oracle ask --prompt "Review this code" --file src/main.ts

# List available tools from an MCP server
mcporter list oracle

# Run as a TypeScript API
import { createMCPClient } from '@steipete/mcporter';
const client = await createMCPClient('oracle');
const result = await client.call('ask', { prompt: '...' });
```

## MCP Configuration

### .mcp.json (Project-level)
```json
{
  "servers": {
    "oracle": {
      "command": "npx",
      "args": ["-y", "@steipete/oracle", "oracle-mcp"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {"BRAVE_API_KEY": "your-key"}
    }
  }
}
```

## Common MCP Servers

| Server | What It Does | Install |
|--------|-------------|---------|
| **filesystem** | Read/write files | `@modelcontextprotocol/server-filesystem` |
| **brave-search** | Web search | `@modelcontextprotocol/server-brave-search` |
| **github** | GitHub API | `@modelcontextprotocol/server-github` |
| **postgres** | Database queries | `@modelcontextprotocol/server-postgres` |
| **memory** | Persistent memory | `@modelcontextprotocol/server-memory` |
| **oracle** | AI second opinion | `@steipete/oracle oracle-mcp` |

## Tool Chaining Patterns

### Sequential Pipeline
```
Tool A output → Transform → Tool B input → Result
```

### Parallel Fan-Out
```
Input → [Tool A, Tool B, Tool C] → Aggregate Results
```

### Conditional Routing
```
Input → Classify → if(type=A) Tool_A else Tool_B → Result
```

## Building Custom MCP Servers

Minimal stdio MCP server in Node.js:
```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({ name: 'my-tool', version: '1.0.0' }, {
  capabilities: { tools: {} }
});

server.setRequestHandler('tools/list', async () => ({
  tools: [{ name: 'greet', description: 'Say hello', inputSchema: {
    type: 'object', properties: { name: { type: 'string' } }
  }}]
}));

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'greet') {
    return { content: [{ type: 'text', text: `Hello ${request.params.arguments.name}!` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Best Practices

1. **Least privilege**: Only enable MCP servers you actually need
2. **Timeout handling**: Set reasonable timeouts for tool calls
3. **Error isolation**: One failing MCP server shouldn't crash others
4. **Logging**: Log all MCP tool calls for debugging
5. **Security**: Don't expose MCP servers to untrusted networks
6. **Cost tracking**: Monitor API usage from MCP tool calls
