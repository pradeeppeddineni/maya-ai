"""
Vani (वाणी) - Floating Voice Input Widget
Beautiful floating mic button with visual feedback
"""
import tkinter as tk
from tkinter import font as tkfont
import threading
import math
import time

# Colors
BG_IDLE      = "#1a1a2e"
BG_RECORDING = "#2d1515"
ACCENT       = "#e94560"
ACCENT_GLOW  = "#ff6b8a"
TEXT_COLOR   = "#eaeaea"
SUCCESS      = "#4ade80"
MIC_IDLE     = "#9ca3af"
MIC_HOT      = "#ff4444"

class VaniWidget:
    def __init__(self, on_transcription=None):
        self.on_transcription = on_transcription
        self.recording = False
        self.processing = False
        self.amplitude = 0.0
        self._pulse_angle = 0
        self._drag_x = 0
        self._drag_y = 0

        self._build_window()
        self._build_ui()
        self._animate()

    def _build_window(self):
        self.root = tk.Tk()
        self.root.title("Vani")
        self.root.overrideredirect(True)   # no title bar
        self.root.attributes("-topmost", True)
        self.root.attributes("-alpha", 0.95)
        self.root.configure(bg=BG_IDLE)

        # Position: top-right corner
        sw = self.root.winfo_screenwidth()
        self.root.geometry(f"220x70+{sw-240}+20")

        # Make draggable
        self.root.bind("<ButtonPress-1>", self._drag_start)
        self.root.bind("<B1-Motion>", self._drag_move)

    def _build_ui(self):
        # Main frame
        self.frame = tk.Frame(self.root, bg=BG_IDLE, bd=0)
        self.frame.pack(fill=tk.BOTH, expand=True, padx=2, pady=2)

        # Canvas for mic button + waveform
        self.canvas = tk.Canvas(
            self.frame, width=220, height=70,
            bg=BG_IDLE, highlightthickness=0, bd=0
        )
        self.canvas.pack()

        # Rounded background
        self._draw_pill()

        # Mic icon button (left)
        self.canvas.bind("<Button-1>", self._on_click)
        self.canvas.bind("<Enter>", lambda e: self.canvas.config(cursor="hand2"))
        self.canvas.bind("<Leave>", lambda e: self.canvas.config(cursor=""))

        # Status text
        self.status_text = self.canvas.create_text(
            130, 35, text="Click to speak",
            fill=MIC_IDLE, font=("Segoe UI", 10),
            anchor="center"
        )

        # Mic icon
        self.mic_icon = self.canvas.create_text(
            45, 35, text="🎙️",
            font=("Segoe UI Emoji", 20), fill=TEXT_COLOR,
            anchor="center"
        )

        # Pulse rings (hidden by default)
        self.pulse_rings = []
        for i in range(3):
            ring = self.canvas.create_oval(
                25, 15, 65, 55,
                outline=MIC_HOT, width=1, state="hidden"
            )
            self.pulse_rings.append(ring)

        # Waveform bars
        self.wave_bars = []
        bar_x_start = 95
        for i in range(6):
            bar = self.canvas.create_rectangle(
                bar_x_start + i*12, 35, bar_x_start + i*12 + 6, 35,
                fill=ACCENT, outline="", state="hidden"
            )
            self.wave_bars.append(bar)

        # Close button
        close_btn = self.canvas.create_text(
            205, 12, text="×",
            fill="#666", font=("Segoe UI", 12, "bold"),
            anchor="center"
        )
        self.canvas.tag_bind(close_btn, "<Button-1>", lambda e: self.root.destroy())
        self.canvas.tag_bind(close_btn, "<Enter>",
            lambda e: self.canvas.itemconfig(close_btn, fill=TEXT_COLOR))
        self.canvas.tag_bind(close_btn, "<Leave>",
            lambda e: self.canvas.itemconfig(close_btn, fill="#666"))

    def _draw_pill(self):
        r = 20
        self.canvas.create_arc(2, 2, 2+r*2, 2+r*2, start=90, extent=90, fill=BG_IDLE, outline=BG_IDLE)
        self.canvas.create_arc(218-r*2, 2, 218, 2+r*2, start=0, extent=90, fill=BG_IDLE, outline=BG_IDLE)

    def _on_click(self, event):
        # Ignore clicks on close button area
        if event.x > 190 and event.y < 25:
            return
        if not self.processing:
            self._toggle_recording()

    def _toggle_recording(self):
        if not self.recording:
            self._start_recording()
        else:
            self._stop_recording()

    def _start_recording(self):
        from recorder import Recorder
        self.recording = True
        self.recorder = Recorder()
        self.recorder.amplitude_callback = self._update_amplitude

        self.canvas.itemconfig(self.status_text, text="Recording...", fill=MIC_HOT)
        self.canvas.itemconfig(self.mic_icon, fill=MIC_HOT)
        self.root.configure(bg=BG_RECORDING)
        self.canvas.configure(bg=BG_RECORDING)
        self.frame.configure(bg=BG_RECORDING)

        # Show waveform
        for bar in self.wave_bars:
            self.canvas.itemconfig(bar, state="normal")

        # Show pulse rings
        for ring in self.pulse_rings:
            self.canvas.itemconfig(ring, state="normal")

        self.recorder.start()

    def _stop_recording(self):
        self.recording = False
        self.processing = True

        self.canvas.itemconfig(self.status_text, text="Processing...", fill=TEXT_COLOR)
        self.canvas.itemconfig(self.mic_icon, fill=TEXT_COLOR)

        # Hide waveform/rings
        for bar in self.wave_bars:
            self.canvas.itemconfig(bar, state="hidden")
        for ring in self.pulse_rings:
            self.canvas.itemconfig(ring, state="hidden")

        # Transcribe in background thread
        threading.Thread(target=self._do_transcribe, daemon=True).start()

    def _do_transcribe(self):
        try:
            audio = self.recorder.stop()

            if audio is not None and len(audio) > 1600:  # min 0.1s
                from transcriber import Transcriber
                if not hasattr(self, '_transcriber'):
                    self._transcriber = Transcriber()

                text = self._transcriber.transcribe(audio)

                if text:
                    self._show_success(text)
                    if self.on_transcription:
                        self.on_transcription(text)
                    else:
                        # Auto-inject
                        from injector import inject_text
                        self.root.after(100, lambda: inject_text(text))
                else:
                    self._show_idle("Nothing heard")
            else:
                self._show_idle("Too short")

        except Exception as e:
            self._show_idle(f"Error: {str(e)[:20]}")
        finally:
            self.processing = False

    def _show_success(self, text):
        preview = text[:25] + "..." if len(text) > 25 else text
        self.root.configure(bg=BG_IDLE)
        self.canvas.configure(bg=BG_IDLE)
        self.frame.configure(bg=BG_IDLE)
        self.canvas.itemconfig(self.status_text, text=f"✓ {preview}", fill=SUCCESS)
        self.canvas.itemconfig(self.mic_icon, fill=SUCCESS)
        self.root.after(2500, lambda: self._show_idle("Click to speak"))

    def _show_idle(self, msg="Click to speak"):
        self.root.configure(bg=BG_IDLE)
        self.canvas.configure(bg=BG_IDLE)
        self.frame.configure(bg=BG_IDLE)
        self.canvas.itemconfig(self.status_text, text=msg, fill=MIC_IDLE)
        self.canvas.itemconfig(self.mic_icon, fill=TEXT_COLOR)

    def _update_amplitude(self, amplitude):
        self.amplitude = amplitude

    def _animate(self):
        """Animation loop - pulse rings + waveform bars"""
        self._pulse_angle += 0.15

        if self.recording:
            # Pulse rings
            for i, ring in enumerate(self.pulse_rings):
                phase = self._pulse_angle - i * 0.8
                scale = 0.5 + 0.5 * math.sin(phase) + self.amplitude * 0.3
                offset = int(10 + scale * 8)
                self.canvas.coords(
                    ring,
                    45 - offset, 35 - offset,
                    45 + offset, 35 + offset
                )
                alpha_val = max(0.2, math.sin(phase) * 0.5 + 0.5)
                color = self._lerp_color("#2d1515", MIC_HOT, alpha_val)
                self.canvas.itemconfig(ring, outline=color, width=max(1, int(scale)))

            # Waveform bars
            bar_heights = []
            for i in range(len(self.wave_bars)):
                phase = self._pulse_angle * 2 + i * 0.7
                h = int(8 + 14 * (math.sin(phase) * 0.5 + 0.5) + self.amplitude * 15)
                bar_heights.append(h)

            cx, cy = 130, 35
            bar_x_start = 95
            for i, (bar, h) in enumerate(zip(self.wave_bars, bar_heights)):
                x = bar_x_start + i * 12
                self.canvas.coords(bar, x, cy - h//2, x + 6, cy + h//2)

        self.root.after(30, self._animate)

    def _lerp_color(self, c1, c2, t):
        r1, g1, b1 = int(c1[1:3],16), int(c1[3:5],16), int(c1[5:7],16)
        r2, g2, b2 = int(c2[1:3],16), int(c2[3:5],16), int(c2[5:7],16)
        r = int(r1 + (r2-r1)*t)
        g = int(g1 + (g2-g1)*t)
        b = int(b1 + (b2-b1)*t)
        return f"#{r:02x}{g:02x}{b:02x}"

    def _drag_start(self, event):
        self._drag_x = event.x
        self._drag_y = event.y

    def _drag_move(self, event):
        x = self.root.winfo_x() + event.x - self._drag_x
        y = self.root.winfo_y() + event.y - self._drag_y
        self.root.geometry(f"+{x}+{y}")

    def run(self):
        self.root.mainloop()
