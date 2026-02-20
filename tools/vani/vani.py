"""
Vani (वाणी) - Voice Input for Claude CLI
A floating microphone widget with visual feedback

Usage:
    python vani.py

Hotkey: Ctrl+Shift+Space (alternative to clicking)
"""
import threading
import sys

def setup_hotkey(widget):
    """Register global hotkey Ctrl+Shift+Space"""
    try:
        from pynput import keyboard

        def on_activate():
            widget.root.after(0, widget._toggle_recording)

        hotkey = keyboard.GlobalHotKeys({
            '<ctrl>+<shift>+<space>': on_activate
        })
        hotkey.start()
        print("[Vani] Hotkey registered: Ctrl+Shift+Space")
    except ImportError:
        print("[Vani] pynput not installed, hotkey disabled. Click the widget instead.")
    except Exception as e:
        print(f"[Vani] Hotkey failed: {e}")

def main():
    print("""
╔══════════════════════════════════╗
║   Vani (वाणी) - Voice for Claude ║
╚══════════════════════════════════╝

🎙️  Click the floating widget to record
⌨️   Or press Ctrl+Shift+Space
📋  Transcribed text will be pasted into your active window
""")

    # Pre-load transcriber in background so first use is fast
    def preload():
        try:
            from transcriber import Transcriber
            t = Transcriber()
            print(f"[Vani] Transcriber ready: {t.engine}")
            return t
        except Exception as e:
            print(f"[Vani] Transcriber preload failed: {e}")

    from ui import VaniWidget

    # Create widget
    widget = VaniWidget()

    # Start transcriber preload in background
    transcriber_ref = [None]
    def preload_done():
        transcriber_ref[0] = preload()
        if transcriber_ref[0]:
            widget._transcriber = transcriber_ref[0]
            widget.canvas.itemconfig(widget.status_text, text="Click to speak ✓")

    threading.Thread(target=preload_done, daemon=True).start()

    # Register global hotkey
    setup_hotkey(widget)

    # Run UI
    widget.run()

if __name__ == "__main__":
    main()
