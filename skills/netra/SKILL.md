---
name: netra
description: Camera and RTSP surveillance integration — Named after Netra (नेत्र), Sanskrit for eye. Capture snapshots, record clips, and run motion detection on RTSP/ONVIF cameras. Inspired by steipete/camsnap and steipete/Peekaboo.
version: 1.0.0
tags: [camera, rtsp, surveillance, snapshot, motion-detection, security]
---

# Camera & Surveillance — Netra (नेत्र)

You are the all-seeing eye. Like Netra — the divine eye that perceives all — you capture, monitor, and analyze visual feeds from cameras.

## When to Use

- Take snapshots from IP cameras
- Record video clips from RTSP streams
- Set up motion detection alerts
- Monitor security cameras
- Capture screenshots of applications/screens

## RTSP Camera Operations

### Snapshot
```bash
# Single frame capture from RTSP
ffmpeg -rtsp_transport tcp -i "rtsp://USER:PASS@CAMERA_IP:554/stream" \
  -frames:v 1 -q:v 2 /tmp/snapshot.jpg

# With timeout (5 seconds)
timeout 5 ffmpeg -rtsp_transport tcp -i "rtsp://USER:PASS@CAMERA_IP:554/stream" \
  -frames:v 1 -q:v 2 /tmp/snapshot.jpg
```

### Record Clip
```bash
# Record 30 seconds
ffmpeg -rtsp_transport tcp -i "rtsp://USER:PASS@CAMERA_IP:554/stream" \
  -t 30 -c copy /tmp/clip.mp4

# Record with re-encoding (smaller file)
ffmpeg -rtsp_transport tcp -i "rtsp://USER:PASS@CAMERA_IP:554/stream" \
  -t 30 -c:v libx264 -preset fast -crf 28 /tmp/clip.mp4
```

### Motion Detection
```bash
# Using ffmpeg scene change detection
ffmpeg -rtsp_transport tcp -i "rtsp://USER:PASS@CAMERA_IP:554/stream" \
  -vf "select='gt(scene,0.3)',showinfo" -vsync vfr /tmp/motion_%04d.jpg

# Simple motion detect with frame differencing
python3 -c "
import cv2
cap = cv2.VideoCapture('rtsp://USER:PASS@CAMERA_IP:554/stream')
ret, prev = cap.read()
prev_gray = cv2.cvtColor(prev, cv2.COLOR_BGR2GRAY)
while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    diff = cv2.absdiff(prev_gray, gray)
    if diff.mean() > 20:  # motion threshold
        cv2.imwrite('/tmp/motion.jpg', frame)
        print('Motion detected!')
    prev_gray = gray
"
```

## Using camsnap CLI

```bash
# Install
go install github.com/steipete/camsnap@latest

# Snapshot
camsnap snap rtsp://USER:PASS@CAMERA_IP:554/stream -o /tmp/snap.jpg

# Short clip
camsnap clip rtsp://USER:PASS@CAMERA_IP:554/stream -d 10s -o /tmp/clip.mp4

# Motion detection
camsnap motion rtsp://USER:PASS@CAMERA_IP:554/stream --threshold 0.3
```

## OpenClaw Node Cameras

If using OpenClaw paired devices:
```
# Use the nodes tool
nodes camera_snap --facing back  # Phone camera
nodes camera_snap --facing front
nodes camera_clip --duration 10s --facing back
```

## Screen Capture

### On Linux (headless Pi)
```bash
# If display available
scrot /tmp/screenshot.png

# Via OpenClaw browser
# Use browser screenshot tool
```

### Using Peekaboo (macOS only)
```bash
# Capture specific app
peekaboo --app "Safari" -o /tmp/safari.png

# Capture full screen
peekaboo --screen -o /tmp/screen.png

# With AI description
peekaboo --app "Code" --describe "What's on screen?"
```

## Camera Configuration Storage

Store camera details in TOOLS.md:
```markdown
## Cameras
- **Front door**: rtsp://admin:pass@192.168.1.100:554/stream1
- **Backyard**: rtsp://admin:pass@192.168.1.101:554/stream1
- **Garage**: rtsp://admin:pass@192.168.1.102:554/stream1
```

## Best Practices

1. **Use TCP transport**: More reliable than UDP for RTSP
2. **Timeout everything**: Cameras can hang; always use timeouts
3. **Compress snapshots**: JPEG quality 80 balances size/quality
4. **Secure credentials**: Never hardcode camera passwords
5. **Rate limit**: Don't poll cameras more than 1/sec
6. **Storage**: Clean up old captures; use /tmp for ephemeral shots
