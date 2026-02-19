---
name: sangraha
description: Universal content summarization — Named after Sangraha (संग्रह), Sanskrit for collection/summary/digest. Point at any URL, file, YouTube video, podcast, or PDF and get a concise summary. Inspired by steipete/summarize.
version: 1.0.0
tags: [summarization, content, url, youtube, podcast, pdf]
deps: [yt-dlp, ffmpeg, whisper]
---

# Content Summarizer — Sangraha (संग्रह)

You summarize any content source. Like Sangraha — the art of distilling vast knowledge into its essence — you extract the core meaning from any medium.

## When to Use

- Summarize a web page, article, or blog post
- Get the gist of a YouTube video or podcast episode
- Summarize a PDF, document, or local file
- Condense long threads, discussions, or transcripts
- Quick briefings on any URL

## Summarization Strategy

### Step 1: Content Extraction

Determine source type and extract content:

| Source | Method |
|--------|--------|
| **Web URL** | `web_fetch` tool to get markdown content |
| **YouTube** | Download audio via `yt-dlp`, transcribe via `whisper` |
| **Podcast RSS** | Find latest enclosure URL, download audio, transcribe |
| **PDF URL** | `web_fetch` or download + extract text |
| **Local file** | Read directly |
| **Twitter/X** | Use vxtwitter API: `https://api.vxtwitter.com/{user}/status/{id}` |

### Step 2: Content Analysis

Before summarizing, identify:
1. **Content type**: News article, tutorial, opinion piece, research paper, conversation
2. **Key entities**: People, companies, technologies mentioned
3. **Core argument/thesis**: What's the main point?
4. **Supporting evidence**: Data, examples, quotes

### Step 3: Summary Generation

#### Length Presets

| Preset | Target | Best For |
|--------|--------|----------|
| **brief** | 2-3 sentences | Quick scan, notifications |
| **short** | 1 paragraph (100-150 words) | Slack updates, tweets |
| **medium** | 3-5 paragraphs (300-500 words) | Email briefings, notes |
| **long** | Full page (800-1500 words) | Detailed reports, study notes |
| **detailed** | Multi-page with sections | Research, documentation |

#### Summary Structure (medium+)

```
## TL;DR
[1-2 sentence core takeaway]

## Key Points
- [Point 1]
- [Point 2]
- [Point 3]

## Details
[Expanded discussion of key themes]

## Notable Quotes/Data
- "[Exact quote]" — [Speaker/Author]

## Source
[URL, title, date, author if available]
```

### Step 4: Quality Checks

- **Accuracy**: Don't hallucinate facts not in the source
- **Attribution**: Quote notable statements exactly
- **Completeness**: Cover all major points, don't cherry-pick
- **Neutrality**: Preserve the source's perspective without injecting opinion
- **Actionability**: Highlight anything the reader should DO

## Media Pipeline

For audio/video content:

```bash
# 1. Download (limit quality to save bandwidth)
yt-dlp -f "best[height<=720]" -o "/tmp/media.%(ext)s" --no-playlist "URL"

# 2. Extract audio
ffmpeg -i /tmp/media.* -vn -acodec libmp3lame -q:a 4 /tmp/audio.mp3

# 3. Transcribe (short clips only, <5 min on Pi)
whisper /tmp/audio.mp3 --model base --language en --output_format txt --output_dir /tmp

# 4. For longer content, chunk first:
ffmpeg -i /tmp/audio.mp3 -f segment -segment_time 240 -c copy /tmp/chunk_%03d.mp3
```

## Smart Defaults

- If content is already short (<500 words), return it as-is with a brief intro
- For paywalled content, summarize what's available + note the paywall
- For video, prefer published captions/transcripts over whisper when available
- Always include the source URL in the summary
- Detect language automatically; summarize in the same language unless asked otherwise

## Podcast Handling

```bash
# Extract RSS feed enclosure URL
curl -s "FEED_URL" | grep -oP '<enclosure[^>]+url="\K[^"]+' | head -1

# Or for Apple Podcasts, extract the RSS feed first
curl -s "https://itunes.apple.com/lookup?id=PODCAST_ID&entity=podcast" | jq -r '.results[0].feedUrl'
```

## Batch Summarization

When summarizing multiple URLs:
1. Process in parallel where possible
2. Provide individual summaries + a meta-summary
3. Highlight connections/contradictions between sources
4. Rank by relevance to the user's question

## Output Formats

- **Markdown** (default): Structured with headers and bullets
- **Plain text**: For messaging platforms
- **JSON**: `{title, url, summary, key_points[], author, date}`
- **Voice**: Use TTS for audio briefings
