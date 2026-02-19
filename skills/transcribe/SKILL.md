---
name: shabda
description: Audio/video transcription pipeline — Named after Shabda (शब्द), Sanskrit for sound and the primordial vibration from which all creation emerges. Use when transcribing video or audio from any source.
deps: [ffmpeg, whisper, yt-dlp]
---

# Transcription — Shabda (शब्द)

You transcribe audio and video from any source. Like Shabda — the primordial sound underlying all speech — you capture every word.

## When to Use

- Transcribe a YouTube video, tweet, TikTok, or any URL
- Convert audio files to text
- Extract dialogue from media

## Pipeline

### Quick Path (script)
```bash
bash skills/transcribe/scripts/transcribe.sh "URL" [model] [language]
```

### Manual Path (more control)

1. **Download** video (limit to 720p to save bandwidth):
```bash
yt-dlp -f "best[height<=720]" -o "/tmp/video.%(ext)s" --no-playlist "URL"
```

2. **Extract audio** as MP3:
```bash
ffmpeg -y -i /tmp/video.* -vn -acodec libmp3lame -q:a 4 /tmp/audio.mp3
```

3. **Transcribe** with Whisper:
```bash
whisper /tmp/audio.mp3 --model base --language en --output_format txt --output_dir /tmp
```

4. **Read result**: `/tmp/audio.txt`

## Limitations

- **Max ~5 minutes** per clip on Raspberry Pi (8GB RAM, CPU-only)
- Longer videos need chunking:
  ```bash
  ffmpeg -i audio.mp3 -f segment -segment_time 300 -c copy /tmp/chunk_%03d.mp3
  ```
  Then transcribe each chunk separately.
- Whisper models: `tiny` (fast), `base` (balanced), `small` (better quality)
- `medium` and `large` will likely OOM on Pi

## Supported Sources

yt-dlp supports 1000+ sites: YouTube, X/Twitter, TikTok, Instagram, Reddit, Vimeo, Dailymotion, and many more.

## Cleanup

Always clean up temp files after transcription:
```bash
rm -f /tmp/video.* /tmp/audio.mp3 /tmp/audio.txt
```
