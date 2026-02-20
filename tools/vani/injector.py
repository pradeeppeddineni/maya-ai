"""
Vani - Text Injector
Copies transcribed text to clipboard and pastes into previous window
"""
import pyperclip
import time
import platform

def inject_text(text: str, auto_paste: bool = True):
    """Copy text to clipboard and optionally paste into previously focused window"""
    if not text:
        return

    # Copy to clipboard
    pyperclip.copy(text)

    if not auto_paste:
        return

    # Paste into previous window
    if platform.system() == "Windows":
        _paste_windows()
    elif platform.system() == "Darwin":
        _paste_macos()
    else:
        _paste_linux()

def _paste_windows():
    try:
        import pyautogui
        time.sleep(0.1)
        pyautogui.hotkey('ctrl', 'v')
    except Exception as e:
        print(f"[Vani] Paste failed: {e}")

def _paste_macos():
    try:
        import pyautogui
        time.sleep(0.1)
        pyautogui.hotkey('command', 'v')
    except Exception as e:
        print(f"[Vani] Paste failed: {e}")

def _paste_linux():
    try:
        import subprocess
        time.sleep(0.1)
        subprocess.run(['xdotool', 'key', 'ctrl+v'], check=True)
    except Exception as e:
        print(f"[Vani] Paste failed: {e}")
