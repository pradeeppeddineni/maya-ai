---
name: gandharva
description: Advanced text-to-speech with ElevenLabs — Named after Gandharva (गन्धर्व), the celestial musicians who enchant all realms with divine music. Expert-level TTS with voice selection, emotion control, and audio production. Inspired by steipete/sag.
version: 1.0.0
tags: [tts, voice, elevenlabs, audio, speech, narration]
deps: [elevenlabs-api]
---

# Text-to-Speech — Gandharva (गन्धर्व)

You are a master of voice. Like the Gandharvas — celestial musicians whose art moves gods and mortals alike — you transform text into captivating spoken audio.

## When to Use

- Convert text to natural-sounding speech
- Create voice narrations for stories, summaries, or briefings
- Generate audio messages or podcasts
- Use expressive voices for different characters or moods

## Quick Usage

### Via OpenClaw TTS Tool
The built-in `tts` tool handles basic text-to-speech. Use it for simple cases.

### Via sag CLI (ElevenLabs)
```bash
# Install
brew install steipete/tap/sag  # macOS
# or: go install github.com/steipete/sag/cmd/sag@latest

# Speak (streams to speakers)
sag "Hello, this is Maya speaking"
sag -v Roger "With a specific voice"

# Save to file
sag -o /tmp/narration.mp3 "Save this as audio"

# List voices
sag voices --search english --limit 10
sag voices --label accent=british --limit 5
```

### Via ElevenLabs API Directly
```bash
curl -s "https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here",
    "model_id": "eleven_v3",
    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
  }' -o /tmp/speech.mp3
```

## Voice Selection Guide

| Use Case | Voice Style | Settings |
|----------|------------|----------|
| News/briefing | Professional, neutral | stability: 0.7, similarity: 0.8 |
| Storytelling | Expressive, dynamic | stability: 0.3, similarity: 0.6 |
| Character voice | Distinctive, unique | stability: 0.2, style: 0.8 |
| Meditation | Calm, slow | stability: 0.9, speed: 0.8 |
| Comedy | Animated, varied | stability: 0.2, style: 0.9 |

## Model Selection

| Model | ID | Best For |
|-------|-----|----------|
| **v3** (newest) | `eleven_v3` | Most expressive, acting, audio tags |
| **v2** (stable) | `eleven_multilingual_v2` | Reliable, SSML support |
| **v2.5 Flash** | `eleven_flash_v2_5` | Ultra-low latency, 50% cheaper |
| **v2.5 Turbo** | `eleven_turbo_v2_5` | Low latency, 50% cheaper |

## Prompting Tips (v3)

v3 supports audio tags for expressiveness:
- `[whispers]` — whispered delivery
- `[short pause]` — brief silence
- `[laughs]` — laughter
- `[sighs]` — audible sigh
- `[excited]` — upbeat energy

v2/v2.5 supports SSML:
- `<break time="500ms"/>` — timed pause

## Voice Settings Deep Dive

- **stability** (0-1): Lower = more expressive/varied; Higher = more consistent
- **similarity_boost** (0-1): Higher = closer to reference voice
- **style** (0-1): Higher = more stylized (model/voice dependent)
- **speed** (0.5-2.0): Speech rate multiplier
- **speaker_boost**: Toggle clarity enhancement

## Best Practices

1. **Match voice to content**: Don't use a comedy voice for serious news
2. **Chunk long text**: Split at natural paragraph breaks for better pacing
3. **Preview first**: Test voice + settings on a short sample before long runs
4. **Cost awareness**: ~$0.18/1000 chars for v2; v2.5 Flash is 50% cheaper
5. **File format**: MP3 for sharing, WAV for editing, OGG for Telegram
6. **Input limits**: v3: 5K chars, v2: 10K chars, v2.5: 40K chars per request
