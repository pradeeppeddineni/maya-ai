---
name: shabdika
description: Voice wake word and local speech recognition — Named after Shabdika (शाब्दिक), Sanskrit for "pertaining to sound/words". Enable "Hey Computer" style voice triggers for your agent, running entirely locally for privacy. Inspired by steipete/brabble.
version: 1.0.0
tags: [voice, wake-word, speech-recognition, local, privacy, trigger]
---

# Voice Wake Word — Shabdika (शाब्दिक)

You enable voice-activated triggers. Like Shabdika — the science of sound and word — you listen for the spoken signal and spring into action, all while keeping everything local and private.

## When to Use

- Set up "Hey Maya" style wake word detection
- Enable voice-triggered commands
- Run local speech recognition for privacy
- Create voice-activated automation hooks

## Architecture

```
Microphone → Local VAD → Wake Word Detection → Command Capture → STT → Agent
```

All processing runs locally. No audio leaves the device unless explicitly transcribed via cloud API.

## Using brabble

```bash
# Install
brew install steipete/tap/brabble  # macOS
# or: go install github.com/steipete/brabble@latest

# Start listening with default wake word
brabble listen

# Custom wake word
brabble listen --wake-word "hey maya"

# With hook (run command after trigger)
brabble listen --hook "curl -X POST localhost:3000/voice-command -d '{\"text\": \"$TEXT\"}'"
```

## DIY Voice Pipeline on Linux

### Step 1: Audio Capture
```bash
# Record from microphone
arecord -f S16_LE -r 16000 -c 1 -t raw /tmp/audio.raw

# Or use ffmpeg
ffmpeg -f alsa -i default -ar 16000 -ac 1 -f s16le /tmp/audio.raw
```

### Step 2: Voice Activity Detection (VAD)
```python
# Using webrtcvad (lightweight, local)
import webrtcvad
vad = webrtcvad.Vad(2)  # Aggressiveness 0-3
# Process 30ms frames of 16kHz audio
is_speech = vad.is_speech(frame, 16000)
```

### Step 3: Wake Word Detection
```python
# Using Porcupine (Picovoice) - works on Pi
import pvporcupine
porcupine = pvporcupine.create(keywords=["computer", "jarvis"])
# Process audio frames
keyword_index = porcupine.process(pcm_frame)
if keyword_index >= 0:
    print("Wake word detected!")
```

### Step 4: Command Transcription
```bash
# Local whisper for the command after wake word
whisper /tmp/command.wav --model base --language en
```

## Trigger Actions

After wake word + command capture:
```bash
# Send to OpenClaw
curl -X POST http://localhost:18789/api/message \
  -H "Content-Type: application/json" \
  -d '{"text": "'"$TRANSCRIBED_TEXT"'"}'

# Or run a local script
case "$COMMAND" in
  *"lights on"*) curl http://homeassistant/api/... ;;
  *"play music"*) mpc play ;;
  *"what time"*) sag "It is $(date +%I:%M %p)" ;;
esac
```

## Privacy Considerations

1. **All local**: Wake word detection runs on-device
2. **No cloud**: Audio never uploaded unless you explicitly use cloud STT
3. **Ephemeral**: Audio buffers are overwritten, not stored
4. **Mute hardware**: Always provide a physical mute switch/button
5. **Indicator**: Show visible/audible indicator when listening

## Hardware Requirements

- Microphone (USB or built-in)
- Raspberry Pi 4/5 or any Linux box
- ~100MB RAM for wake word + VAD
- Optional: speaker for responses
