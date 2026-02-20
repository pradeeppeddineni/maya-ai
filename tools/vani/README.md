# Vani (वाणी) 🎙️

> *Sanskrit for "voice, speech" — the divine power of expression*

A floating voice input widget for Claude CLI and any text input. Press a button, speak, and your words appear where you need them.

![Vani Widget](preview.png)

## What It Does

- 🎙️ **Floating mic button** — always on top, drag anywhere on screen
- 🔴 **Visual feedback** — pulsing animation + waveform while recording
- ⚡ **Fast** — ~400ms with CPU, under 100ms with CUDA GPU
- 📋 **Auto-paste** — transcription goes straight to your active window
- 🔒 **100% local** — no cloud, no internet, just your machine

## Quick Start (Windows)

```bash
# 1. Install Python deps
pip install faster-whisper sounddevice numpy pyperclip pyautogui pynput pillow

# 2. On Windows, also install
pip install pywin32

# 3. Run
python vani.py
```

## Usage

1. **Click the mic icon** to start recording  
   — OR press **Ctrl+Shift+Space** anywhere
2. Speak naturally
3. **Click again** (or press hotkey) to stop
4. Text is automatically pasted into your active window (Claude CLI, terminal, anything)

## How It Works

```
Click mic (or Ctrl+Shift+Space)
    ↓
Audio captured from microphone
    ↓
Visual feedback: pulsing red + waveform
    ↓
Click again to stop
    ↓
faster-whisper transcribes locally (~100-400ms)
    ↓
"✓ text preview" shown
    ↓
Text copied to clipboard + pasted into previous window
```

## GPU Acceleration (Recommended)

With NVIDIA GPU (like RTX 3500 Ada), transcription is **10x faster**:

```bash
pip install faster-whisper
# CUDA is auto-detected — no extra config needed
```

Vani auto-detects in order: **CUDA → CPU → OpenAI Whisper**

## Requirements

- Python 3.10+
- Microphone
- Windows / macOS / Linux (X11)

### Platform Notes

| Platform | Notes |
|----------|-------|
| **Windows** | Works out of the box. `pip install pywin32` recommended |
| **macOS** | Grant Accessibility permissions for auto-paste |
| **Linux** | Install `xdotool` for auto-paste: `sudo apt install xdotool` |

## Configuration

Edit the top of `ui.py` to change colors, or modify `vani.py` to change:
- Default hotkey (currently `Ctrl+Shift+Space`)
- Whether to auto-paste or clipboard-only

## Part of maya-ai

Vani is part of the [maya-ai](https://github.com/pradeeppeddineni/maya-ai) ecosystem — a toolkit for building AI employees powered by OpenClaw.

---
*Built with ❤️ on a Raspberry Pi 5*
