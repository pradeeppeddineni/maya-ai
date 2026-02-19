#!/usr/bin/env bash
# Shabda transcription pipeline: URL → audio → text
set -euo pipefail

URL="${1:?Usage: transcribe.sh <url> [model] [language]}"
MODEL="${2:-base}"
LANG="${3:-en}"
TMP_DIR=$(mktemp -d)

echo "📥 Downloading..."
yt-dlp -f "best[height<=720]" -o "$TMP_DIR/video.%(ext)s" --no-playlist "$URL"

VIDEO=$(ls "$TMP_DIR"/video.* | head -1)
AUDIO="$TMP_DIR/audio.mp3"

echo "🎵 Extracting audio..."
ffmpeg -y -i "$VIDEO" -vn -acodec libmp3lame -q:a 4 "$AUDIO" 2>/dev/null

echo "📝 Transcribing..."
whisper "$AUDIO" --model "$MODEL" --language "$LANG" --output_format txt --output_dir "$TMP_DIR"

cat "$TMP_DIR/audio.txt"
rm -rf "$TMP_DIR"
