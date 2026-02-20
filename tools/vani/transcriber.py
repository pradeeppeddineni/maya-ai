"""
Vani - Transcription Engine
Auto-detects best available STT: faster-whisper CUDA > faster-whisper CPU > whisper
"""
import numpy as np
import os

class Transcriber:
    def __init__(self):
        self.model = None
        self.engine = None
        self._load_best_engine()

    def _load_best_engine(self):
        # Try faster-whisper with CUDA first
        try:
            from faster_whisper import WhisperModel
            try:
                self.model = WhisperModel("base", device="cuda", compute_type="float16")
                self.engine = "faster-whisper-cuda"
                print(f"[Vani] Using faster-whisper with CUDA 🚀")
                return
            except Exception:
                pass

            # Fall back to faster-whisper CPU
            self.model = WhisperModel("base", device="cpu", compute_type="int8")
            self.engine = "faster-whisper-cpu"
            print(f"[Vani] Using faster-whisper on CPU")
            return
        except ImportError:
            pass

        # Fall back to openai-whisper
        try:
            import whisper
            self.model = whisper.load_model("base")
            self.engine = "whisper"
            print(f"[Vani] Using OpenAI Whisper")
            return
        except ImportError:
            pass

        raise RuntimeError("No STT engine found. Install faster-whisper: pip install faster-whisper")

    def transcribe(self, audio: np.ndarray, sample_rate: int = 16000) -> str:
        if audio is None or len(audio) == 0:
            return ""

        # Normalize audio
        audio = audio.flatten().astype(np.float32)
        if audio.max() > 1.0:
            audio = audio / 32768.0

        if "faster-whisper" in self.engine:
            import tempfile, soundfile as sf
            # faster-whisper needs a file or float32 array
            segments, info = self.model.transcribe(audio, language="en", vad_filter=True)
            text = " ".join(seg.text for seg in segments).strip()
            return text

        elif self.engine == "whisper":
            result = self.model.transcribe(audio, language="en", fp16=False)
            return result["text"].strip()

        return ""
