---
name: dhwani
description: Voice calling and phone automation — Named after Dhwani (ध्वनि), Sanskrit for sound/resonance/voice. Enables AI agents to make and receive phone calls via Twilio + OpenAI Realtime. Inspired by steipete/vox.
version: 1.0.0
tags: [voice, phone, twilio, calls, realtime, telephony]
---

# Voice Calling — Dhwani (ध्वनि)

You enable voice communication for AI agents. Like Dhwani — the primordial sound that carries meaning across space — you bridge the digital and telephonic worlds.

## When to Use

- Make outbound phone calls on behalf of the user
- Set up inbound call handling
- Voice-based customer service automation
- Phone-based reminders or notifications
- Call restaurants, services, businesses

## Architecture

```
Phone (PSTN) ←→ Twilio ←→ WebSocket Bridge ←→ OpenAI Realtime ←→ Agent Tools
```

The bridge handles:
- G.711 μ-law audio passthrough (no resampling needed)
- Barge-in / interrupt handling
- Tool calling back to the local agent
- Call logging and transcription

## Setup

### Requirements
- Node.js >= 20
- Twilio account + phone number
- OpenAI API key (with Realtime access)
- Public HTTPS URL (ngrok for dev)

### Environment
```bash
OPENAI_API_KEY=sk-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
VOX_PUBLIC_BASE_URL=https://your-ngrok-url.ngrok.io
VOX_AGENT_URL=http://localhost:3001/agent  # Optional: your agent endpoint
VOX_INITIAL_GREETING="Hello, this is Maya calling on behalf of Pradeep."
```

### Install vox
```bash
npm i -g @steipete/vox  # or clone and npm i
```

## Making Calls

### Outbound
```bash
# Start the bridge server
vox serve --port 3000

# Dial a number
vox dial +14155550123 --from +14155550999
```

### Inbound
Configure Twilio webhook to `GET https://YOUR_URL/twiml`

### Local Testing (No Twilio)
```bash
vox simulate  # Text-based simulation of voice interaction
```

## Agent Tool Integration

The voice model can call back to your agent during a conversation:

### HTTP Agent
Set `VOX_AGENT_URL` to receive POST requests:
```json
{"id": "call-123", "type": "query", "args": {"question": "What's the user's appointment time?"}}
```

### Subprocess Agent (JSONL)
Set `VOX_AGENT_CMD` for local processing:
```bash
VOX_AGENT_CMD="node my-agent.js"
```

## Voice Call Best Practices

### Before Calling
1. **Confirm with user** before making any call
2. **Prepare context**: Know what to say, what info to gather
3. **Set greeting**: Clear introduction of who's calling and why
4. **Define success**: What outcome are we trying to achieve?

### During Call
- Speak clearly and at moderate pace
- Handle interruptions gracefully (barge-in)
- Confirm important details by repeating them
- Be polite and professional

### After Call
- Log call summary (stored in `VOX_LOG_DIR`)
- Report key outcomes to user
- Follow up on any action items

## Safety & Compliance

⚠️ **Critical**: Follow all applicable laws:
- **Consent**: Many jurisdictions require two-party consent for recording
- **Disclosure**: Disclose that this is an AI-assisted call
- **Do Not Call**: Respect DNC lists
- **Business hours**: Don't call outside reasonable hours
- **Spoofing**: Use legitimate caller IDs only

## Cost Considerations

| Component | Cost |
|-----------|------|
| Twilio phone number | ~$1/month |
| Twilio per-minute | ~$0.013/min outbound |
| OpenAI Realtime | Varies by model |
| ngrok (dev) | Free tier available |
