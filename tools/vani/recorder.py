"""
Vani - Audio Recorder
Captures microphone input as numpy array
"""
import numpy as np
import sounddevice as sd
import threading

class Recorder:
    def __init__(self, sample_rate=16000, channels=1):
        self.sample_rate = sample_rate
        self.channels = channels
        self.recording = False
        self.frames = []
        self._thread = None
        self.amplitude_callback = None  # called with amplitude 0-1 during recording

    def start(self):
        self.frames = []
        self.recording = True
        self._thread = threading.Thread(target=self._record, daemon=True)
        self._thread.start()

    def stop(self):
        self.recording = False
        if self._thread:
            self._thread.join(timeout=2)
        if self.frames:
            return np.concatenate(self.frames, axis=0)
        return None

    def _record(self):
        def callback(indata, frames, time, status):
            if self.recording:
                self.frames.append(indata.copy())
                if self.amplitude_callback:
                    amplitude = float(np.abs(indata).mean())
                    self.amplitude_callback(min(amplitude * 20, 1.0))

        with sd.InputStream(
            samplerate=self.sample_rate,
            channels=self.channels,
            dtype='float32',
            callback=callback,
            blocksize=1024
        ):
            while self.recording:
                sd.sleep(50)
